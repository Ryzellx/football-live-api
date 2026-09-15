import { Request, Response } from 'express';
import { sendSuccess } from '../utils/response';

const EP = (p: string) => `/api${p}`;

const ENDPOINTS = [
  { method: 'GET', path: EP('/health'), desc: 'Health check + uptime' },
  { method: 'GET', path: EP('/home?timezone=Asia/Jakarta&ccode3=IDN'), desc: 'Feed layar utama: jadwal + live + trending + transfer' },
  { method: 'GET', path: EP('/matches/live'), desc: 'Skor live saat ini' },
  { method: 'GET', path: EP('/matches/live/stream'), desc: 'SSE live score (event: live tiap ~30 dtk)' },
  { method: 'GET', path: EP('/matches/date/:date'), desc: 'Semua laga 1 hari (YYYY-MM-DD / YYYYMMDD)' },
  { method: 'GET', path: EP('/matches/range?from=&to='), desc: 'Rentang tanggal (maks 51 hari = ±25)' },
  { method: 'GET', path: EP('/matches/notable'), desc: 'Laga pilihan hari ini' },
  { method: 'GET', path: EP('/leagues'), desc: 'Direktori semua liga' },
  { method: 'GET', path: EP('/leagues/grouped'), desc: 'Liga populer + grup benua siap-render' },
  { method: 'GET', path: EP('/league/:id'), desc: 'Detail liga full' },
  { method: 'GET', path: EP('/league/:id/overview?season='), desc: 'Agregat liga: detail + tabel + fixtures + stats' },
  { method: 'GET', path: EP('/league/:id/table'), desc: 'Klasemen (all/home/away/form/xg)' },
  { method: 'GET', path: EP('/league/:id/fixtures?season='), desc: 'Fixtures per musim' },
  { method: 'GET', path: EP('/league/:id/news'), desc: 'Berita liga' },
  { method: 'GET', path: EP('/league/:id/difficulty'), desc: 'Fixture difficulty' },
  { method: 'GET', path: EP('/match/:id'), desc: 'Detail match: lineup, stats, xG, shotmap, momentum, H2H' },
  { method: 'GET', path: EP('/match/:id/overview'), desc: 'Ringkasan siap-render (skor, gol, kartu, topStats)' },
  { method: 'GET', path: EP('/match/:id/summary'), desc: 'Ringkasan singkat skor' },
  { method: 'GET', path: EP('/match/:id/shotmap'), desc: 'Shotmap xG per tembakan' },
  { method: 'GET', path: EP('/match/:id/momentum'), desc: 'Grafik momentum' },
  { method: 'GET', path: EP('/match/:id/h2h'), desc: 'Head-to-head' },
  { method: 'GET', path: EP('/match/:id/media'), desc: 'Highlight video' },
  { method: 'GET', path: EP('/match/:id/odds'), desc: 'Odds (sering kosong)' },
  { method: 'GET', path: EP('/match/:id/tv?countryCode=ID'), desc: 'Jadwal TV' },
  { method: 'GET', path: EP('/team/:id'), desc: 'Detail klub (/club/:id alias)' },
  { method: 'GET', path: EP('/team/:id/overview'), desc: 'Agregat klub: next/last match, form, upcoming, results' },
  { method: 'GET', path: EP('/team/:id/fixtures'), desc: 'Fixtures tim (upcoming + results)' },
  { method: 'GET', path: EP('/team/:id/results'), desc: 'Hasil terakhir tim' },
  { method: 'GET', path: EP('/team/:id/news'), desc: 'Berita tim' },
  { method: 'GET', path: EP('/team/:id/stats?tournamentId='), desc: 'Statistik tim per turnamen' },
  { method: 'GET', path: EP('/player/:id'), desc: 'Detail pemain' },
  { method: 'GET', path: EP('/player/:id/overview'), desc: 'Ringkasan pemain + logo + tim' },
  { method: 'GET', path: EP('/search/all?q='), desc: 'Search tim/pemain/liga/match' },
  { method: 'GET', path: EP('/search/suggest?term='), desc: 'Autocomplete mentah FotMob' },
  { method: 'GET', path: EP('/news/world?page='), desc: 'Berita dunia' },
  { method: 'GET', path: EP('/news/trending'), desc: 'Berita trending' },
  { method: 'GET', path: EP('/transfers'), desc: 'Bursa transfer' },
];

export const docsController = {
  // GET /api/docs — daftar endpoint + contoh ID valid
  getDocs: (_req: Request, res: Response) => {
    sendSuccess(res, {
      name: 'Football Live API',
      version: '3.2.0',
      sampleIds: {
        leagueId: 47,
        teamId: 9825,
        playerId: 30981,
        matchId: 5795450,
        date: '2026-09-15',
        season: '2026/2027',
      },
      endpoints: ENDPOINTS,
    });
  },

  // GET /api/health
  getHealth: (_req: Request, res: Response) => {
    sendSuccess(res, { status: 'ok', uptime: Math.floor(process.uptime()), time: new Date().toISOString() });
  },
};
