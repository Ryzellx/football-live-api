<div align="center">

# ⚽ Football Live API

**A powerful, free football data API powered by FotMob scraping**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Ryzellx/football-live-api)
![License](https://img.shields.io/github/license/Ryzellx/football-live-api?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express)

[🚀 Live Demo](https://football-live-api.vercel.app) • [📖 API Docs](#-api-endpoints) • [🎯 Frontend](https://footcore.vercel.app)

</div>

---

## ✨ Features

- 🏟️ **Live Scores** — Real-time match scores with minute-by-minute updates
- 📊 **Full Match Stats** — Possession, shots, xG, passes, tackles, and 50+ stats
- 👥 **Lineups** — Starting XI, substitutes, formations, player ratings
- 🗓️ **Match Calendar** — Matches by date with timezone support
- 🏆 **League Standings** — Full league tables with form guides
- 🔍 **Search** — Search for teams, players, and leagues
- 📈 **Player Stats** — Career history, trophies, market values, recent matches
- 🏠 **Club Info** — Squad, fixtures, transfers, trophies, form
- 🌍 **500+ Leagues** — From Premier League to J-League and beyond
- ⚡ **Fast & Cached** — 10-minute cache for optimal performance

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime |
| **Express** | HTTP Server |
| **TypeScript** | Type Safety |
| **FotMob** | Data Source (scraping) |
| **Vercel** | Deployment |

## 📦 Installation

```bash
# Clone the repo
git clone https://github.com/Ryzellx/football-live-api.git
cd football-live-api

# Install dependencies
npm install

# Build
npm run build

# Start
npm start
```

## 🚀 API Endpoints

### 📅 Matches

```
GET /api/fotmob/matches/date/:date
GET /api/fotmob/matches/range?from=YYYY-MM-DD&to=YYYY-MM-DD
```

<details>
<summary>Example Response</summary>

```json
{
  "success": true,
  "source": "fotmob",
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
GET /api/fotmob/match/:id
```

Returns: General info, header, match facts, events, stats, lineup, shotmap, H2H, player ratings, momentum, and more.

### 🏠 Club

```
GET /api/fotmob/club/:id
```

Returns: Club details, squad (coach, keepers, defenders, midfielders, attackers), trophies, fixtures, form, transfers, standings.

### 👤 Player

```
GET /api/fotmob/player/:id
```

Returns: Bio, player information, injuries, trophies, career history, recent matches, market values, traits.

### 🏆 League

```
GET /api/fotmob/league/:id
```

Returns: League details, full standings table, all fixtures, stats (top scorers, top assists), history.

### 🔍 Search

```
GET /api/fotmob/search/all?q=:query
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

<details>
<summary>Click to expand (200+ leagues)</summary>

### 🌐 International
FIFA World Cup • Champions League • Europa League • Conference League • EURO • Copa America • Friendlies • WC Qualifiers

### 🇪🇺 Europe
Premier League • La Liga • Serie A • Bundesliga • Ligue 1 • Eredivisie • Liga Portugal • Süper Lig • Scottish Premiership • Championship • League One • Superligaen • Allsvenskan • Eliteserien • Super League (Greece) • 1. Liga (Switzerland) • 2. Bundesliga • Serie B • and more...

### 🌎 Americas
Liga Profesional (Argentina) • Serie A/B (Brazil) • MLS (USA) • Liga MX (Mexico) • Primera División (Chile) • Primera A (Colombia)

### 🌏 Asia & Oceania
J1 League (Japan) • K League 1 (South Korea) • Pro League (Saudi Arabia) • A-League (Australia) • Super League (China)

### 🌍 Africa
Premier League (South Africa) • Botola Pro (Morocco)

</details>

## ⏰ Timezone Support

All match times are returned in UTC. Convert to local timezone:

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
| **Footcore** | ⚽ Football frontend (FotMob clone) | [footcore.vercel.app](https://footcore.vercel.app) |

## 📊 API Rate Limits

- **Cache Duration:** 10 minutes per league
- **No API Key Required:** Free to use
- **Fair Use:** Don't abuse the API

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

This API scrapes data from [FotMob](https://www.fotmob.com) for educational purposes. All football data belongs to FotMob. Please respect their terms of service.

## 🙏 Acknowledgments

- [FotMob](https://www.fotmob.com) — Data source
- [Vercel](https://vercel.com) — Hosting
- [Express](https://expressjs.com) — Web framework
- [TypeScript](https://www.typescriptlang.org) — Type safety

---

<div align="center">

**Made with ❤️ by [Ryzellx](https://github.com/Ryzellx)**

⭐ Star this repo if you find it useful!

</div>
