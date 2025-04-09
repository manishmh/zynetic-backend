// Required for vercel deployment

import { createServer } from 'http';
import app from '../server';
import { Server } from 'http';

module.exports = (req: any, res: any) => {
  const server: Server = createServer(app);
  server.emit('request', req, res);
};
