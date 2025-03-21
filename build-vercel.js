const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Set production environment
process.env.NODE_ENV = 'production';
process.env.SKIP_TYPESCRIPT_CHECK = 'true';

// Define directories
const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const clientDir = path.join(distDir, 'client');
const uploadsDir = path.join(clientDir, 'uploads');
const apiDir = path.join(rootDir, 'api');

console.log(`[Vercel Build] Starting simplified build process at ${new Date().toISOString()}`);

// Create necessary directories
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
  console.log('[Vercel Build] Created dist directory');
}

if (!fs.existsSync(clientDir)) {
  fs.mkdirSync(clientDir);
  console.log('[Vercel Build] Created client directory');
}

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log('[Vercel Build] Created uploads directory');
}

// Try to build the client with Vite
try {
  console.log('[Vercel Build] Building client with Vite...');
  execSync('npx vite build', { stdio: 'inherit' });
  console.log('[Vercel Build] Vite build completed successfully');
} catch (error) {
  console.error('[Vercel Build] Vite build failed:', error.message);
  console.log('[Vercel Build] Creating fallback HTML file...');
  
  // Create a simple fallback index.html
  const fallbackHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shivanshi Enterprises</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 650px; margin: 0 auto; padding: 2rem; }
    h1 { color: #e11d48; }
    p { line-height: 1.6; }
  </style>
</head>
<body>
  <h1>Shivanshi Enterprises</h1>
  <p>Our website is currently undergoing maintenance. Please check back soon!</p>
  <p>For inquiries, please contact us at: <a href="mailto:shivanshienterprises44@gmail.com">shivanshienterprises44@gmail.com</a></p>
  <hr>
  <p><small>Build time: ${new Date().toISOString()}</small></p>
</body>
</html>
  `.trim();
  
  fs.writeFileSync(path.join(clientDir, 'index.html'), fallbackHtml);
  console.log('[Vercel Build] Created fallback index.html');
}

// Create a test.html file to verify static file serving
console.log('[Vercel Build] Creating test.html...');
const testHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Static File Test</title>
</head>
<body>
  <h1>Static File Test</h1>
  <p>If you can see this page, static file serving is working correctly.</p>
  <p>Build time: ${new Date().toISOString()}</p>
</body>
</html>
`.trim();

fs.writeFileSync(path.join(clientDir, 'test.html'), testHtml);
console.log('[Vercel Build] Created test.html');

// Copy public assets
const publicDir = path.join(rootDir, 'client', 'public');
if (fs.existsSync(publicDir)) {
  console.log('[Vercel Build] Copying public assets...');
  
  // Recursive directory copy function
  function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (entry.isDirectory()) {
        copyDir(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
  
  try {
    copyDir(publicDir, clientDir);
    console.log('[Vercel Build] Public assets copied successfully');
  } catch (error) {
    console.error('[Vercel Build] Failed to copy public assets:', error.message);
  }
}

// Copy uploads if they exist
const uploadsSourceDir = path.join(rootDir, 'uploads');
if (fs.existsSync(uploadsSourceDir)) {
  console.log('[Vercel Build] Copying uploads directory...');
  
  try {
    // Recursive copy uploads directory
    function copyDir(src, dest) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      
      const entries = fs.readdirSync(src, { withFileTypes: true });
      
      for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
          copyDir(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    }
    
    copyDir(uploadsSourceDir, uploadsDir);
    console.log('[Vercel Build] Uploads directory copied successfully');
  } catch (error) {
    console.error('[Vercel Build] Failed to copy uploads:', error.message);
  }
}

// Create build info file for debugging
const buildInfo = {
  timestamp: new Date().toISOString(),
  environment: process.env.NODE_ENV,
  node_version: process.version,
  files: {
    client: fs.existsSync(clientDir) ? fs.readdirSync(clientDir) : [],
    api: fs.existsSync(apiDir) ? fs.readdirSync(apiDir) : []
  }
};

fs.writeFileSync(
  path.join(rootDir, 'build-info.json'), 
  JSON.stringify(buildInfo, null, 2)
);
console.log('[Vercel Build] Created build-info.json for debugging');

console.log(`[Vercel Build] Build process completed at ${new Date().toISOString()}`); 