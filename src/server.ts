import app from './app';
import { config } from './config/env';

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`[Server] Live Football API running on port ${PORT}`);
  console.log(`[Server] Proxying requests to Sofascore API`);
  console.log(`[Server] http://localhost:${PORT}`);
});
