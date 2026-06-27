import { Response } from 'express';
import { config } from '../config/env';

export interface ApiResponse<T = any> {
  success: boolean;
  source?: string;
  updatedAt?: string;
  data?: T;
  message?: string;
}

export function sendSuccess<T>(res: Response, data: T, source?: string): void {
  res.json({
    success: true,
    source: source || config.sourceName || 'thesportsdb',
    updatedAt: new Date().toISOString(),
    data,
  });
}

export function sendError(res: Response, message: string, statusCode: number = 500): void {
  res.status(statusCode).json({
    success: false,
    message,
  });
}
