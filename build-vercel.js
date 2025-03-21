import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Set production environment for build
process.env.NODE_ENV = 'production';
process.env.TS_NODE_PROJECT = 'tsconfig.vercel.json';
process.env.SKIP_TYPESCRIPT_CHECK = 'true';

console.log('Starting Vercel build process...');
console.log('Node Environment:', process.env.NODE_ENV);
console.log('TypeScript Config:', process.env.TS_NODE_PROJECT);

try {
  // Ensure the output directories exist
  console.log('Ensuring output directories exist...');
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
  }
  if (!fs.existsSync('dist/client')) {
    fs.mkdirSync('dist/client');
  }
  if (!fs.existsSync('dist/server')) {
    fs.mkdirSync('dist/server');
  }
  if (!fs.existsSync('dist/client/uploads')) {
    fs.mkdirSync('dist/client/uploads');
  }

  // Copy production env file if not exists
  if (!fs.existsSync('.env.production')) {
    console.log('Creating .env.production file...');
    if (fs.existsSync('.env')) {
      fs.copyFileSync('.env', '.env.production');
    } else {
      // Create minimal .env.production file
      fs.writeFileSync('.env.production', 
        `DATABASE_URL=${process.env.DATABASE_URL || 'postgres://ankittgiri:Ankit@8511@postgresql-194487-0.cloudclusters.net:10138/my_shivi_db'}\n` +
        `NODE_ENV=production\n`
      );
    }
  }

  // Build the client
  console.log('Building client...');
  execSync('vite build --config vite.config.ts', { stdio: 'inherit' });

  // Copy public assets
  console.log('Copying public assets...');
  if (fs.existsSync('client/public')) {
    execSync('cp -r client/public/* dist/client/', { stdio: 'inherit' });
  }

  // Copy uploads folder if it exists (for initial deployment)
  if (fs.existsSync('uploads')) {
    console.log('Copying uploads folder...');
    execSync('cp -r uploads dist/client/', { stdio: 'inherit' });
  }

  // Create an index.html in api directory if it doesn't exist
  if (!fs.existsSync('api/index.html')) {
    console.log('Creating fallback HTML file...');
    fs.writeFileSync('api/index.html', `
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

  // Build the server API handler for Vercel with relaxed TypeScript checking
  console.log('Building API handler...');
  execSync('esbuild api/index.ts --platform=node --packages=external --bundle --format=esm --outdir=api/build --tsconfig=tsconfig.vercel.json', { stdio: 'inherit' });

  console.log('Vercel build completed successfully!');
} catch (error) {
  console.error('Build error:', error);
  process.exit(1);
} 