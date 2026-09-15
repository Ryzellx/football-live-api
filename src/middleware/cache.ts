import { NextFunction, Request, Response } from 'express';

export function cache(seconds: number) {
  return (_req: Request, res: Response, next: NextFunction): void => {
    res.set('Cache-Control', `public, max-age=${seconds}`);
    next();
  };
}

export const CACHE_SHORT = 30;
export const CACHE_MEDIUM = 60;
export const CACHE_LONG = 300;
