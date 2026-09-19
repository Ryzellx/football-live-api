import axios, { AxiosRequestConfig } from 'axios';
import { config } from '../config/env';

export const FOTMOB_API = config.fotmobBaseUrl;
export const FOTMOB_IMG_TEAM = (id: number | string) =>
  `https://images.fotmob.com/image_resources/logo/teamlogo/${id}.png`;
export const FOTMOB_IMG_LEAGUE = (id: number | string) =>
  `https://images.fotmob.com/image_resources/logo/leaguelogo/${id}.png`;
export const FOTMOB_IMG_PLAYER = (id: number | string) =>
  `https://images.fotmob.com/image_resources/logo/playerimages/${id}.png`;

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

export function toYmd(date: string): string {
  if (/^\d{8}$/.test(date)) return date;
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date.replace(/-/g, '');
  const d = date ? new Date(date) : new Date();
  if (isNaN(d.getTime())) {
    const n = new Date();
    return `${n.getFullYear()}${String(n.getMonth() + 1).padStart(2, '0')}${String(n.getDate()).padStart(2, '0')}`;
  }
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
}

export function toIso(date: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  if (/^\d{8}$/.test(date)) return `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
  return new Date().toISOString().split('T')[0];
}

export async function fotmobGet<T = any>(path: string, options: AxiosRequestConfig = {}): Promise<T> {
  let lastError: Error | null = null;
  for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
    try {
      const res = await axios({
        url: `${FOTMOB_API}${path}`,
        method: 'GET',
        timeout: config.requestTimeout,
        headers: {
          'User-Agent': UA,
          Accept: 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          Referer: 'https://www.fotmob.com/',
          ...options.headers,
        },
        maxRedirects: 5,
        ...options,
      });
      return res.data as T;
    } catch (error: any) {
      lastError = error;
      if (error?.response?.status === 404) break;
      console.error(`[FotMob] GET ${path} attempt ${attempt}/${config.maxRetries}: ${error.message}`);
      if (attempt < config.maxRetries) {
        await new Promise((r) => setTimeout(r, Math.min(1000 * attempt, 3000)));
      }
    }
  }
  throw lastError || new Error(`FotMob GET ${path} failed`);
}

export async function fetchJson<T = any>(url: string): Promise<T> {
  const res = await axios({
    url,
    method: 'GET',
    timeout: config.requestTimeout,
    headers: {
      'User-Agent': UA,
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      Referer: 'https://www.fotmob.com/',
    },
    maxRedirects: 5,
  });
  return res.data as T;
}

// ── Shared cache dengan TTL ──────────────────────────────────────────────────

type CacheEntry = { data: any; fetchedAt: number };
const cache = new Map<string, CacheEntry>();

export function getCache(key: string, ttlMs: number): any | null {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.fetchedAt < ttlMs) return hit.data;
  return null;
}

export function setCache(key: string, data: any): void {
  cache.set(key, { data, fetchedAt: Date.now() });
  if (cache.size > 500) {
    const oldest = cache.keys().next().value;
    if (oldest) cache.delete(oldest);
  }
}

export const TTL = {
  matches: 60 * 1000,
  matchDetail: 20 * 1000,
  live: 20 * 1000,
  league: 5 * 60 * 1000,
  team: 5 * 60 * 1000,
  player: 10 * 60 * 1000,
  search: 5 * 60 * 1000,
};
