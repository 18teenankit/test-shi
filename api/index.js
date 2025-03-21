// Vercel API handler
export default function handler(req, res) {
  // Log the request
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Basic info endpoint
  if (req.url === '/api/info') {
    return res.status(200).json({
      status: 'ok',
      message: 'API is operational',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0'
    });
  }
  
  // Health check endpoint
  if (req.url === '/api/health' || req.url === '/_health') {
    return res.status(200).json({ 
      status: 'healthy',
      uptime: process.uptime()
    });
  }
  
  // Generic response for other API routes
  if (req.url.startsWith('/api/')) {
    return res.status(200).json({
      status: 'pending',
      message: 'This API endpoint is under development',
      path: req.url
    });
  }
  
  // Return a redirect to the main site for non-API requests
  return res.status(307).setHeader('Location', '/').end();
} 