import { fotmobGet, fetchJson, getCache, setCache, toYmd, toIso, TTL } from './fotmob.client';
import {
  IMG_TEAM,
  IMG_LEAGUE,
  IMG_PLAYER,
  isLive,
  withLeagueLogos,
  splitFixturesResults,
  extractTopStats,
  matchEvents,
  goalsAndCards,
  buildTimeline,
  normalizeTable,
  statBlockByHeader,
  enrichStatBlock,
  playerPosition,
  playerAge,
  normalizeSquad,
  filterTransfers,
  suggestInfo,
  type TransferFilter,
} from '../utils/normalize';

const IMG_PLAYER_LARGE = (id: number | string) =>
  `https://images.fotmob.com/image_resources/playerimages/${id}.png`;

export const img = { team: IMG_TEAM, league: IMG_LEAGUE, player: IMG_PLAYER };

export function toYmdSafe(v: string): string {
  return toYmd(v);
}

// ── Matches ────────────────────────────────────────────────────────────────

export async function getMatchesByDate(date: string, timezone = 'Asia/Jakarta', ccode3 = 'IDN'): Promise<any> {
  const ymd = toYmd(date);
  const key = `matches:${ymd}:${timezone}:${ccode3}`;
  const hit = getCache(key, TTL.matches);
  if (hit) return hit;
  const raw: any = await fotmobGet(`/data/matches?date=${ymd}&timezone=${encodeURIComponent(timezone)}&ccode3=${ccode3}`);
  const data = withLeagueLogos(raw);
  setCache(key, data);
  return data;
}

export async function getLiveMatches(timezone = 'Asia/Jakarta', ccode3 = 'IDN'): Promise<{ leagues: any[]; total: number; date: string }> {
  const data: any = await getMatchesByDate(toIso(new Date().toISOString().split('T')[0]), timezone, ccode3);
  const leagues = (data?.leagues || [])
    .map((lg: any) => {
      const live = (lg.matches || []).filter((m: any) => isLive(m.status));
      if (live.length === 0) return null;
      return { ...lg, matches: live.map((m: any) => ({ ...m, isLive: true })) };
    })
    .filter(Boolean);
  const total = leagues.reduce((n: number, l: any) => n + l.matches.length, 0);
  return { leagues, total, date: data?.date };
}

export async function getNotableMatches(): Promise<any> {
  const key = 'notable:en-GB:GBR';
  const hit = getCache(key, TTL.matches);
  if (hit) return hit;
  const data = await fotmobGet('/data/notableMatches?lang=en-GB&country=GBR');
  setCache(key, data);
  return data;
}

export function dateRangeArray(from: string, to: string, maxDays = 51): string[] {
  const dates: string[] = [];
  const current = new Date(toIso(from));
  const end = new Date(toIso(to));
  if (Number.isNaN(current.getTime()) || Number.isNaN(end.getTime())) return dates;
  while (current <= end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
    if (dates.length >= maxDays) break;
  }
  return dates;
}

export async function getMatchesByDateRange(from: string, to: string, timezone = 'Asia/Jakarta', ccode3 = 'IDN'): Promise<{ leagues: any[]; total: number; from: string; to: string }> {
  const dates = dateRangeArray(from, to);
  const seen = new Set<string>();
  const leagueMap = new Map<string, any>();
  await Promise.all(
    dates.map(async (d) => {
      try {
        const day: any = await getMatchesByDate(d, timezone, ccode3);
        for (const lg of day?.leagues || []) {
          const lid = String(lg.primaryId || lg.id || lg.name);
          let merged = leagueMap.get(lid);
          if (!merged) {
            merged = { id: lg.id, primaryId: lg.primaryId, name: lg.name, ccode: lg.ccode || null, logo: IMG_LEAGUE(lg.primaryId || lg.id), matches: [] as any[] };
            leagueMap.set(lid, merged);
          }
          for (const m of lg.matches || []) {
            const mid = String(m.id || '');
            if (mid && !seen.has(mid)) {
              seen.add(mid);
              merged.matches.push({ ...m, isLive: isLive(m.status) });
            }
          }
        }
      } catch {
        return;
      }
    }),
  );
  return { leagues: Array.from(leagueMap.values()), total: seen.size, from: toIso(from), to: toIso(to) };
}

// ── Match ──────────────────────────────────────────────────────────────────

export async function getMatchDetail(matchId: string): Promise<any> {
  const key = `matchDetails:${matchId}`;
  const hit = getCache(key, TTL.matchDetail);
  if (hit) return hit;
  const data = await fotmobGet(`/data/matchDetails?matchId=${matchId}`);
  setCache(key, data);
  return data;
}

export async function getMatchSummary(matchId: string): Promise<any> {
  const key = `match:${matchId}`;
  const hit = getCache(key, TTL.matchDetail);
  if (hit) return hit;
  const data = await fotmobGet(`/data/match?id=${matchId}`);
  setCache(key, data);
  return data;
}

export async function getMatchMedia(matchId: string): Promise<any> {
  return fotmobGet(`/data/matchMedia?matchId=${matchId}&ccode3=IDN`);
}

export async function getMatchOdds(matchId: string): Promise<any> {
  try {
    return await fotmobGet(`/data/matchOdds?matchId=${matchId}&ccode3=IDN`);
  } catch {
    return null;
  }
}

export async function getTvListings(matchId: string, countryCode = 'ID'): Promise<any> {
  return fotmobGet(`/data/tvlistings?countryCode=${countryCode}&ids=${matchId}`);
}

// Ringkasan siap-render untuk frontend (header + skor + form + fakta kunci)
export async function getMatchOverview(matchId: string): Promise<any> {
  const [details, summary] = await Promise.allSettled([getMatchDetail(matchId), getMatchSummary(matchId)]);
  const d: any = details.status === 'fulfilled' ? details.value : null;
  const s: any = summary.status === 'fulfilled' ? summary.value : null;
  const header = d?.header || {};
  const teams = (header.teams || []).map((t: any) => ({ ...t, logo: t?.logo || IMG_TEAM(t?.id) }));
  const status = header.status || s?.status || null;
  const events = matchEvents(d);
  const { goals, cards } = goalsAndCards(events);
  return {
    id: matchId,
    general: d?.general || null,
    teams,
    status,
    score: status?.scoreStr || null,
    isLive: isLive(status),
    goals,
    cards,
    playerOfTheMatch: d?.content?.matchFacts?.playerOfTheMatch || null,
    infoBox: d?.content?.matchFacts?.infoBox || null,
    topStats: extractTopStats(d),
    summary: s,
  };
}

export async function getMatchTimeline(matchId: string): Promise<any> {
  const d: any = await getMatchDetail(matchId);
  const events = matchEvents(d);
  const { goals, cards } = goalsAndCards(events);
  return {
    id: matchId,
    isLive: isLive(d?.header?.status),
    status: d?.header?.status || null,
    timeline: buildTimeline(d),
    goals,
    cards,
    penaltyShootout: d?.content?.matchFacts?.events?.penaltyShootoutEvents || null,
  };
}

export async function getMatchCommentary(matchId: string): Promise<any> {
  const d: any = await getMatchDetail(matchId);
  return {
    id: matchId,
    liveticker: d?.content?.liveticker || null,
    events: matchEvents(d),
    timeline: buildTimeline(d),
    superlive: d?.content?.superlive || null,
    buzz: d?.content?.buzz || null,
    summary: await getMatchSummary(matchId).catch(() => null),
  };
}

export async function getMatchInfo(matchId: string): Promise<any> {
  const d: any = await getMatchDetail(matchId);
  return {
    id: matchId,
    general: d?.general || null,
    header: d?.header || null,
    infoBox: d?.content?.matchFacts?.infoBox || null,
    venue: d?.content?.matchFacts?.infoBox?.Stadium || null,
    referee: d?.content?.matchFacts?.infoBox?.Referee || null,
    teamForm: d?.content?.matchFacts?.teamForm || null,
    weather: d?.content?.weather || null,
    insights: d?.content?.matchFacts?.insights || null,
  };
}

export async function getMatchStats(matchId: string): Promise<any> {
  const d: any = await getMatchDetail(matchId);
  return {
    id: matchId,
    teams: (d?.header?.teams || []).map((t: any) => ({ ...t, logo: t?.logo || IMG_TEAM(t?.id) })),
    periods: d?.content?.stats?.Periods || null,
    topStats: extractTopStats(d),
    playerStats: d?.content?.playerStats || null,
    topPlayers: d?.content?.matchFacts?.topPlayers || null,
  };
}

export async function getMatchLineups(matchId: string): Promise<any> {
  const d: any = await getMatchDetail(matchId);
  return {
    id: matchId,
    lineup: d?.content?.lineup || null,
  };
}

export async function getMatchRatings(matchId: string): Promise<any> {
  const d: any = await getMatchDetail(matchId);
  return {
    id: matchId,
    playerStats: d?.content?.playerStats || null,
    topPlayers: d?.content?.matchFacts?.topPlayers || null,
    playerOfTheMatch: d?.content?.matchFacts?.playerOfTheMatch || null,
  };
}

export async function getMatchH2H(matchId: string): Promise<any> {
  const d: any = await getMatchDetail(matchId);
  return d?.content?.h2h || null;
}

export async function getMatchTable(matchId: string): Promise<any> {
  const d: any = await getMatchDetail(matchId);
  return d?.content?.table || null;
}

export async function getMatchMomentum(matchId: string): Promise<any> {
  const d: any = await getMatchDetail(matchId);
  const direct = d?.content?.momentum;
  if (direct && (Array.isArray(direct?.main?.data) ? direct.main.data.length > 0 : true)) return direct;
  const facts = d?.content?.matchFacts?.momentum;
  if (facts) return facts;
  return direct || null;
}

export async function getMatchShotmap(matchId: string): Promise<any> {
  const d: any = await getMatchDetail(matchId);
  return d?.content?.shotmap || null;
}

export async function getMatchHeatmap(matchId: string): Promise<any> {
  const d: any = await getMatchDetail(matchId);
  return {
    id: matchId,
    heatmapUrl: d?.content?.heatmapUrl || null,
    attackingZones: d?.content?.attackingZones || null,
  };
}

export function getMatchFacts(detail: any): any {
  return detail?.content?.matchFacts || detail || null;
}

// ── Leagues ────────────────────────────────────────────────────────────────

export async function getAllLeagues(): Promise<any> {
  const key = 'allLeagues';
  const hit = getCache(key, TTL.league);
  if (hit) return hit;
  const raw: any = await fotmobGet('/data/allLeagues');
  setCache(key, raw);
  return raw;
}

const CONTINENT_BY_CCODE: Record<string, string> = {
  ENG: 'Europe', ESP: 'Europe', ITA: 'Europe', GER: 'Europe', FRA: 'Europe',
  NED: 'Europe', POR: 'Europe', TUR: 'Europe', SCO: 'Europe', DEN: 'Europe',
  SWE: 'Europe', NOR: 'Europe', GRE: 'Europe', SUI: 'Europe', BEL: 'Europe',
  AUT: 'Europe', POL: 'Europe', CZE: 'Europe', CRO: 'Europe', SRB: 'Europe',
  ROU: 'Europe', BUL: 'Europe', HUN: 'Europe', UKR: 'Europe', RUS: 'Europe',
  IRL: 'Europe', ISL: 'Europe', WAL: 'Europe', NIR: 'Europe', CYP: 'Europe',
  ISR: 'Europe', GEO: 'Europe', SVK: 'Europe', SVN: 'Europe', BIH: 'Europe',
  MKD: 'Europe', MNE: 'Europe', ALB: 'Europe', LVA: 'Europe', LTU: 'Europe',
  EST: 'Europe', FIN: 'Europe', MLT: 'Europe', LUX: 'Europe',
  ARG: 'Americas', BRA: 'Americas', USA: 'Americas', MEX: 'Americas', CHI: 'Americas',
  COL: 'Americas', URU: 'Americas', ECU: 'Americas', PER: 'Americas', VEN: 'Americas',
  PAR: 'Americas', BOL: 'Americas', CRC: 'Americas', HON: 'Americas', PAN: 'Americas',
  GUA: 'Americas', SLV: 'Americas',
  JPN: 'Asia', KOR: 'Asia', KSA: 'Asia', AUS: 'Asia', CHN: 'Asia', IND: 'Asia',
  IRN: 'Asia', IRQ: 'Asia', QAT: 'Asia', UAE: 'Asia', THA: 'Asia', VIE: 'Asia',
  IDN: 'Asia', MAS: 'Asia', SGP: 'Asia', PHI: 'Asia', UZB: 'Asia', HKG: 'Asia',
  TPE: 'Asia', KAZ: 'Asia',
  RSA: 'Africa', MAR: 'Africa', EGY: 'Africa', NGA: 'Africa', GHA: 'Africa',
  SEN: 'Africa', CIV: 'Africa', CMR: 'Africa', TUN: 'Africa', ALG: 'Africa',
  INT: 'International',
};

export function continentOf(ccode?: string | null): string {
  if (!ccode) return 'Other';
  return CONTINENT_BY_CCODE[String(ccode).toUpperCase()] || 'Other';
}

function leagueWithLogo(lg: any): any {
  if (!lg || typeof lg !== 'object') return lg;
  return { ...lg, logo: lg.logo || IMG_LEAGUE(lg.id) };
}

// Direktori liga siap-render: populer + grup per benua + semua negara
export async function getLeaguesGrouped(): Promise<any> {
  const all: any = await getAllLeagues();
  const groups: Record<string, any[]> = {
    International: [],
    Europe: [],
    Americas: [],
    Asia: [],
    Africa: [],
    Other: [],
  };
  const seen = new Set<string>();
  const push = (lg: any, fallbackContinent?: string) => {
    const id = String(lg?.id || '');
    if (!id || seen.has(id)) return;
    seen.add(id);
    const withLogo = leagueWithLogo(lg);
    const cont = fallbackContinent || continentOf(lg?.ccode);
    (groups[cont] || groups.Other).push(withLogo);
  };
  for (const lg of all?.popular || []) push(lg);
  for (const grp of all?.international || []) {
    for (const lg of grp?.leagues || []) push(lg, 'International');
  }
  for (const c of all?.countries || []) {
    for (const lg of c?.leagues || []) push(lg);
  }
  return {
    popular: (all?.popular || []).map(leagueWithLogo),
    groups: Object.entries(groups)
      .filter(([, leagues]) => leagues.length > 0)
      .map(([continent, leagues]) => ({ continent, count: leagues.length, leagues })),
    countries: all?.countries || [],
    international: all?.international || [],
  };
}

export async function getLeagueDetail(leagueId: string, ccode3 = 'GBR'): Promise<any> {
  const key = `league:${leagueId}:${ccode3}`;
  const hit = getCache(key, TTL.league);
  if (hit) return hit;
  const data = await fotmobGet(`/data/leagues?id=${leagueId}&ccode3=${ccode3}`);
  setCache(key, data);
  return data;
}

export async function getLeagueTable(leagueId: string): Promise<any> {
  const key = `tltable:${leagueId}`;
  const hit = getCache(key, TTL.league);
  if (hit) return hit;
  const data = await fotmobGet(`/data/tltable?leagueId=${leagueId}`);
  setCache(key, data);
  return data;
}

export async function getLeagueTableNormalized(leagueId: string, scope: 'all' | 'home' | 'away' | 'form' | 'xg' = 'all'): Promise<any> {
  const raw: any = await getLeagueTable(leagueId);
  const norm = normalizeTable(raw);
  if (scope === 'all' || scope === 'home' || scope === 'away') {
    return { scope, table: norm[scope], legend: norm.legend };
  }
  return { scope, rows: norm[scope], legend: norm.legend };
}

export async function getLeagueXGTable(leagueId: string): Promise<any> {
  const raw: any = await getLeagueTable(leagueId);
  const norm = normalizeTable(raw);
  const rows = (norm.xg || []).map((r: any) => ({
    ...r,
    xgDiff: r.xg != null ? Number((Number(r.xg) - Number(r.xgConceded || 0)).toFixed(3)) : null,
  }));
  return { table: rows, legend: norm.legend };
}

export async function getLeagueFixtures(leagueId: string, season: string): Promise<any> {
  const key = `fixtures:${leagueId}:${season}`;
  const hit = getCache(key, TTL.league);
  if (hit) return hit;
  const data = await fotmobGet(`/data/fixtures?id=${leagueId}&season=${encodeURIComponent(season)}`);
  setCache(key, data);
  return data;
}

export async function getLeagueNews(leagueId: string, language = 'en-GB', startIndex = 0): Promise<any> {
  return fotmobGet(`/data/tlnews?id=${leagueId}&type=league&language=${language}&startIndex=${startIndex}`);
}

export async function getFixtureDifficulty(leagueId: string): Promise<any> {
  return fotmobGet(`/data/fixtureDifficulty?id=${leagueId}`);
}

// Agregat 1-panggilan untuk halaman liga di frontend
export async function getLeagueOverview(leagueId: string, season?: string, ccode3 = 'GBR'): Promise<any> {
  const detail: any = await getLeagueDetail(leagueId, ccode3);
  const resolvedSeason = season || detail?.details?.selectedSeason || (detail?.allAvailableSeasons || [])[0];
  const [tableRes, fixturesRes] = await Promise.allSettled([
    getLeagueTable(leagueId).catch(() => null),
    resolvedSeason ? getLeagueFixtures(leagueId, resolvedSeason).catch(() => null) : Promise.resolve(null),
  ]);
  const tableRaw = tableRes.status === 'fulfilled' ? tableRes.value : null;
  return {
    details: detail?.details || null,
    season: resolvedSeason || null,
    seasons: detail?.allAvailableSeasons || [],
    table: tableRaw ? normalizeTable(tableRaw) : null,
    tableRaw,
    fixtures: fixturesRes.status === 'fulfilled' ? fixturesRes.value : null,
    stats: detail?.stats || null,
    topPlayers: detail?.overview?.topPlayers || null,
    hasTotw: detail?.overview?.hasTotw ?? null,
    transfers: detail?.transfers || null,
    logo: IMG_LEAGUE(leagueId),
  };
}

export async function getLeagueStats(leagueId: string): Promise<any> {
  const detail: any = await getLeagueDetail(leagueId);
  return {
    players: detail?.stats?.players || [],
    teams: detail?.stats?.teams || [],
    topPlayers: detail?.overview?.topPlayers || null,
  };
}

export async function getFullStatList(fetchAllUrl: string): Promise<any> {
  const key = `statlist:${fetchAllUrl}`;
  const hit = getCache(key, TTL.league);
  if (hit) return hit;
  const data = await fetchJson(fetchAllUrl);
  setCache(key, data);
  return data;
}

export function normalizeStatList(payload: any): any[] {
  const list: any[] = payload?.TopLists?.[0]?.StatList || payload?.StatList || (Array.isArray(payload) ? payload : []);
  return list.map((p: any) => ({
    id: p?.ParticiantId ?? p?.id ?? null,
    name: p?.ParticipantName || p?.name || null,
    teamId: p?.TeamId ?? p?.teamId ?? null,
    teamName: p?.TeamName || p?.teamName || null,
    teamColor: p?.TeamColor || null,
    value: p?.StatValue ?? p?.value ?? null,
    subValue: p?.SubStatValue ?? null,
    rank: p?.Rank ?? p?.rank ?? null,
    country: p?.ParticipantCountryCode || p?.ccode || null,
    minutesPlayed: p?.MinutesPlayed ?? null,
    matchesPlayed: p?.MatchesPlayed ?? null,
    faceImageUrl: (p?.ParticiantId ?? p?.id) ? IMG_PLAYER(p.ParticiantId ?? p.id) : undefined,
    teamLogo: (p?.TeamId ?? p?.teamId) ? IMG_TEAM(p.TeamId ?? p.teamId) : undefined,
  }));
}

export async function getLeagueStatFull(leagueId: string, headerPattern: string): Promise<any> {
  const detail: any = await getLeagueDetail(leagueId);
  const block = statBlockByHeader(detail, new RegExp(headerPattern, 'i'));
  if (!block) return null;
  const enriched = enrichStatBlock(block);
  let full: any[] | null = null;
  if (block.fetchAllUrl) {
    try {
      const raw = await getFullStatList(block.fetchAllUrl);
      full = normalizeStatList(raw);
    } catch {
      full = null;
    }
  }
  return { ...enriched, full };
}

// ── Teams ──────────────────────────────────────────────────────────────────

export async function getTeamDetail(teamId: string, ccode3 = 'GBR'): Promise<any> {
  const key = `team:${teamId}:${ccode3}`;
  const hit = getCache(key, TTL.team);
  if (hit) return hit;
  const raw: any = await fotmobGet(`/data/teams?id=${teamId}&ccode3=${ccode3}`);
  const data = { ...raw, logo: raw?.logo || IMG_TEAM(teamId) };
  setCache(key, data);
  return data;
}

export async function getTeamNews(teamId: string, language = 'en-GB', startIndex = 0): Promise<any> {
  return fotmobGet(`/data/tlnews?id=${teamId}&type=team&language=${language}&startIndex=${startIndex}`);
}

export async function getTeamSeasonStats(teamId: string, tournamentId: string): Promise<any> {
  return fotmobGet(`/data/teamseasonstats?teamId=${teamId}&tournamentId=${tournamentId}`);
}

export function splitFixtures(fixtures: any[]): { upcoming: any[]; results: any[] } {
  return splitFixturesResults(fixtures);
}

// Agregat 1-panggilan untuk halaman klub di frontend
export async function getTeamOverview(teamId: string, ccode3 = 'GBR'): Promise<any> {
  const team: any = await getTeamDetail(teamId, ccode3);
  const fixtures: any[] = team?.fixtures?.allFixtures?.fixtures || [];
  const { upcoming, results } = splitFixturesResults(fixtures);
  return {
    details: team?.details || null,
    logo: IMG_TEAM(teamId),
    nextMatch: team?.fixtures?.allFixtures?.nextMatch || team?.overview?.nextMatch || upcoming[0] || null,
    lastMatch: team?.fixtures?.allFixtures?.lastMatch || results[0] || null,
    form: team?.overview?.form || team?.overview?.teamForm || [],
    upcoming: upcoming.slice(0, 10),
    results: results.slice(0, 10),
    table: team?.table || null,
    squad: team?.squad || null,
    squadByPosition: team?.squad ? normalizeSquad(team.squad) : null,
    stats: team?.stats || null,
    transfers: team?.transfers || null,
    overview: team?.overview || null,
  };
}

export async function getTeamSquad(teamId: string): Promise<any> {
  const team: any = await getTeamDetail(teamId);
  return {
    id: teamId,
    logo: IMG_TEAM(teamId),
    groups: team?.squad?.squad || [],
    byPosition: normalizeSquad(team?.squad),
  };
}

export function teamInjuriesAndSuspensions(team: any): { injuries: any[]; suspensions: any[] } {
  const members: any[] = (team?.squad?.squad || []).flatMap((g: any) => g?.members || []);
  const injuries = members.filter((m: any) =>
    /injur|doubt|out |sidelined|unavailable/i.test(JSON.stringify(m?.injuryInformation || m || '')),
  );
  void injuries;
  const unavailable: any[] = [];
  const suspended: any[] = [];
  for (const g of team?.squad?.squad || []) {
    for (const m of g?.members || []) {
      if (m?.suspended === true || /suspend/i.test(String(m?.status || m?.availability || ''))) suspended.push(m);
    }
  }
  return { injuries: team?.injuries || unavailable, suspensions: suspended };
}

// ── Players ────────────────────────────────────────────────────────────────

export async function getPlayerDetail(playerId: string): Promise<any> {
  const key = `player:${playerId}`;
  const hit = getCache(key, TTL.player);
  if (hit) return hit;
  const data = await fotmobGet(`/data/playerData?id=${playerId}`);
  setCache(key, data);
  return data;
}

export function playerFace(playerId: number | string): { image: string; imageLarge: string } {
  return {
    image: IMG_PLAYER(playerId),
    imageLarge: IMG_PLAYER_LARGE(playerId),
  };
}

export async function getPlayerOverview(playerId: string): Promise<any> {
  const p: any = await getPlayerDetail(playerId);
  const face = playerFace(playerId);
  const info: any[] = p?.playerInformation || [];
  const infoVal = (title: RegExp) =>
    info.find((i: any) => title.test(String(i?.title || '')))?.value?.fallback ??
    info.find((i: any) => title.test(String(i?.title || '')))?.value ??
    null;
  return {
    id: p?.id || playerId,
    name: p?.name || null,
    logo: face.image,
    faceImageUrl: face.image,
    faceImageLargeUrl: face.imageLarge,
    age: playerAge(p),
    birthDate: p?.birthDate || null,
    height: infoVal(/height/i),
    shirtNumber: infoVal(/shirt/i),
    preferredFoot: infoVal(/foot/i),
    nationality: p?.primaryTeam ? undefined : infoVal(/country|nationality/i),
    marketValue: infoVal(/market|value/i),
    primaryTeam: p?.primaryTeam
      ? { ...p.primaryTeam, logo: p.primaryTeam.teamId ? IMG_TEAM(p.primaryTeam.teamId) : undefined }
      : null,
    position: playerPosition(p),
    positions: p?.positionDescription?.positions || null,
    playerInformation: p?.playerInformation || [],
    recentMatches: p?.recentMatches || [],
    mainLeague: p?.mainLeague || null,
    careerHistory: p?.careerHistory || null,
    trophies: p?.trophies || null,
    marketValues: p?.marketValues || null,
    injuryInformation: p?.injuryInformation ?? null,
  };
}

export async function getPlayerSeason(playerId: string): Promise<any> {
  const p: any = await getPlayerDetail(playerId);
  return {
    id: p?.id || playerId,
    seasons: p?.statSeasons || null,
    mainLeague: p?.mainLeague || null,
    trophies: p?.trophies || null,
  };
}

export async function getPlayerHistory(playerId: string): Promise<any> {
  const p: any = await getPlayerDetail(playerId);
  return p?.careerHistory || null;
}

// ── Search ─────────────────────────────────────────────────────────────────

export async function searchSuggest(term: string, hits = 25, lang = 'en'): Promise<any> {
  const key = `suggest:${term}:${hits}`;
  const hit = getCache(key, TTL.search);
  if (hit) return hit;
  const data = await fotmobGet(`/data/search/suggest?hits=${hits}&lang=${lang}&term=${encodeURIComponent(term)}`);
  setCache(key, data);
  return data;
}

export async function searchAll(query: string): Promise<{ matches: any[]; teams: any[]; players: any[]; leagues: any[]; coaches: any[]; referees: any[] }> {
  const raw: any = await searchSuggest(query, 50);
  const groups: any[] = Array.isArray(raw) ? raw : [raw];
  const suggestions: any[] = groups.flatMap((g: any) => g?.suggestions || []);
  const pick = (t: string) =>
    suggestions
      .filter((s: any) => s.type === t)
      .map((s: any) => {
        const face = t === 'player' || t === 'coach' ? playerFace(s.id) : null;
        return {
          ...s,
          info: suggestInfo(s),
          logo:
            t === 'team'
              ? IMG_TEAM(s.id)
              : t === 'league'
                ? IMG_LEAGUE(s.id)
                : t === 'player' || t === 'coach'
                  ? face!.image
                  : undefined,
          faceImageUrl: t === 'player' || t === 'coach' ? face!.image : undefined,
        };
      });
  return {
    matches: pick('match'),
    teams: pick('team'),
    players: pick('player'),
    leagues: pick('league'),
    coaches: pick('coach'),
    referees: pick('referee'),
  };
}

// ── News & Transfers ───────────────────────────────────────────────────────

export async function getWorldNews(page = 1): Promise<any> {
  return fotmobGet(`/worldnews?page=${page}`);
}

export async function getTrendingNews(): Promise<any> {
  return fotmobGet('/trendingnews');
}

export async function getNewsLatest(page = 1): Promise<any> {
  return getWorldNews(page);
}

export async function getTransfersRaw(): Promise<any> {
  const key = 'transfers:raw';
  const hit = getCache(key, TTL.league);
  if (hit) return hit;
  const data = await fotmobGet('/data/transfers');
  setCache(key, data);
  return data;
}

export async function getTransfers(filter: TransferFilter = 'all', limit = 50): Promise<any> {
  const raw = await getTransfersRaw();
  return filterTransfers(raw, filter, limit);
}

// ── Home: 1 panggilan untuk layar utama ala FotMob ─────────────────────────

export async function getHome(timezone = 'Asia/Jakarta', ccode3 = 'IDN'): Promise<any> {
  const [matchesRes, trendingRes, transfersRes] = await Promise.allSettled([
    getMatchesByDate(toIso(new Date().toISOString().split('T')[0]), timezone, ccode3),
    getTrendingNews().catch(() => []),
    getTransfersRaw().catch(() => null),
  ]);
  const matches = matchesRes.status === 'fulfilled' ? withLeagueLogos(matchesRes.value) : null;
  const liveTotal = (matches?.leagues || []).reduce(
    (n: number, lg: any) => n + (lg.matches || []).filter((m: any) => isLive(m.status)).length,
    0,
  );
  const transfers = transfersRes.status === 'fulfilled' && transfersRes.value
    ? filterTransfers(transfersRes.value, 'latest', 10)
    : null;
  return {
    date: matches?.date || null,
    liveTotal,
    leagues: matches?.leagues || [],
    trending: trendingRes.status === 'fulfilled' ? trendingRes.value : [],
    transfers,
  };
}

// ── Tools (dihitung dari data upstream; NULL = data tidak tersedia) ────────

export function fifaRankingsStub(): { men: null; women: null; note: string } {
  return { men: null, women: null, note: 'FIFA rankings tidak tersedia dari upstream saat ini' };
}

export function teamOfTheWeekStub(): { available: false; note: string } {
  return { available: false, note: 'Team of the Week tidak tersedia dari upstream saat ini' };
}

export function predictorStub(): { available: false; note: string } {
  return { available: false, note: 'Predictor membutuhkan akun & odds resmi; data odds upstream sering kosong' };
}

export function lineupBuilderMeta(): any {
  return {
    note: 'Gunakan /api/match/:id/lineups untuk formasi aktual, lalu susun XI sendiri di client',
    fields: ['formation', 'starters[11]', 'subs'],
  };
}

// ── Service object ─────────────────────────────────────────────────────────

export const fotmobService = {
  getMatchByFotmobId: getMatchDetail,
  getMatchDetail,
  getMatchSummary,
  getMatchOverview,
  getMatchTimeline,
  getMatchCommentary,
  getMatchInfo,
  getMatchStats,
  getMatchLineups,
  getMatchRatings,
  getMatchH2H,
  getMatchMedia,
  getMatchOdds,
  getTvListings,
  getMatchFacts,
  getMatchShotmap,
  getMatchMomentum,
  getMatchHeatmap,
  getMatchTable,
  getMatchesByDate,
  getLiveMatches,
  getNotableMatches,
  getMatchesByDateRange,
  getClubDetail: getTeamDetail,
  getTeamDetail,
  getTeamOverview,
  getTeamSquad,
  teamInjuriesAndSuspensions,
  getTeamNews,
  getTeamSeasonStats,
  getPlayerDetail,
  getPlayerOverview,
  getPlayerSeason,
  getPlayerHistory,
  playerFace,
  searchAll,
  searchSuggest,
  getLeagueDetail,
  getLeagueOverview,
  getLeagueTable,
  getLeagueTableNormalized,
  getLeagueXGTable,
  getLeagueFixtures,
  getLeagueNews,
  getLeagueStats,
  getLeagueStatFull,
  getFullStatList,
  normalizeStatList,
  getFixtureDifficulty,
  getAllLeagues,
  getLeaguesGrouped,
  continentOf,
  getWorldNews,
  getNewsLatest,
  getTrendingNews,
  getTransfers,
  getTransfersRaw,
  getHome,
  fifaRankingsStub,
  teamOfTheWeekStub,
  predictorStub,
  lineupBuilderMeta,
};
