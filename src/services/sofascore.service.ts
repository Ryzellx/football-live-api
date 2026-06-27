import { makeRequest } from './request.service';

// TheSportsDB API (free, no API key required for basic usage)
const BASE = 'https://www.thesportsdb.com/api/v1/json/3';

function endpoint(path: string): string {
  return `${BASE}${path}`;
}

// Helper to get today's date in YYYY-MM-DD format
function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

function getTomorrowDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

function getYesterdayDate(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
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

export const sofascoreService = {
  // ── Matches ────────────────────────────────────────────────────────────────
  getLiveMatches: () => makeRequest(endpoint(`/eventsday.php?d=${getTodayDate()}&s=Soccer`)),
  getScheduledEvents: (date: string) => makeRequest(endpoint(`/eventsday.php?d=${date}&s=Soccer`)),
  getMatchDetail: (id: string) => makeRequest(endpoint(`/lookupevent.php?id=${id}`)),
  getMatchEvents: (id: string) => makeRequest(endpoint(`/lookupevent.php?id=${id}`)),
  getMatchStatistics: (id: string) => makeRequest(endpoint(`/lookupevent.php?id=${id}`)),
  getMatchLineups: (id: string) => makeRequest(endpoint(`/lookuplineup.php?id=${id}`)),
  getMatchPlayerStats: (id: string) => makeRequest(endpoint(`/lookupevent.php?id=${id}`)),
  getMatchCommentary: (id: string) => makeRequest(endpoint(`/lookupevent.php?id=${id}`)),
  getMatchHighlights: (id: string) => makeRequest(endpoint(`/lookupevent.php?id=${id}`)),
  getMatchH2H: (id: string) => makeRequest(endpoint(`/searchevents.php?e=${id}`)),
  getMatchOdds: (id: string) => makeRequest(endpoint(`/lookupevent.php?id=${id}`)),
  getMatchPredictions: (id: string) => makeRequest(endpoint(`/lookupevent.php?id=${id}`)),

  // Get events across a date range (TheSportsDB free tier only returns 3/day)
  getScheduledEventsRange: async (from: string, to: string) => {
    const dates = dateRangeArray(from, to);
    const allEvents: any[] = [];
    const errors: string[] = [];

    for (const date of dates) {
      try {
        const data = await makeRequest(endpoint(`/eventsday.php?d=${date}&s=Soccer`));
        if (data && data.events && Array.isArray(data.events)) {
          allEvents.push(...data.events);
        }
      } catch (error: any) {
        errors.push(`${date}: ${error.message}`);
      }
    }

    return { events: allEvents, datesQueried: dates.length, errors };
  },

  // ── Competitions ───────────────────────────────────────────────────────────
  getCompetitions: () => makeRequest(endpoint(`/all_leagues.php`)),
  getCompetitionDetail: (id: string) => makeRequest(endpoint(`/lookupleague.php?id=${id}`)),
  getCompetitionStandings: (id: string) => makeRequest(endpoint(`/lookuptable.php?l=${id}&s=2025-2026`)),
  getCompetitionCupTree: (id: string) => makeRequest(endpoint(`/lookuptable.php?l=${id}&s=2025-2026`)),
  getCompetitionEvents: (id: string) => makeRequest(endpoint(`/eventsround.php?id=${id}&r=1&s=2025-2026`)),
  getCompetitionResults: (id: string) => makeRequest(endpoint(`/eventspastleague.php?id=${id}`)),
  getCompetitionTopScorers: (id: string) => makeRequest(endpoint(`/lookuptable.php?l=${id}&s=2025-2026`)),
  getCompetitionTopAssists: (id: string) => makeRequest(endpoint(`/lookuptable.php?l=${id}&s=2025-2026`)),
  getCompetitionTopKeepers: (id: string) => makeRequest(endpoint(`/lookuptable.php?l=${id}&s=2025-2026`)),
  getCompetitionCards: (id: string) => makeRequest(endpoint(`/lookuptable.php?l=${id}&s=2025-2026`)),

  // ── Teams ──────────────────────────────────────────────────────────────────
  getTeamDetail: (id: string) => makeRequest(endpoint(`/lookupteam.php?id=${id}`)),
  getTeamSquad: (id: string) => makeRequest(endpoint(`/lookup_all_players.php?id=${id}`)),
  getTeamFixtures: (id: string) => makeRequest(endpoint(`/eventsnext.php?id=${id}`)),
  getTeamResults: (id: string) => makeRequest(endpoint(`/eventslast.php?id=${id}`)),
  getTeamTransfers: (id: string) => makeRequest(endpoint(`/lookupteam.php?id=${id}`)),
  getTeamInjuries: (id: string) => makeRequest(endpoint(`/lookupteam.php?id=${id}`)),
  getTeamStatistics: (id: string) => makeRequest(endpoint(`/lookupteam.php?id=${id}`)),
  getTeamNews: (id: string) => makeRequest(endpoint(`/lookupteam.php?id=${id}`)),
  getTeamVideos: (id: string) => makeRequest(endpoint(`/lookupteam.php?id=${id}`)),

  // ── Players ────────────────────────────────────────────────────────────────
  getPlayerDetail: (id: string) => makeRequest(endpoint(`/lookupplayer.php?id=${id}`)),
  getPlayerStatistics: (id: string) => makeRequest(endpoint(`/lookupplayer.php?id=${id}`)),
  getPlayerMatches: (id: string) => makeRequest(endpoint(`/lookupplayer.php?id=${id}`)),
  getPlayerSeason: (id: string) => makeRequest(endpoint(`/lookupplayer.php?id=${id}`)),
  getPlayerHistory: (id: string) => makeRequest(endpoint(`/lookupplayer.php?id=${id}`)),
  getPlayerTransfers: (id: string) => makeRequest(endpoint(`/lookupplayer.php?id=${id}`)),
  getPlayerInjuries: (id: string) => makeRequest(endpoint(`/lookupplayer.php?id=${id}`)),
  getPlayerNews: (id: string) => makeRequest(endpoint(`/lookupplayer.php?id=${id}`)),

  // ── Search ─────────────────────────────────────────────────────────────────
  search: (query: string) => makeRequest(endpoint(`/searchteams.php?t=${encodeURIComponent(query)}`)),

  // ── Statistics (global) ────────────────────────────────────────────────────
  getTopScorers: () => makeRequest(endpoint(`/lookuptable.php?l=4328&s=2025-2026`)),
  getTopAssists: () => makeRequest(endpoint(`/lookuptable.php?l=4328&s=2025-2026`)),
  getCleanSheets: () => makeRequest(endpoint(`/lookuptable.php?l=4328&s=2025-2026`)),
  getMostGoals: () => makeRequest(endpoint(`/lookuptable.php?l=4328&s=2025-2026`)),
  getMostShots: () => makeRequest(endpoint(`/lookuptable.php?l=4328&s=2025-2026`)),
  getMostPasses: () => makeRequest(endpoint(`/lookuptable.php?l=4328&s=2025-2026`)),
  getMostDribbles: () => makeRequest(endpoint(`/lookuptable.php?l=4328&s=2025-2026`)),
  getMostTackles: () => makeRequest(endpoint(`/lookuptable.php?l=4328&s=2025-2026`)),
  getMostSaves: () => makeRequest(endpoint(`/lookuptable.php?l=4328&s=2025-2026`)),
  getCards: () => makeRequest(endpoint(`/lookuptable.php?l=4328&s=2025-2026`)),
};
