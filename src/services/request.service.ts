import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { config } from '../config/env';

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
];

function getRandomUA(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

export async function makeRequest<T = any>(url: string, options: AxiosRequestConfig = {}): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
    try {
      const response: AxiosResponse<T> = await axios({
        url,
        method: 'GET',
        timeout: config.requestTimeout,
        headers: {
          'User-Agent': getRandomUA(),
          'Accept': 'application/json',
          ...options.headers,
        },
        maxRedirects: 5,
        ...options,
      });

      if (response.status === 200 && response.data) {
        return response.data;
      }

      throw new Error(`HTTP ${response.status}`);
    } catch (error: any) {
      lastError = error;
      console.error(`[RequestService] Attempt ${attempt}/${config.maxRetries} failed for ${url}: ${error.message}`);

      if (attempt < config.maxRetries) {
        const delay = Math.min(1000 * attempt, 3000);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('Request failed after retries');
}
