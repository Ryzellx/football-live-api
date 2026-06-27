import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.get('/', (_req, res) => {
  res.json({
    name: 'Live Football API',
    version: '1.0.0',
    description: 'Football data API - TheSportsDB + FotMob detailed stats',
    source: 'thesportsdb, fotmob',
    endpoints: {
      matches: '/api/matches/live, /api/matches/today, /api/match/:id',
      competitions: '/api/competitions, /api/competition/:id',
      teams: '/api/team/:id',
      players: '/api/player/:id',
      search: '/api/search?q=',
      stats: '/api/stats/topscorers',
    },
  });
});

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
  });
});

export default app;
