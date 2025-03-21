// Basic Express server for Vercel deployment
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Setup dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize express app
const app = express();

// Basic middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/_health', (req, res) => {
  res.status(200).json({ status: 'ok', environment: process.env.NODE_ENV });
});

// API route for database info (without actually connecting)
app.get('/api/info', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'API is running',
    env: process.env.NODE_ENV,
    db: process.env.DATABASE_URL ? 'configured' : 'not configured'
  });
});

// Serve the fallback HTML for any other routes
app.use('*', (req, res) => {
  try {
    const fallbackPath = path.join(__dirname, 'fallback.html');
    
    if (fs.existsSync(fallbackPath)) {
      res.sendFile(fallbackPath);
    } else {
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Shivanshi Enterprises</title>
            <style>
              body { font-family: sans-serif; text-align: center; padding: 50px; }
              h1 { color: #0066cc; }
              .btn { display: inline-block; background: #0066cc; color: white; 
                    padding: 10px 20px; text-decoration: none; border-radius: 4px; }
            </style>
          </head>
          <body>
            <h1>Shivanshi Enterprises</h1>
            <p>Welcome to our site</p>
            <a href="/" class="btn">Go to Homepage</a>
          </body>
        </html>
      `);
    }
  } catch (error) {
    console.error('Error serving fallback page:', error);
    res.status(200).send('Redirecting to homepage...');
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});

// Export the app for Vercel
export default app; 