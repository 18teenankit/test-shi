// API Handler for Vercel Serverless Function
export default function handler(req, res) {
  // Log request for debugging
  console.log(`[API] ${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Info endpoint
  if (req.url === '/api/info') {
    return res.status(200).json({
      status: 'ok',
      message: 'API is operational',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    });
  }
  
  // Health check endpoint
  if (req.url === '/api/health' || req.url === '/_health') {
    return res.status(200).json({ 
      status: 'healthy',
      uptime: process.uptime()
    });
  }
  
  // Handle other API routes
  if (req.url.startsWith('/api/')) {
    return res.status(200).json({
      status: 'pending',
      message: 'This API endpoint is under development',
      path: req.url
    });
  }
  
  // Fallback for non-API requests
  return res.status(307).setHeader('Location', '/').end();
} 