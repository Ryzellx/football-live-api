import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';

export function requestId(_req: Request, res: Response, next: NextFunction): void {
  const id = randomUUID();
  res.set('X-Request-Id', id);
  next();
}

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
}

// Express 5 meneruskan error async otomatis ke sini
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction): void {
  console.error(`[Error] ${err?.message || err}`);
  if (res.headersSent) return;
  const status = typeof err?.status === 'number' ? err.status : 500;
  res.status(status).json({ success: false, message: err?.message || 'Internal server error' });
}
