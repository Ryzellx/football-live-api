import app from './app';
import { config } from './config/env';

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`[Server] Live Football API v3 running on port ${PORT}`);
  console.log(`[Server] Docs: http://localhost:${PORT}/api/docs`);
  console.log(`[Server] Live SSE: http://localhost:${PORT}/api/matches/live/stream`);
});
