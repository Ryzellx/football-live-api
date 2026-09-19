<div align="center">

# ⚽ Football Live API

**A powerful, free football data API — live scores, stats, xG, lineups, standings, news & transfers**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Ryzellx/football-live-api)
![License](https://img.shields.io/github/license/Ryzellx/football-live-api?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express)

[🚀 Live Demo](https://football-live-api.vercel.app) • [📖 API Docs](https://football-live-api.vercel.app/api/docs) • [🎯 Frontend](https://footcore.vercel.app)

</div>

---

## ✨ Features

- 🔴 **Live Scores + SSE stream** — `/matches/live` & `/matches/live/stream` (push tiap ~30 dtk) + `/matches/today|tomorrow|yesterday|notable`
- 🏠 **Home feed 1 panggilan** — `/api/home`: jadwal hari ini + live + trending + transfer
- 📊 **Full Match Detail** — overview, timeline, events, stats (Periods All/1H/2H), xG topStats, shotmap, momentum, lineups, ratings, H2H, info venue/wasit, commentary, TV, odds (null bila kosong)
- 🧩 **Siap-render overview** — `/match/:id/overview`, `/team/:id/overview`, `/league/:id/overview`
- 🗓️ **Match Calendar** — by date + today/tomorrow/yesterday + range (maks 51 hari), timezone & ccode3 support
- 🏆 **League Hub** — detail, klasemen ternormalisasi (`?scope=all|home|away|form|xg` + legend zona), xG/justice table, fixtures/results per musim, topscorers (`?full=1` full list), topassists/topkeepers/cards, stats, difficulty
- 👤 **Player Hub** — overview (posisi, umur, value), statistics, matches, history karier, transfers karier, injuries, value history
- 🛡️ **Team Hub** — squad per posisi, fixtures/results, stats (opsional `?tournamentId=`), transfers, injuries/suspensions (jujur kosong bila upstream tidak ada)
- 🔍 **Search hidup** — tim, pemain, liga, match, coach, referee + autocomplete
- 📰 **News & Transfers** — latest/breaking/world/trending, per tim/pemain/liga + bursa (latest/official/loans/free/rumours/most-expensive)
- 📈 **Leaderboards** — `/stats/leaderboard/:metric` (goals|assists|rating|xg|xa|shots|chances|passes|tackles|interceptions|recoveries|dribbles|cleansheets|saves|cards|minutes)
- 🧰 **Tools** — `/tools/fifa-rankings|team-of-the-week|predictor|lineup-builder|tv` (null + note bila upstream tidak menyediakan — NULL = N/A, bukan 0)
- 🖼️ **Logo enrichment** — setiap tim/liga/pemain otomatis dapat field `logo` (+ `faceImageUrl` pemain)
- ⚡ **Cache berlapis** — live 30 dtk, list 60 dtk, liga/tim 5 mnt (plus header Cache-Control)
- 🛡️ **Production-ready** — helmet, gzip, rate-limit, request-id, `/health`, `/docs`

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime |
| **Express 5** | HTTP Server + SSE |
| **TypeScript** | Type Safety |
| **External JSON feed** | Data Source |
| **Vercel** | Deployment |

## 📦 Installation

```bash
# Clone the repo
git clone https://github.com/Ryzellx/football-live-api.git
cd football-live-api

# Install dependencies
npm install
cp .env.example .env   # opsional, semua ada default-nya

# Dev
npm run dev            # port 3001

# Produksi
npm run build && npm start
```

Env penting (lihat `.env.example`): `PORT`, `DEFAULT_TIMEZONE=Asia/Jakarta`,
`DEFAULT_CCODE3=IDN`, `RATE_LIMIT_MAX`, `LIVE_STREAM_INTERVAL_MS`.

## 🚀 API Endpoints

Base: `https://football-live-api.vercel.app` (lokal: `http://localhost:3001`).
Semua respons: `{ success, updatedAt, data }`.
Daftar lengkap yang selalu update: `GET /api/docs`.

### 🏠 Home, Health & Live

```
GET /api/home
GET /api/health
GET /api/docs
GET /api/matches/live?timezone=Asia/Jakarta&ccode3=IDN
GET /api/matches/live/stream?interval=30000     # SSE, event: live
GET /api/matches/today?timezone=Asia/Jakarta&ccode3=IDN
GET /api/matches/tomorrow?timezone=Asia/Jakarta&ccode3=IDN
GET /api/matches/yesterday?timezone=Asia/Jakarta&ccode3=IDN
GET /api/matches/notable
GET /api/matches/date/:date                    # YYYY-MM-DD / YYYYMMDD
GET /api/matches/range?from=2026-09-14&to=2026-09-15   # maks 51 hari
```

<details>
<summary>Example Response</summary>

```json
{
  "success": true,
  "data": {
    "leagues": [
      {
        "id": 147,
        "name": "Premier League",
        "country": "England",
        "matches": [
          {
            "id": 4667808,
            "home": { "name": "Arsenal", "id": 9825 },
            "away": { "name": "Chelsea", "id": 8455 },
            "status": {
              "utcTime": "2026-06-28T15:00:00Z",
              "finished": false,
              "started": false
            }
          }
        ]
      }
    ]
  }
}
```

</details>

### ⚽ Match Detail

```
GET /api/match/:id
GET /api/match/:id/overview         # ringkasan siap-render
GET /api/match/:id/summary
GET /api/match/:id/events
GET /api/match/:id/timeline         # gol/kartu/subs/VAR terurut
GET /api/match/:id/statistics
GET /api/match/:id/lineups
GET /api/match/:id/ratings          # + /player-stats alias
GET /api/match/:id/commentary       # liveticker + timeline
GET /api/match/:id/info             # venue, wasit+stats, attendance
GET /api/match/:id/shotmap
GET /api/match/:id/heatmap           # heatmap URL + attacking zones
GET /api/match/:id/momentum
GET /api/match/:id/h2h
GET /api/match/:id/table
GET /api/match/:id/media            # + /highlights alias
GET /api/match/:id/odds             # null bila tidak tersedia
GET /api/match/:id/tv?countryCode=ID
```

### 🏠 Club & 👤 Player

```
GET /api/team/:id                   # /club/:id alias
GET /api/team/:id/overview          # next/last match, form, upcoming, results
GET /api/team/:id/squad             # coach + keeper/def/mid/att + face
GET /api/team/:id/fixtures
GET /api/team/:id/results
GET /api/team/:id/stats?tournamentId=47   # opsional; tanpa param = stats umum
GET /api/team/:id/statistics        # alias
GET /api/team/:id/transfers
GET /api/team/:id/injuries
GET /api/team/:id/suspensions
GET /api/team/:id/news
GET /api/team/:id/videos
GET /api/player/:id
GET /api/player/:id/overview        # posisi, umur, value, face
GET /api/player/:id/statistics      # musim + liga utama + trofi
GET /api/player/:id/matches
GET /api/player/:id/history         # karier
GET /api/player/:id/transfers       # dari riwayat karier
GET /api/player/:id/injuries        # null bila sehat
GET /api/player/:id/news
GET /api/player/:id/value           # market value history
```

### 🏆 League, 🔍 Search, 📰 News, 🧰 Tools

```
GET /api/leagues
GET /api/leagues/grouped
GET /api/league/:id
GET /api/league/:id/overview?season=2026/2027
GET /api/league/:id/table?scope=all|home|away|form|xg
GET /api/league/:id/xg-table
GET /api/league/:id/fixtures?season=2026/2027
GET /api/league/:id/results?season=2026/2027
GET /api/league/:id/topscorers?full=1
GET /api/league/:id/topassists
GET /api/league/:id/topkeepers
GET /api/league/:id/cards
GET /api/league/:id/stats
GET /api/league/:id/news
GET /api/league/:id/difficulty
GET /api/competition/:id/...        # alias standings|fixtures|results|topscorers|topassists|topkeepers|cards|stats|xg-table|overview
GET /api/stats/topscorers?leagueId=47
GET /api/stats/leaderboard/:metric?leagueId=47   # goals|assists|rating|xg|xa|shots|chances|passes|tackles|interceptions|recoveries|dribbles|cleansheets|saves|cards|minutes
GET /api/search/all?q=messi
GET /api/search/suggest?term=ronaldo
GET /api/news/world?page=1
GET /api/news/latest?page=1
GET /api/news/breaking
GET /api/news/trending
GET /api/news/team/:id
GET /api/news/player/:id
GET /api/news/competition/:id
GET /api/transfers?limit=50
GET /api/transfers/latest|official|loans|free|most-expensive?limit=
GET /api/transfers/rumours?teamId=
GET /api/injuries/team/:id
GET /api/injuries/player/:id
GET /api/tools/fifa-rankings
GET /api/tools/team-of-the-week
GET /api/tools/predictor
GET /api/tools/lineup-builder
GET /api/tools/tv?matchId=&countryCode=ID
```

### 🔑 Sample IDs

```
leagueId=47 (Premier League) • teamId=9825 (Arsenal) • playerId=30981 (Messi)
matchId=5795450 • date=2026-09-15 • season=2026/2027
```

### 🧪 SSE live score tanpa polling

```javascript
const es = new EventSource('/api/matches/live/stream?timezone=Asia/Jakarta');
es.addEventListener('live', (e) => {
  const { data } = JSON.parse(e.data);
  console.log('live total:', data.total);
});
```

## 📸 Response Examples

<details>
<summary>🏟️ Match Detail</summary>

```json
{
  "success": true,
  "data": {
    "general": { "matchId": 4667808, "matchName": "Arsenal vs Chelsea" },
    "header": {
      "teams": [
        { "name": "Arsenal", "id": 9825, "score": 2 },
        { "name": "Chelsea", "id": 8455, "score": 1 }
      ],
      "status": { "scoreStr": "2 - 1", "finished": true }
    },
    "content": {
      "matchFacts": { "events": { "incidents": [...] }, "infoBox": {...} },
      "stats": { "Periods": { "All": { "stats": [...] } } },
      "lineup": { "homeTeam": {...}, "awayTeam": {...} },
      "shotmap": { "shots": [...] },
      "h2h": { "summary": [5, 2, 3] },
      "playerStats": { "906937": {...} },
      "momentum": { "main": { "data": [...] } }
    }
  }
}
```

</details>

<details>
<summary>🏠 Club Detail</summary>

```json
{
  "success": true,
  "data": {
    "id": 9825,
    "name": "Arsenal",
    "country": "England",
    "squad": {
      "coach": [{ "id": 123, "name": "Mikel Arteta" }],
      "keepers": [...],
      "defenders": [...],
      "midfielders": [...],
      "attackers": [...]
    },
    "trophyCount": 47,
    "trophies": [...],
    "fixtures": {
      "allFixtures": [...],
      "nextMatch": {...},
      "lastMatch": {...}
    }
  }
}
```

</details>

## 🌍 Supported Leagues

Semua liga yang didukung (ratusan, bukan daftar statis) — ambil dari `GET /api/leagues`:

International: Champions League • Europa League • Conference League • World Cup • EURO • Copa America …
Europe: Premier League • La Liga • Serie A • Bundesliga • Ligue 1 • Eredivisie • Liga Portugal …
Americas: Liga Profesional • Serie A/B Brazil • MLS • Liga MX …
Asia: J1 League • K League 1 • Saudi Pro League • A-League …

## ⏰ Timezone Support

Default `Asia/Jakarta`. Override per request: `?timezone=Asia/Makassar&ccode3=IDN`.

```javascript
// JavaScript
const localTime = new Date(match.status.utcTime).toLocaleString('en-US', {
  timeZone: 'Asia/Jakarta', // WIB
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
});
```

| Timezone | Region |
|----------|--------|
| `Asia/Jakarta` | WIB (Jakarta) |
| `Asia/Makassar` | WITA (Bali) |
| `Asia/Jayapura` | WIT (Papua) |
| `Europe/London` | GMT (London) |
| `America/New_York` | EST (New York) |
| `America/Los_Angeles` | PST (Los Angeles) |
| `Asia/Tokyo` | JST (Tokyo) |

## 🔗 Related Projects

| Project | Description | Link |
|---------|-------------|------|
| **Footcore** | ⚽ Football frontend | [footcore.vercel.app](https://footcore.vercel.app) |

## 📊 Rate Limits & Cache

- General: 600 req / 15 mnt • Search: 120 / 15 mnt (ubah via `.env`)
- Server cache: live 30 dtk • match detail 20 dtk • list 60 dtk • liga/tim 5 mnt • pemain 10 mnt
- Header `Cache-Control` dikirim agar CDN/browser ikut cache
- Tanpa API key. Fair use — jangan spam interval SSE di bawah 10 dtk
- **NULL = N/A**: statistik yang tidak tersedia dari upstream dikembalikan `null`, bukan `0`. Di client tampilkan "N/A" bila `null` (sesuai catatan implementasi PRD §Important Implementation Note).

## ⚠️ Keterbatasan data

- `odds` dikembalikan `null` bila upstream tidak menyediakan (bukan error)
- `notableMatches` kadang kosong tergantung hari
- `tvlistings` tergantung region (`countryCode`)
- Cedera/suspensi terpisah tidak selalu tersedia — endpoint mengembalikan `[]` + note jujur
- FIFA rankings / TOTW / audio commentary / video resmi: belum tersedia dari upstream → `/api/tools/*` mengembalikan status + note
- Delay realtime wajar ±20–60 dtk (REST + cache)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

Data disediakan untuk tujuan edukasi. Hormati ketentuan layanan penyedia data.

## 🙏 Acknowledgments

- [Vercel](https://vercel.com) — Hosting
- [Express](https://expressjs.com) — Web framework
- [TypeScript](https://www.typescriptlang.org) — Type safety

---

<div align="center">

**Made with ❤️ by [Ryzellx](https://github.com/Ryzellx)**

⭐ Star this repo if you find it useful!

</div>
