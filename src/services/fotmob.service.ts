import https from 'https';
import http from 'http';

const FOTMOB_BASE = 'https://www.fotmob.com';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

function fetchUrl(url: string, allowRedirect = false): Promise<{ status: number; data: string; location?: string }> {
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
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('Timeout')); });
    req.end();
  });
}

function extractNextData(html: string): any {
  const match = html.match(/__NEXT_DATA__" type="application\/json">(.*?)<\/script>/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

export interface FotMobMatchDetail {
  general: any;
  header: any;
  content: {
    matchFacts: any;
    stats: any;
    lineup: any;
    shotmap: any;
    h2h: any;
    table: any;
    momentum: any;
    weather: any;
    attackingZones: any;
    [key: string]: any;
  };
  [key: string]: any;
}

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

function normalizeLineup(lineupData: any): any {
  if (!lineupData) return null;
  return {
    formation: {
      home: lineupData.homeTeam?.formation || null,
      away: lineupData.awayTeam?.formation || null,
    },
    rating: {
      home: lineupData.homeTeam?.rating || null,
      away: lineupData.awayTeam?.rating || null,
    },
    homeTeam: {
      id: lineupData.homeTeam?.id,
      name: lineupData.homeTeam?.name,
      formation: lineupData.homeTeam?.formation,
      startingXI: (lineupData.homeTeam?.starters || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        shirtNumber: p.shirtNumber,
        position: p.positionId,
        rating: p.performance?.rating || null,
        marketValue: p.marketValue || null,
        age: p.age || null,
        team: p.primaryTeamName || null,
        country: p.countryName || null,
        x: p.horizontalLayout?.x || null,
        y: p.horizontalLayout?.y || null,
      })),
      substitutes: (lineupData.homeTeam?.subs || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        shirtNumber: p.shirtNumber,
        position: p.positionId,
        rating: p.performance?.rating || null,
      })),
    },
    awayTeam: {
      id: lineupData.awayTeam?.id,
      name: lineupData.awayTeam?.name,
      formation: lineupData.awayTeam?.formation,
      startingXI: (lineupData.awayTeam?.starters || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        shirtNumber: p.shirtNumber,
        position: p.positionId,
        rating: p.performance?.rating || null,
        marketValue: p.marketValue || null,
        age: p.age || null,
        team: p.primaryTeamName || null,
        country: p.countryName || null,
        x: p.horizontalLayout?.x || null,
        y: p.horizontalLayout?.y || null,
      })),
      substitutes: (lineupData.awayTeam?.subs || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        shirtNumber: p.shirtNumber,
        position: p.positionId,
        rating: p.performance?.rating || null,
      })),
    },
  };
}

function normalizeEvents(matchFacts: any): any[] {
  if (!matchFacts?.events?.events) return [];
  return matchFacts.events.events.map((e: any) => ({
    id: e.eventId,
    type: e.type,
    time: e.time,
    overloadTime: e.overloadTime || null,
    player: e.player?.name || null,
    playerId: e.player?.id || null,
    homeScore: e.homeScore,
    awayScore: e.awayScore,
    description: e.description || null,
    isHome: e.isHome,
    isOwnGoal: e.ownGoal || false,
    isRedCard: e.redCard || false,
    isYellowCard: e.yellowCard || false,
    isSubstitution: e.substitution || false,
    playerIn: e.playerIn?.name || null,
    playerOut: e.playerOut?.name || null,
    shotmapEvent: e.shotmapEvent ? {
      x: e.shotmapEvent.x,
      y: e.shotmapEvent.y,
      expectedGoals: e.shotmapEvent.expectedGoals,
      onTarget: e.shotmapEvent.isOnTarget,
      shotType: e.shotmapEvent.shotType,
      situation: e.shotmapEvent.situation,
    } : null,
  }));
}

function normalizeShotmap(shotmapData: any): any[] {
  if (!shotmapData?.shots) return [];
  return shotmapData.shots.map((s: any) => ({
    player: s.playerName,
    teamId: s.teamId,
    x: s.x,
    y: s.y,
    minute: s.min || s.minute,
    expectedGoals: s.expectedGoals || s.xG,
    onTarget: s.isOnTarget || false,
    isGoal: s.eventType === 'Goal',
    shotType: s.shotType || null,
    situation: s.situation || null,
    blocked: s.isBlocked || false,
  }));
}

function extractMatchId(url: string): string | null {
  // Format: /matches/france-vs-norway/1wx88k#4667808
  const hashMatch = url.match(/#(\d+)$/);
  if (hashMatch) return hashMatch[1];
  return null;
}

async function getMatchByFotmobId(fotmobId: string): Promise<FotMobMatchDetail | null> {
  try {
    // Step 1: Get redirect from /match/{id}
    const redirectRes = await fetchUrl(`${FOTMOB_BASE}/match/${fotmobId}`);
    if (!redirectRes.location) {
      console.error(`[FotMob] No redirect for match ID ${fotmobId}`);
      return null;
    }

    // Step 2: Follow redirect (strip hash fragment)
    const targetUrl = `${FOTMOB_BASE}${redirectRes.location.split('#')[0]}`;
    const pageRes = await fetchUrl(targetUrl);
    if (pageRes.status !== 200 || !pageRes.data) {
      console.error(`[FotMob] Failed to fetch match page: ${pageRes.status}`);
      return null;
    }

    // Step 3: Extract __NEXT_DATA__
    const nextData = extractNextData(pageRes.data);
    if (!nextData?.props?.pageProps) {
      console.error(`[FotMob] No NEXT_DATA found`);
      return null;
    }

    const pageProps = nextData.props.pageProps;
    const content = pageProps.content || {};

    // Step 4: Normalize and return
    return {
      general: pageProps.general || null,
      header: pageProps.header || null,
      content: {
        matchFacts: content.matchFacts || null,
        stats: normalizeStats(content.stats),
        lineup: normalizeLineup(content.lineup),
        shotmap: normalizeShotmap(content.shotmap),
        h2h: content.h2h || null,
        table: content.table || null,
        momentum: content.momentum || null,
        weather: content.weather || null,
        attackingZones: content.attackingZones || null,
      },
      raw: {
        stats: content.stats,
        shotmap: content.shotmap,
      },
    };
  } catch (error: any) {
    console.error(`[FotMob] Error fetching match ${fotmobId}: ${error.message}`);
    return null;
  }
}

async function searchMatches(query: string): Promise<any[]> {
  try {
    const res = await fetchUrl(`${FOTMOB_BASE}/search?q=${encodeURIComponent(query)}`);
    if (!res.data) return [];
    const nextData = extractNextData(res.data);
    if (!nextData?.props?.pageProps) return [];
    const pageProps = nextData.props.pageProps;
    // Search results might be in pageProps
    if (pageProps.matches) return pageProps.matches;
    if (pageProps.fixtures) return pageProps.fixtures;
    return [];
  } catch (error: any) {
    console.error(`[FotMob] Search error: ${error.message}`);
    return [];
  }
}

export const fotmobService = {
  getMatchByFotmobId,
  searchMatches,
};
