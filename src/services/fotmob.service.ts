import { fotmobGet, getCache, setCache, toYmd, toIso, TTL } from './fotmob.client';

const IMG_TEAM = (id: number | string) =>
  `https://images.fotmob.com/image_resources/logo/teamlogo/${id}.png`;
const IMG_LEAGUE = (id: number | string) =>
  `https://images.fotmob.com/image_resources/logo/leaguelogo/${id}.png`;
const IMG_PLAYER = (id: number | string) =>
  `https://images.fotmob.com/image_resources/logo/playerimages/${id}.png`;

export const img = { team: IMG_TEAM, league: IMG_LEAGUE, player: IMG_PLAYER };

// ── Matches ────────────────────────────────────────────────────────────────

export async function getMatchesByDate(date: string, timezone = 'Asia/Jakarta', ccode3 = 'IDN'): Promise<any> {
  const ymd = toYmd(date);
  const key = `matches:${ymd}:${timezone}:${ccode3}`;
  const hit = getCache(key, TTL.matches);
  if (hit) return hit;
  const raw: any = await fotmobGet(`/data/matches?date=${ymd}&timezone=${encodeURIComponent(timezone)}&ccode3=${ccode3}`);
  const data = withLogos(raw);
  setCache(key, data);
  return data;
}

function isLive(status: any): boolean {
  if (!status) return false;
  return status.ongoing === true || (status.started === true && status.finished === false && status.cancelled !== true);
}

function withLogos(data: any): any {
  if (!data?.leagues) return data;
  return {
    ...data,
    leagues: data.leagues.map((lg: any) => ({
      ...lg,
      logo: IMG_LEAGUE(lg.primaryId || lg.id),
      matches: (lg.matches || []).map((m: any) => ({
        ...m,
        home: m.home ? { ...m.home, logo: IMG_TEAM(m.home.id) } : m.home,
        away: m.away ? { ...m.away, logo: IMG_TEAM(m.away.id) } : m.away,
        isLive: isLive(m.status),
      })),
    })),
  };
}

export async function getLiveMatches(timezone = 'Asia/Jakarta', ccode3 = 'IDN'): Promise<{ leagues: any[]; total: number; date: string }> {
  const data: any = await getMatchesByDate(toIso(new Date().toISOString().split('T')[0]), timezone, ccode3);
  const leagues = (data?.leagues || [])
    .map((lg: any) => {
      const live = (lg.matches || []).filter((m: any) => isLive(m.status));
      if (live.length === 0) return null;
      return {
        ...lg,
        logo: IMG_LEAGUE(lg.primaryId || lg.id),
        matches: live.map((m: any) => ({
          ...m,
          home: m.home ? { ...m.home, logo: IMG_TEAM(m.home.id) } : m.home,
          away: m.away ? { ...m.away, logo: IMG_TEAM(m.away.id) } : m.away,
          isLive: true,
        })),
      };
    })
    .filter(Boolean);
  const total = leagues.reduce((n: number, l: any) => n + l.matches.length, 0);
  return { leagues, total, date: data?.date };
}

export async function getNotableMatches(lang = 'en-GB', country = 'GBR'): Promise<any> {
  const key = `notable:${lang}:${country}`;
  const hit = getCache(key, TTL.matches);
  if (hit) return hit;
  const data = await fotmobGet(`/data/notableMatches?lang=${lang}&country=${country}`);
  setCache(key, data);
  return data;
}

function dateRangeArray(from: string, to: string, maxDays = 51): string[] {
  const dates: string[] = [];
  const current = new Date(toIso(from));
  const end = new Date(toIso(to));
  while (current <= end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
    if (dates.length >= maxDays) break;
  }
  return dates;
}

export async function getMatchesByDateRange(from: string, to: string, timezone = 'Asia/Jakarta', ccode3 = 'IDN'): Promise<{ leagues: any[]; total: number }> {
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
              merged.matches.push({
                ...m,
                home: m.home ? { ...m.home, logo: IMG_TEAM(m.home.id) } : m.home,
                away: m.away ? { ...m.away, logo: IMG_TEAM(m.away.id) } : m.away,
                isLive: isLive(m.status),
              });
            }
          }
        }
      } catch {
        return;
      }
    }),
  );
  return { leagues: Array.from(leagueMap.values()), total: seen.size };
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

export async function getMatchMedia(matchId: string, ccode3 = 'GBR'): Promise<any> {
  return fotmobGet(`/data/matchMedia?matchId=${matchId}&ccode3=${ccode3}`);
}

export async function getMatchOdds(matchId: string, ccode3 = 'GBR'): Promise<any> {
  return fotmobGet(`/data/matchOdds?matchId=${matchId}&ccode3=${ccode3}`);
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
  const teams = (header.teams || []).map((t: any) => ({ ...t, logo: IMG_TEAM(t.id) }));
  const status = header.status || s?.status || null;
  const eventsRaw = d?.content?.matchFacts?.events;
  const events = Array.isArray(eventsRaw) ? eventsRaw : eventsRaw?.events || [];
  const goals = events.filter((e: any) => /goal/i.test(String(e.type || '')));
  const cards = events.filter((e: any) => /card/i.test(String(e.type || '')));
  const stats = d?.content?.stats;
  const topStats = Array.isArray(stats) ? stats.slice(0, 8) : stats || null;
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
    topStats,
    summary: s,
  };
}

// ── Leagues ────────────────────────────────────────────────────────────────

export async function getAllLeagues(): Promise<any> {
  const key = 'allLeagues';
  const hit = getCache(key, TTL.league);
  if (hit) return hit;
  const raw: any = await fotmobGet('/data/allLeagues');
  const data = withLeagueLogos(raw);
  setCache(key, data);
  return data;
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
  return { ...lg, logo: IMG_LEAGUE(lg.id) };
}

function withLeagueLogos(raw: any): any {
  if (!raw || typeof raw !== 'object') return raw;
  const out: any = { ...raw };
  if (Array.isArray(raw.popular)) out.popular = raw.popular.map(leagueWithLogo);
  if (Array.isArray(raw.international)) {
    out.international = raw.international.map((grp: any) => ({
      ...grp,
      leagues: Array.isArray(grp?.leagues) ? grp.leagues.map(leagueWithLogo) : grp?.leagues,
    }));
  }
  if (Array.isArray(raw.countries)) {
    out.countries = raw.countries.map((c: any) => ({
      ...c,
      leagues: Array.isArray(c?.leagues) ? c.leagues.map(leagueWithLogo) : c?.leagues,
    }));
  }
  return out;
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
export async function getLeagueOverview(leagueId: string, season?: string): Promise<any> {
  const detail: any = await getLeagueDetail(leagueId);
  const resolvedSeason = season || detail?.details?.selectedSeason || (detail?.allAvailableSeasons || [])[0];
  const [tableRes, fixturesRes] = await Promise.allSettled([
    getLeagueTable(leagueId),
    resolvedSeason ? getLeagueFixtures(leagueId, resolvedSeason) : Promise.resolve(null),
  ]);
  return {
    details: detail?.details || null,
    season: resolvedSeason || null,
    seasons: detail?.allAvailableSeasons || [],
    table: tableRes.status === 'fulfilled' ? tableRes.value : null,
    fixtures: fixturesRes.status === 'fulfilled' ? fixturesRes.value : null,
    stats: detail?.stats || null,
    transfers: detail?.transfers || null,
    logo: IMG_LEAGUE(leagueId),
  };
}

// ── Teams ──────────────────────────────────────────────────────────────────

export async function getTeamDetail(teamId: string, ccode3 = 'GBR'): Promise<any> {
  const key = `team:${teamId}:${ccode3}`;
  const hit = getCache(key, TTL.team);
  if (hit) return hit;
  const raw: any = await fotmobGet(`/data/teams?id=${teamId}&ccode3=${ccode3}`);
  const data = { ...raw, logo: IMG_TEAM(teamId) };
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
  const upcoming = (fixtures || []).filter((f: any) => f.notStarted === true || f.status?.finished === false);
  const results = (fixtures || []).filter((f: any) => f.status?.finished === true).reverse();
  return { upcoming, results };
}

// Agregat 1-panggilan untuk halaman klub di frontend
export async function getTeamOverview(teamId: string): Promise<any> {
  const team: any = await getTeamDetail(teamId);
  const fixtures: any[] = team?.fixtures?.allFixtures?.fixtures || [];
  const { upcoming, results } = splitFixtures(fixtures);
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
    stats: team?.stats || null,
    transfers: team?.transfers || null,
    overview: team?.overview || null,
  };
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
    imageLarge: `https://images.fotmob.com/image_resources/playerimages/${playerId}.png`,
  };
}

export async function getPlayerOverview(playerId: string): Promise<any> {
  const p: any = await getPlayerDetail(playerId);
  const face = playerFace(playerId);
  return {
    id: p?.id || playerId,
    name: p?.name || null,
    logo: face.image,
    faceImageUrl: face.image,
    faceImageLargeUrl: face.imageLarge,
    birthDate: p?.birthDate || null,
    primaryTeam: p?.primaryTeam
      ? { ...p.primaryTeam, logo: p.primaryTeam.teamId ? IMG_TEAM(p.primaryTeam.teamId) : undefined }
      : null,
    position: p?.positionDescription || p?.position || null,
    playerInformation: p?.playerInformation || [],
    recentMatches: p?.recentMatches || [],
    careerHistory: p?.careerHistory || null,
    trophies: p?.trophies || null,
    marketValues: p?.marketValues || null,
    injuryInformation: p?.injuryInformation || null,
    raw: p,
  };
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

export async function searchAll(query: string): Promise<{ matches: any[]; teams: any[]; players: any[]; leagues: any[] }> {
  const raw: any = await searchSuggest(query, 50);
  const suggestions: any[] = Array.isArray(raw) ? raw[0]?.suggestions || [] : raw?.suggestions || [];
  const pick = (t: string) =>
    suggestions
      .filter((s: any) => s.type === t)
      .map((s: any) => {
        const face = t === 'player' ? playerFace(s.id) : null;
        return {
          ...s,
          info: s.info || s.teamName || s.leagueName || null,
          logo:
            t === 'team'
              ? IMG_TEAM(s.id)
              : t === 'league'
                ? IMG_LEAGUE(s.id)
                : t === 'player'
                  ? face!.image
                  : undefined,
          faceImageUrl: t === 'player' ? face!.image : undefined,
        };
      });
  return {
    matches: pick('match'),
    teams: pick('team'),
    players: pick('player'),
    leagues: pick('league'),
  };
}

// ── News & Transfers ───────────────────────────────────────────────────────

export async function getWorldNews(page = 1): Promise<any> {
  return fotmobGet(`/worldnews?page=${page}`);
}

export async function getTrendingNews(): Promise<any> {
  return fotmobGet('/trendingnews');
}

export async function getTransfers(): Promise<any> {
  return fotmobGet('/data/transfers');
}

// ── Home: 1 panggilan untuk layar utama ala FotMob ─────────────────────────

export async function getHome(timezone = 'Asia/Jakarta', ccode3 = 'IDN'): Promise<any> {
  const [matchesRes, trendingRes, transfersRes] = await Promise.allSettled([
    getMatchesByDate(toIso(new Date().toISOString().split('T')[0]), timezone, ccode3),
    getTrendingNews(),
    getTransfers(),
  ]);
  const matches = matchesRes.status === 'fulfilled' ? withLogos(matchesRes.value) : null;
  const liveTotal = (matches?.leagues || []).reduce(
    (n: number, lg: any) => n + (lg.matches || []).filter((m: any) => isLive(m.status)).length,
    0,
  );
  return {
    date: matches?.date || null,
    liveTotal,
    leagues: matches?.leagues || [],
    trending: trendingRes.status === 'fulfilled' ? trendingRes.value : [],
    transfers: transfersRes.status === 'fulfilled' ? transfersRes.value : null,
  };
}

// ── Service object ─────────────────────────────────────────────────────────

export const fotmobService = {
  getMatchByFotmobId: getMatchDetail,
  getMatchDetail,
  getMatchSummary,
  getMatchOverview,
  getMatchMedia,
  getMatchOdds,
  getTvListings,
  getMatchesByDate,
  getLiveMatches,
  getNotableMatches,
  getMatchesByDateRange,
  getClubDetail: getTeamDetail,
  getTeamDetail,
  getTeamOverview,
  getTeamNews,
  getTeamSeasonStats,
  getPlayerDetail,
  getPlayerOverview,
  playerFace,
  searchAll,
  searchSuggest,
  getLeagueDetail,
  getLeagueOverview,
  getLeagueTable,
  getLeagueFixtures,
  getLeagueNews,
  getFixtureDifficulty,
  getAllLeagues,
  getLeaguesGrouped,
  continentOf,
  getWorldNews,
  getTrendingNews,
  getTransfers,
  getHome,
};
