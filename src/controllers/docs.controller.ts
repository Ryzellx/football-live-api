import { Request, Response } from 'express';
import { sendSuccess } from '../utils/response';

export const docsController = {
  // GET /api/docs — daftar endpoint + contoh ID valid
  getDocs: (_req: Request, res: Response) => {
    sendSuccess(res, {
      name: 'Football Live API',
      version: '3.0.0',
      source: 'fotmob',
      sampleIds: {
        leagueId: 47,
        teamId: 9825,
        playerId: 30981,
        matchId: 5795450,
        date: '2026-09-15',
        season: '2026/2027',
      },
      endpoints: [
        { method: 'GET', path: '/api/health', desc: 'Health check + uptime' },
        { method: 'GET', path: '/api/home?timezone=Asia/Jakarta&ccode3=IDN', desc: 'Feed layar utama: jadwal + live + trending + transfer' },
        { method: 'GET', path: '/api/fotmob/matches/live', desc: 'Skor live saat ini' },
        { method: 'GET', path: '/api/fotmob/matches/live/stream', desc: 'SSE live score (event: live tiap ~30 dtk)' },
        { method: 'GET', path: '/api/fotmob/matches/date/:date', desc: 'Semua laga 1 hari (YYYY-MM-DD / YYYYMMDD)' },
        { method: 'GET', path: '/api/fotmob/matches/range?from=&to=', desc: 'Rentang tanggal (maks 14 hari)' },
        { method: 'GET', path: '/api/fotmob/matches/notable', desc: 'Laga pilihan hari ini' },
        { method: 'GET', path: '/api/fotmob/leagues', desc: 'Direktori semua liga' },
        { method: 'GET', path: '/api/fotmob/league/:id', desc: 'Detail liga full' },
        { method: 'GET', path: '/api/fotmob/league/:id/overview?season=', desc: 'Agregat liga: detail + tabel + fixtures + stats' },
        { method: 'GET', path: '/api/fotmob/league/:id/table', desc: 'Klasemen (all/home/away/form/xg)' },
        { method: 'GET', path: '/api/fotmob/league/:id/fixtures?season=', desc: 'Fixtures per musim' },
        { method: 'GET', path: '/api/fotmob/league/:id/news', desc: 'Berita liga' },
        { method: 'GET', path: '/api/fotmob/league/:id/difficulty', desc: 'Fixture difficulty' },
        { method: 'GET', path: '/api/fotmob/match/:id', desc: 'Detail match: lineup, stats, xG, shotmap, momentum, H2H' },
        { method: 'GET', path: '/api/fotmob/match/:id/overview', desc: 'Ringkasan siap-render (skor, gol, kartu, topStats)' },
        { method: 'GET', path: '/api/fotmob/match/:id/summary', desc: 'Ringkasan singkat skor' },
        { method: 'GET', path: '/api/fotmob/match/:id/shotmap', desc: 'Shotmap xG per tembakan' },
        { method: 'GET', path: '/api/fotmob/match/:id/momentum', desc: 'Grafik momentum' },
        { method: 'GET', path: '/api/fotmob/match/:id/h2h', desc: 'Head-to-head' },
        { method: 'GET', path: '/api/fotmob/match/:id/media', desc: 'Highlight video' },
        { method: 'GET', path: '/api/fotmob/match/:id/odds', desc: 'Odds (sering kosong)' },
        { method: 'GET', path: '/api/fotmob/match/:id/tv?countryCode=ID', desc: 'Jadwal TV' },
        { method: 'GET', path: '/api/fotmob/team/:id', desc: 'Detail klub (/club/:id alias)' },
        { method: 'GET', path: '/api/fotmob/team/:id/overview', desc: 'Agregat klub: next/last match, form, upcoming, results' },
        { method: 'GET', path: '/api/fotmob/team/:id/fixtures', desc: 'Fixtures tim (upcoming + results)' },
        { method: 'GET', path: '/api/fotmob/team/:id/results', desc: 'Hasil terakhir tim' },
        { method: 'GET', path: '/api/fotmob/team/:id/news', desc: 'Berita tim' },
        { method: 'GET', path: '/api/fotmob/team/:id/stats?tournamentId=', desc: 'Statistik tim per turnamen' },
        { method: 'GET', path: '/api/fotmob/player/:id', desc: 'Detail pemain' },
        { method: 'GET', path: '/api/fotmob/player/:id/overview', desc: 'Ringkasan pemain + logo + tim' },
        { method: 'GET', path: '/api/fotmob/search/all?q=', desc: 'Search tim/pemain/liga/match' },
        { method: 'GET', path: '/api/fotmob/search/suggest?term=', desc: 'Autocomplete mentah FotMob' },
        { method: 'GET', path: '/api/fotmob/news/world?page=', desc: 'Berita dunia' },
        { method: 'GET', path: '/api/fotmob/news/trending', desc: 'Berita trending' },
        { method: 'GET', path: '/api/fotmob/transfers', desc: 'Bursa transfer' },
      ],
    });
  },

  // GET /api/health
  getHealth: (_req: Request, res: Response) => {
    sendSuccess(res, { status: 'ok', uptime: Math.floor(process.uptime()), time: new Date().toISOString() });
  },
};
