import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { config } from './config/env';
import routes from './routes';
import metaRoutes from './routes/meta.routes';
import homeRoutes from './routes/home.routes';
import streamRoutes from './routes/stream.routes';
import { requestId, notFound, errorHandler } from './middleware/http';
import { generalLimiter, searchLimiter } from './middleware/rateLimit';

const app = express();

app.disable('x-powered-by');
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(compression());
app.use(morgan(config.isProd ? 'combined' : 'dev'));
app.use(requestId);

app.use(
  cors({
    origin: config.corsOrigin === '*' ? true : config.corsOrigin.split(',').map((s) => s.trim()),
    maxAge: 86400,
  }),
);
app.use(express.json({ limit: '256kb' }));
app.use(express.urlencoded({ extended: true }));

app.use(generalLimiter);
app.use(['/api/search', '/api/fotmob/search', '/api/fotmob/search/all', '/api/fotmob/search/suggest'], searchLimiter);

app.use('/api', metaRoutes);
app.use('/api', homeRoutes);
app.use('/api', streamRoutes);
app.use('/api', routes);

app.get('/', (_req, res) => {
  res.json({
    name: 'Live Football API',
    version: '3.0.0',
    description: 'Football data API - FotMob live scores, stats, xG, lineups & more',
    source: 'fotmob',
    docs: '/api/docs',
    health: '/api/health',
    endpoints: {
      home: '/api/home',
      live: '/api/fotmob/matches/live (+ /stream SSE)',
      calendar: '/api/fotmob/matches/date/:date , /api/fotmob/matches/range?from=&to=',
      match: '/api/fotmob/match/:id (+ /overview, /summary, /media, /odds, /tv)',
      leagues: '/api/fotmob/leagues , /api/fotmob/league/:id (+ /overview, /table, /fixtures?season=, /news, /difficulty)',
      team: '/api/fotmob/team/:id (+ /overview, /fixtures, /results, /news, /stats?tournamentId=)',
      player: '/api/fotmob/player/:id (+ /overview)',
      search: '/api/fotmob/search/all?q= , /api/fotmob/search/suggest?term=',
      news: '/api/fotmob/news/world?page= , /api/fotmob/news/trending',
      transfers: '/api/fotmob/transfers',
      legacy: '/api/matches/live, /api/matches/today, /api/match/:id, /api/competition/:id, /api/team/:id, /api/player/:id, /api/search?q=, /api/news, /api/transfers',
    },
  });
});

app.use(notFound);
app.use(errorHandler);

export default app;
