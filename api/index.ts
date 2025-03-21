import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "../server/routes";
import { serveStatic } from "../server/vite";
import path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env'
});

// Log environment info for debugging
console.log('Node Environment:', process.env.NODE_ENV);
console.log('Database URL:', process.env.DATABASE_URL ? 'Set (hidden for security)' : 'Not set');

// Initialize express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add middleware to handle API routes
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    // Set proper headers for all API responses
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    // Handle redirects for auth routes
    if (req.path === '/api/auth/login') {
      req.url = '/api/login';
    } else if (req.path === '/api/auth/user') {
      req.url = '/api/current-user';
    }
  }
  next();
});

// Add debugging middleware for Vercel
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Basic root handler for health check
app.get('/_health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Register all API routes
try {
  registerRoutes(app);
} catch (error) {
  console.error('Error registering routes:', error);
}

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  
  // Handle source map errors
  if (req.url.endsWith('.map')) {
    return res.status(404).end();
  }
  
  // Handle other errors
  res.status(500).json({
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal Server Error' 
      : err.message
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  try {
    serveStatic(app);
  } catch (error) {
    console.error('Error setting up static files:', error);
  }
}

// Add fallback route handler
app.use('*', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '../dist/client/index.html'));
});

// Export the Express app as the default handler for Vercel
export default app; 