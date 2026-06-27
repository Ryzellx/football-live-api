import https from 'https';
import http from 'http';

const FOTMOB_BASE = 'https://www.fotmob.com';
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

// ── Fetch Utilities ──────────────────────────────────────────────────────────

function fetchUrl(url: string): Promise<{ status: number; data: string; location?: string }> {
  return new Promise((resolve, reject) => {
    const transport = url.startsWith('https') ? https : http;
    const req = transport.get(url, { headers: { 'User-Agent': USER_AGENT } }, (res) => {
      let d = '';
      res.on('data', (c: string) => (d += c));
      res.on('end', () => {
        resolve({
          status: res.statusCode || 0,
          data: d,
          location: res.headers.location,
        });
      });
    });
    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    req.end();
  });
}

function extractNextData(html: string): any {
  const match = html.match(/__NEXT_DATA__\"\s*type=\"application\/json\">(.*?)<\/script>/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

// ── Normalizer Helpers ───────────────────────────────────────────────────────

function normalizeStats(statsData: any): any[] {
  if (!statsData?.Periods?.All?.stats) return [];
  const result: any[] = [];
  for (const category of statsData.Periods.All.stats) {
    if (category.stats && Array.isArray(category.stats)) {
      for (const stat of category.stats) {
        if (stat.title && Array.isArray(stat.stats) && stat.stats.length >= 2) {
          result.push({
            title: stat.title,
            key: stat.key,
            home: stat.stats[0],
            away: stat.stats[1],
            format: stat.format || 'integer',
            highlighted: stat.highlighted || null,
          });
        }
      }
    }
  }
  return result;
}

function normalizeLineupPlayer(p: any) {
  return {
    id: p.id,
    age: p.age || null,
    name: p.name,
    positionId: p.positionId,
    shirtNumber: p.shirtNumber,
    countryName: p.countryName || null,
    countryCode: p.countryCode || null,
    marketValue: p.marketValue || null,
    x: p.horizontalLayout?.x || null,
    y: p.horizontalLayout?.y || null,
    rating: p.performance?.rating || null,
    firstName: p.firstName || null,
    lastName: p.lastName || null,
    substitutionEvents: p.performance?.substitutionEvents || null,
  };
}

function normalizeLineup(lineupData: any): any {
  if (!lineupData) return null;
  const nt = (t: any) => ({
    id: t?.id,
    name: t?.name,
    rating: t?.rating || null,
    formation: t?.formation || null,
    starters: (t?.starters || []).map(normalizeLineupPlayer),
    substitutes: (t?.subs || []).map(normalizeLineupPlayer),
    averageStarterAge: t?.averageStarterAge || null,
    totalStarterMarketValue: t?.totalStarterMarketValue || null,
  });
  return { homeTeam: nt(lineupData.homeTeam), awayTeam: nt(lineupData.awayTeam) };
}

function normalizeShotmap(shotmapData: any): any[] {
  if (!shotmapData?.shots) return [];
  return shotmapData.shots.map((s: any) => ({
    id: s.id,
    eventType: s.eventType,
    teamId: s.teamId,
    playerId: s.playerId,
    playerName: s.playerName,
    x: s.x,
    y: s.y,
    min: s.min,
    addedMin: s.addedMin || null,
    isBlocked: s.isBlocked || false,
    isOnTarget: s.isOnTarget || false,
    blockedX: s.blockedX || null,
    blockedY: s.blockedY || null,
    goalCrossed: s.goalCrossed || false,
    expectedGoals: s.expectedGoals ?? null,
    expectedGoalsOnTarget: s.expectedGoalsOnTarget ?? null,
    shotType: s.shotType || null,
    situation: s.situation || null,
    period: s.period || null,
    isOwnGoal: s.isOwnGoal || false,
    onGoalShot: s.onGoalShot || null,
  }));
}

function normalizeEvents(matchFacts: any): any[] {
  if (!matchFacts?.events?.events) return [];
  return matchFacts.events.events.map((e: any) => ({
    timeStr: e.timeStr,
    type: e.type,
    time: e.time,
    overloadTime: e.overloadTime || null,
    player: e.player ? { id: e.player.id, name: e.player.name, profileUrl: e.player.profileUrl } : null,
    homeScore: e.homeScore ?? null,
    awayScore: e.awayScore ?? null,
    isHome: e.isHome,
    swap: e.swap || null,
  }));
}

function normalizeInfoBox(matchFacts: any): any {
  const ib = matchFacts?.infoBox || {};
  return {
    legInfo: ib.legInfo || null,
    matchDate: { utcTime: ib['Match Date']?.utcTime || null, timezone: ib['Match Date']?.timezone || null },
    tournament: ib.Tournament
      ? {
          id: ib.Tournament.id,
          parentLeagueId: ib.Tournament.parentLeagueId,
          link: ib.Tournament.link,
          leagueName: ib.Tournament.leagueName,
          roundName: ib.Tournament.roundName,
          round: ib.Tournament.round,
        }
      : null,
    stadium: ib.Stadium
      ? {
          name: ib.Stadium.name,
          city: ib.Stadium.city,
          country: ib.Stadium.country,
          lat: ib.Stadium.lat,
          long: ib.Stadium.long,
          capacity: ib.Stadium.capacity,
          surface: ib.Stadium.surface,
        }
      : null,
    referee: ib.Referee
      ? { text: ib.Referee.text, countryCode: ib.Referee.countryCode, country: ib.Referee.country }
      : null,
    attendance: ib.Attendance ?? null,
    teamForm: ib.teamForm || null,
    poll: ib.poll || null,
    topPlayers: ib.topPlayers || null,
    insights: ib.insights || null,
    postReview: ib.postReview || null,
  };
}

function normalizeSquadMember(m: any) {
  return {
    id: m.id,
    name: m.name,
    age: m.age || null,
    dateOfBirth: m.dateOfBirth || null,
    height: m.height || null,
    country: m.cname || null,
    countryCode: m.ccode || null,
    role: m.role?.key || m.role?.fallback || 'unknown',
    shirtNumber: m.shirtNumber ?? null,
    isCaptain: m.isCaptain || false,
    excludeFromRanking: m.excludeFromRanking || false,
    marketValue: m.marketValue || null,
  };
}

function groupSquad(squadData: any[]) {
  const result: any = {
    isNationalTeam: false,
    coach: [],
    keepers: [],
    defenders: [],
    midfielders: [],
    attackers: [],
  };
  for (const group of squadData) {
    const members = (group.members || []).map(normalizeSquadMember);
    const title = (group.title || '').toLowerCase();
    if (title === 'coach') result.coach = members;
    else if (title === 'keepers') result.keepers = members;
    else if (title === 'defenders') result.defenders = members;
    else if (title === 'midfielders') result.midfielders = members;
    else if (title === 'attackers') result.attackers = members;
  }
  return result;
}

function normalizeTrophies(trophyList: any[]): any[] {
  return (trophyList || []).map((t: any) => ({
    name: t.name?.[0] || 'Unknown',
    area: t.area?.[0] || null,
    countryCode: t.ccode?.[0] || null,
    count: parseInt(t.won?.[0] || '0', 10),
    runnerUp: parseInt(t.runnerup?.[0] || '0', 10),
    seasonsWon: (t.season_won?.[0] || '').split(',').filter(Boolean),
    seasonsRunnerUp: (t.season_runnerup?.[0] || '').split(',').filter(Boolean),
  }));
}

function normalizeFixtures(fixturesData: any): any {
  const all = fixturesData?.allFixtures;
  const fixtures = (all?.fixtures || []).map((f: any) => ({
    id: f.id,
    pageUrl: f.pageUrl,
    opponent: f.opponent || null,
    home: f.home || null,
    away: f.away || null,
    result: f.result ?? null,
    notStarted: f.notStarted ?? false,
    tournament: f.tournament || null,
    status: f.status || null,
  }));
  return {
    allFixtures: fixtures,
    nextMatch: all?.nextMatch || null,
    lastMatch: all?.lastMatch || null,
  };
}

function normalizeCareerItems(items: any): any[] {
  if (!items) return [];
  if (!Array.isArray(items)) return [];
  return items.map((c: any) => ({
    teamId: c.teamId,
    teamName: c.teamName,
    appearances: c.appearances || 0,
    goals: c.goals || 0,
    assists: c.assists || 0,
    ownGoals: c.ownGoals || 0,
    yellowCards: c.yellowCards || 0,
    secondYellowCards: c.secondYellowCards || 0,
    redCards: c.redCards || 0,
    minutesPerGoal: c.minutesPerGoal ?? null,
    playedMinutes: c.playedMinutes || 0,
    seasonName: c.seasonName || null,
    tournamentId: c.tournamentId || null,
    tournamentName: c.tournamentName || null,
    parentTeamId: c.parentTeamId || null,
    onLoan: c.onLoan || false,
  }));
}

function normalizeRecentMatches(matches: any): any[] {
  if (!matches) return [];
  if (!Array.isArray(matches)) return [];
  return matches.map((m: any) => ({
    matchId: m.matchId,
    opponent: m.opponent || null,
    opponentId: m.opponentId || null,
    isHome: m.isHome ?? false,
    scoreStr: m.scoreStr || null,
    date: m.date || null,
    tournamentName: m.tournamentName || null,
    stage: m.stage || null,
    result: m.result || null,
    playedMinutes: m.playedMinutes || 0,
    goals: m.goals || 0,
    assists: m.assists || 0,
    rating: m.rating ?? null,
  }));
}

function normalizeTrophiesPlayer(trophiesData: any): any {
  return {
    playerTrophies: (trophiesData?.playerTrophies || []).map((t: any) => ({
      ccode: t.ccode,
      teamId: t.teamId,
      teamName: t.teamName,
      tournaments: (t.tournaments || []).map((tr: any) => ({ name: tr.name, id: tr.id })),
    })),
    coachTrophies: trophiesData?.coachTrophies || null,
  };
}

function normalizeInjuries(injuryData: any): any {
  if (!injuryData?.injuries) return null;
  return {
    injuries: injuryData.injuries.map((i: any) => ({
      type: i.type,
      date: i.date || null,
      estimatedStartDate: i.estimatedStartDate || null,
      estimatedEndDate: i.estimatedEndDate || null,
      id: i.id,
    })),
  };
}

function normalizeMarketValues(mv: any): any {
  if (!mv) return null;
  return {
    current: mv.current || null,
    history: (mv.history || []).map((h: any) => ({
      date: h.date,
      value: h.value,
      currency: h.currency,
    })),
  };
}

function normalizePlayerInformation(pi: any): any[] {
  if (!pi) return [];
  if (!Array.isArray(pi)) return [];
  return pi.map((p: any) => ({
    title: p.title,
    value: p.value || null,
    translationKey: p.translationKey || null,
    icon: p.icon || null,
  }));
}

// ── Match Detail ─────────────────────────────────────────────────────────────

export async function getMatchDetail(fotmobId: string): Promise<any | null> {
  try {
    const redirectRes = await fetchUrl(`${FOTMOB_BASE}/match/${fotmobId}`);
    if (!redirectRes.location) {
      console.error(`[FotMob] No redirect for match ID ${fotmobId}`);
      return null;
    }
    const targetUrl = `${FOTMOB_BASE}${redirectRes.location.split('#')[0]}`;
    const pageRes = await fetchUrl(targetUrl);
    if (pageRes.status !== 200 || !pageRes.data) {
      console.error(`[FotMob] Failed to fetch match page: ${pageRes.status}`);
      return null;
    }
    const nextData = extractNextData(pageRes.data);
    if (!nextData?.props?.pageProps) {
      console.error('[FotMob] No NEXT_DATA found for match');
      return null;
    }
    const pp = nextData.props.pageProps;
    const content = pp.content || {};
    const mf = content.matchFacts || {};

    return {
      general: {
        matchId: pp.general?.matchId || parseInt(fotmobId),
        matchName: pp.general?.matchName || null,
        matchRound: pp.general?.matchRound || null,
        teamColors: pp.general?.teamColors || { darkMode: { home: [], away: [] }, lightMode: { home: [], away: [] } },
      },
      header: {
        teams: (pp.header?.teams || []).map((t: any) => ({
          name: t.name,
          id: t.id,
          score: t.score ?? null,
          imageUrl: t.imageUrl,
          pageUrl: t.pageUrl,
        })),
        status: {
          utcTime: pp.header?.status?.utcTime || null,
          timezone: pp.header?.status?.timezone || null,
          finished: pp.header?.status?.finished ?? false,
          started: pp.header?.status?.started ?? false,
          cancelled: pp.header?.status?.cancelled ?? false,
          awarded: pp.header?.status?.awarded ?? false,
          scoreStr: pp.header?.status?.scoreStr || null,
          reason: pp.header?.status?.reason || null,
        },
      },
      content: {
        matchFacts: {
          matchId: mf.matchId || parseInt(fotmobId),
          highlights: mf.highlights || [],
          playerOfTheMatch: mf.playerOfTheMatch || null,
          events: normalizeEvents(mf),
          eventTypes: mf.events?.eventTypes || null,
          penaltyShootoutEvents: mf.penaltyShootoutEvents || null,
          infoBox: normalizeInfoBox(mf),
        },
        playerStats: content.playerStats || null,
        stats: normalizeStats(content.stats),
        lineup: normalizeLineup(content.lineup),
        shotmap: normalizeShotmap(content.shotmap),
        h2h: content.h2h || null,
        momentum: content.momentum || null,
        table: content.table || null,
      },
    };
  } catch (error: any) {
    console.error(`[FotMob] Error fetching match ${fotmobId}: ${error.message}`);
    return null;
  }
}

// ── Club Detail ──────────────────────────────────────────────────────────────

export async function getClubDetail(clubId: string): Promise<any | null> {
  try {
    const res = await fetchUrl(`${FOTMOB_BASE}/teams/${clubId}/overview`);
    if (!res.data) return null;
    const nextData = extractNextData(res.data);
    if (!nextData?.props?.pageProps?.fallback) return null;
    const td = nextData.props.pageProps.fallback[`team-${clubId}`];
    if (!td) return null;
    const det = td.details || {};
    const hist = td.history || {};
    const grouped = groupSquad(td.squad?.squad || []);
    grouped.isNationalTeam = td.squad?.isNationalTeam || false;

    return {
      id: det.id || parseInt(clubId),
      name: det.name || 'Unknown',
      shortName: det.shortName || det.name || 'Unknown',
      country: det.country || null,
      gender: det.gender || 'male',
      latestSeason: det.latestSeason || null,
      seostr: td.seostr || null,
      squad: grouped,
      trophies: normalizeTrophies(hist.trophyList),
      history: {
        trophyList: hist.trophyList || [],
        coachHistory: hist.coachHistory || null,
        teamColorMap: hist.teamColorMap || null,
        teamColors: hist.teamColors || null,
        tables: hist.tables || null,
      },
      fixtures: normalizeFixtures(td.fixtures),
      table: td.table || null,
      transfers: td.transfers || null,
      stats: td.stats || null,
    };
  } catch (error: any) {
    console.error(`[FotMob] Error fetching club ${clubId}: ${error.message}`);
    return null;
  }
}

// ── Player Detail ────────────────────────────────────────────────────────────

export async function getPlayerDetail(playerId: string): Promise<any | null> {
  try {
    const res = await fetchUrl(`${FOTMOB_BASE}/players/${playerId}/overview`);
    if (!res.data) return null;
    const nextData = extractNextData(res.data);
    if (!nextData?.props?.pageProps?.fallback) return null;
    const pd = nextData.props.pageProps.fallback[`player:${playerId}`];
    if (!pd) return null;

    let age: number | null = null;
    if (pd.birthDate?.utcDate) {
      const birth = new Date(pd.birthDate.utcDate);
      const now = new Date();
      age = now.getFullYear() - birth.getFullYear();
      const md = now.getMonth() - birth.getMonth();
      if (md < 0 || (md === 0 && now.getDate() < birth.getDate())) age--;
    }

    return {
      id: pd.id || parseInt(playerId),
      name: pd.name || 'Unknown',
      birthDate: pd.birthDate || null,
      age,
      isCoach: pd.isCoach || false,
      isCaptain: pd.isCaptain || false,
      gender: pd.gender || 'male',
      status: pd.status || 'active',
      primaryTeam: pd.primaryTeam || null,
      position: pd.positionDescription || null,
      playerInformation: normalizePlayerInformation(pd.playerInformation),
      injuryInformation: normalizeInjuries(pd.injuryInformation),
      internationalDuty: pd.internationalDuty || null,
      trophies: normalizeTrophiesPlayer(pd.trophies),
      careerHistory: {
        careerItems: normalizeCareerItems(pd.careerHistory?.careerItems),
        fullCareer: pd.careerHistory?.fullCareer || [],
      },
      recentMatches: normalizeRecentMatches(pd.recentMatches),
      marketValues: normalizeMarketValues(pd.marketValues),
      traits: pd.traits || null,
      meta: pd.meta || null,
      statSeasons: pd.statSeasons || null,
      firstSeasonStats: pd.firstSeasonStats || null,
    };
  } catch (error: any) {
    console.error(`[FotMob] Error fetching player ${playerId}: ${error.message}`);
    return null;
  }
}

// ── Date-Based Match Listing ─────────────────────────────────────────────────

// Popular league IDs to fetch matches from
const POPULAR_LEAGUES = [
  // International
  { id: 77, name: 'FIFA World Cup', country: 'International' },
  { id: 42, name: 'Champions League', country: 'International' },
  { id: 73, name: 'Europa League', country: 'International' },
  { id: 10216, name: 'Conference League', country: 'International' },
  { id: 50, name: 'EURO', country: 'International' },
  { id: 44, name: 'Copa America', country: 'International' },
  { id: 114, name: 'Friendlies', country: 'International' },
  { id: 489, name: 'Club Friendlies', country: 'International' },
  { id: 10195, name: 'WC Qualification Europe', country: 'International' },
  { id: 10196, name: 'WC Qualification Africa', country: 'International' },
  { id: 10197, name: 'WC Qualification Asia', country: 'International' },
  { id: 10198, name: 'WC Qualification CONCACAF', country: 'International' },
  { id: 10199, name: 'WC Qualification CONMEBOL', country: 'International' },
  // Top 5 Europe
  { id: 147, name: 'Premier League', country: 'England' },
  { id: 87, name: 'La Liga', country: 'Spain' },
  { id: 164, name: 'Serie A', country: 'Italy' },
  { id: 154, name: 'Bundesliga', country: 'Germany' },
  { id: 168, name: 'Ligue 1', country: 'France' },
  // Other Europe
  { id: 57, name: 'Eredivisie', country: 'Netherlands' },
  { id: 61, name: 'Liga Portugal', country: 'Portugal' },
  { id: 69, name: 'Super Lig', country: 'Turkey' },
  { id: 64, name: 'Scottish Premiership', country: 'Scotland' },
  { id: 40, name: 'Championship', country: 'England' },
  { id: 48, name: 'League One', country: 'England' },
  { id: 46, name: 'Superligaen', country: 'Denmark' },
  { id: 68, name: 'Allsvenskan', country: 'Sweden' },
  { id: 58, name: 'Eliteserien', country: 'Norway' },
  { id: 85, name: 'Super League', country: 'Greece' },
  { id: 122, name: '1. Liga', country: 'Switzerland' },
  { id: 119, name: '2. Liga', country: 'Germany' },
  { id: 86, name: 'Serie B', country: 'Italy' },
  // Americas
  { id: 112, name: 'Liga Profesional', country: 'Argentina' },
  { id: 23, name: 'Serie A', country: 'Brazil' },
  { id: 24, name: 'Serie B', country: 'Brazil' },
  { id: 130, name: 'MLS', country: 'USA' },
  { id: 121, name: 'Liga MX', country: 'Mexico' },
  { id: 111, name: 'Primera Division', country: 'Chile' },
  { id: 103, name: 'Primera A', country: 'Colombia' },
  // Asia & Oceania
  { id: 98, name: 'J1 League', country: 'Japan' },
  { id: 292, name: 'K League 1', country: 'South Korea' },
  { id: 35, name: 'Pro League', country: 'Saudi Arabia' },
  { id: 113, name: 'A-League', country: 'Australia' },
  { id: 169, name: 'Super League', country: 'China' },
  // Africa
  { id: 100, name: 'Premier League', country: 'South Africa' },
  { id: 490, name: 'Botola Pro', country: 'Morocco' },
];

// Cache league fixtures to avoid re-fetching on every date query
const leagueCache = new Map<string, { data: any[]; fetchedAt: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

async function fetchLeagueFixtures(leagueId: number): Promise<any[]> {
  const cacheKey = String(leagueId);
  const cached = leagueCache.get(cacheKey);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
    return cached.data;
  }

  try {
    const res = await fetchUrl(`${FOTMOB_BASE}/leagues/${leagueId}/matches`);
    if (!res.data) return [];
    const nextData = extractNextData(res.data);
    if (!nextData?.props?.pageProps?.fixtures?.allMatches) return [];

    const allMatches = nextData.props.pageProps.fixtures.allMatches;
    leagueCache.set(cacheKey, { data: allMatches, fetchedAt: Date.now() });
    return allMatches;
  } catch (error: any) {
    console.error(`[FotMob] Error fetching league ${leagueId} fixtures: ${error.message}`);
    return [];
  }
}

export async function getMatchesByDate(date: string): Promise<{ leagues: any[] }> {
  const targetDate = date; // YYYY-MM-DD

  // Fetch all popular leagues in parallel
  const leaguePromises = POPULAR_LEAGUES.map(async (league) => {
    const allMatches = await fetchLeagueFixtures(league.id);

    // Filter matches for the target date
    const dayMatches = allMatches.filter((m: any) => {
      const matchDate = m.status?.utcTime?.split('T')[0];
      return matchDate === targetDate;
    });

    if (dayMatches.length === 0) return null;

    return {
      id: league.id,
      name: league.name,
      country: league.country,
      logo: `https://images.fotmob.com/image_resources/logo/leaguelogo/${league.id}.png`,
      matches: dayMatches.map((m: any) => ({
        id: m.id,
        home: { name: m.home?.name, id: m.home?.id, shortName: m.home?.shortName },
        away: { name: m.away?.name, id: m.away?.id, shortName: m.away?.shortName },
        status: m.status,
        group: m.group || null,
        round: m.round || null,
      })),
    };
  });

  const results = await Promise.all(leaguePromises);
  const leagues = results.filter(Boolean);

  return { leagues };
}

function dateRangeArray(from: string, to: string): string[] {
  const dates: string[] = [];
  const current = new Date(from);
  const end = new Date(to);
  while (current <= end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

export async function getMatchesByDateRange(from: string, to: string): Promise<{ leagues: any[]; total: number }> {
  const dates = dateRangeArray(from, to);
  const seenMatchIds = new Set<string>();
  const leagueMap = new Map<string, any>();

  for (const date of dates) {
    const dayData = await getMatchesByDate(date);
    if (!dayData.leagues || !Array.isArray(dayData.leagues)) continue;
    for (const league of dayData.leagues) {
      const leagueId = String(league.id || league.primaryId || league.name);
      let merged = leagueMap.get(leagueId);
      if (!merged) {
        merged = { id: league.id, name: league.name, country: league.country || null, logo: league.logo || null, matches: [] as any[] };
        leagueMap.set(leagueId, merged);
      }
      for (const match of league.matches || []) {
        const matchId = String(match.id || '');
        if (matchId && !seenMatchIds.has(matchId)) {
          seenMatchIds.add(matchId);
          merged.matches.push(match);
        }
      }
    }
  }
  return { leagues: Array.from(leagueMap.values()), total: seenMatchIds.size };
}

// ── Search ───────────────────────────────────────────────────────────────────

export async function searchAll(_query: string): Promise<{ matches: any[]; teams: any[]; players: any[]; leagues: any[] }> {
  return { matches: [], teams: [], players: [], leagues: [] };
}

// ── League Detail ────────────────────────────────────────────────────────────

export async function getLeagueDetail(leagueId: string): Promise<any | null> {
  try {
    const res = await fetchUrl(`${FOTMOB_BASE}/leagues/${leagueId}/overview`);
    if (!res.data) return null;
    const nextData = extractNextData(res.data);
    if (!nextData?.props?.pageProps) return null;
    const pp = nextData.props.pageProps;

    // Extract table/standings
    const tableData = pp.table || [];
    const allTableData = pp.tableData || [];

    // Extract fixtures
    const fixtures = pp.fixtures || {};

    // Extract stats
    const stats = pp.stats || {};

    // Extract details
    const details = pp.details || {};

    return {
      details: {
        id: details.id || parseInt(leagueId),
        name: details.name || 'Unknown League',
        shortName: details.shortName || null,
        country: details.country || null,
        countryCode: details.countryCode || null,
        seostr: details.seostr || null,
        ccode: details.ccode || null,
        gender: details.gender || null,
        season: details.season || null,
      },
      table: tableData.length > 0 ? tableData : allTableData,
      allTableData,
      fixtures: {
        allMatches: fixtures.allMatches || [],
        pastPast: fixtures.pastPast || [],
        pastLastFetchedPage: fixtures.pastLastFetchedPage || null,
        futureFixtures: fixtures.futureFixtures || [],
      },
      stats: stats,
      history: pp.history || null,
      hasOngoingLeague: pp.hasOngoingLeague || false,
    };
  } catch (error: any) {
    console.error(`[FotMob] Error fetching league ${leagueId}: ${error.message}`);
    return null;
  }
}

// ── Service object export (backward compat) ──────────────────────────────────

export const fotmobService = {
  getMatchByFotmobId: getMatchDetail,
  getMatchesByDate,
  getMatchesByDateRange,
  getClubDetail,
  getPlayerDetail,
  searchAll,
  getLeagueDetail,
};
