import 'dotenv/config';

function num(value: string | undefined, fallback: number): number {
  const n = parseInt(value || '', 10);
  return Number.isFinite(n) ? n : fallback;
}

export const config = {
  port: num(process.env.PORT, 3001),
  fotmobBaseUrl: process.env.FOTMOB_BASE_URL || 'https://www.fotmob.com/api',
  requestTimeout: num(process.env.REQUEST_TIMEOUT_MS, 15000),
  maxRetries: num(process.env.REQUEST_MAX_RETRIES, 3),
  sourceName: 'fotmob',
  defaultTimezone: process.env.DEFAULT_TIMEZONE || 'Asia/Jakarta',
  defaultCcode3: process.env.DEFAULT_CCODE3 || 'IDN',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  rateLimitWindowMs: num(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
  rateLimitMax: num(process.env.RATE_LIMIT_MAX, 600),
  searchRateLimitMax: num(process.env.SEARCH_RATE_LIMIT_MAX, 120),
  liveStreamIntervalMs: num(process.env.LIVE_STREAM_INTERVAL_MS, 30000),
  isProd: process.env.NODE_ENV === 'production',
};
