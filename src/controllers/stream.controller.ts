import { Request, Response } from 'express';
import { fotmobService } from '../services/fotmob.service';
import { config } from '../config/env';

// SSE: GET /api/fotmob/matches/live/stream — push skor live tiap interval
export function liveStream(req: Request, res: Response): void {
  const timezone = (req.query.timezone as string) || config.defaultTimezone;
  const ccode3 = (req.query.ccode3 as string) || config.defaultCcode3;
  const intervalMs = Math.max(10000, parseInt((req.query.interval as string) || '', 10) || config.liveStreamIntervalMs);

  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  res.flushHeaders?.();

  let closed = false;
  req.on('close', () => {
    closed = true;
    clearInterval(timer);
  });

  const push = async () => {
    if (closed) return;
    try {
      const data = await fotmobService.getLiveMatches(timezone, ccode3);
      res.write(`event: live\n`);
      res.write(`data: ${JSON.stringify({ success: true, source: 'fotmob', updatedAt: new Date().toISOString(), data })}\n\n`);
    } catch (error: any) {
      res.write(`event: error\n`);
      res.write(`data: ${JSON.stringify({ success: false, message: error?.message || 'stream error' })}\n\n`);
    }
  };

  const timer = setInterval(push, intervalMs);
  push();
  const hb = setInterval(() => {
    if (closed) {
      clearInterval(hb);
      return;
    }
    res.write(`: heartbeat\n\n`);
  }, 15000);
  req.on('close', () => clearInterval(hb));
}
