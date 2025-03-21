import express, { type Request, Response, NextFunction } from 'express';
import { pgPool } from '../server/db';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Log requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/_health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Database connection check
app.get('/api/db-check', async (req, res) => {
  try {
    const result = await pgPool.query('SELECT NOW()');
    res.status(200).json({ 
      status: 'ok', 
      message: 'Database connection successful',
      time: result.rows[0].now
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Database connection failed',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : String(error)
    });
  }
});

// Add error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});

// Serve static fallback HTML for any other route
app.use('*', (req, res) => {
  try {
    const fallbackHtml = path.join(__dirname, 'fallback.html');
    if (fs.existsSync(fallbackHtml)) {
      res.sendFile(fallbackHtml);
    } else {
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta http-equiv="refresh" content="0;url=/">
            <title>Redirecting...</title>
          </head>
          <body>
            <p>Please wait while you're being redirected, or <a href="/">click here</a>.</p>
          </body>
        </html>
      `);
    }
  } catch (error) {
    console.error('Error serving fallback HTML:', error);
    res.redirect('/');
  }
});

export default app; 