// build.js - Build and deploy script for Shivanshi Enterprises Portal
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Configuration
const UPLOADS_DIR = 'uploads';
const DIST_DIR = 'dist';
const CLIENT_OUTPUT_DIR = path.join(DIST_DIR, 'client');
const SERVER_OUTPUT_DIR = path.join(DIST_DIR, 'server');
const PUBLIC_DIR = 'client/public';

// Helper to execute command and log output
async function runCommand(command, description) {
  console.log(`\n🔄 ${description}...`);
  try {
    const { stdout, stderr } = await execAsync(command);
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    console.log(`✅ ${description} completed successfully`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed: ${error.message}`);
    if (error.stdout) console.log(error.stdout);
    if (error.stderr) console.error(error.stderr);
    return false;
  }
}

// Helper to ensure directory exists
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dirPath}`);
  }
}

// Copy directory
function copyDirectory(source, destination) {
  ensureDirectoryExists(destination);
  
  const items = fs.readdirSync(source);
  
  for (const item of items) {
    const sourcePath = path.join(source, item);
    const destPath = path.join(destination, item);
    
    const stats = fs.statSync(sourcePath);
    
    if (stats.isFile()) {
      fs.copyFileSync(sourcePath, destPath);
    } else if (stats.isDirectory()) {
      copyDirectory(sourcePath, destPath);
    }
  }
  
  console.log(`📋 Copied directory: ${source} → ${destination}`);
}

// Main build function
async function build() {
  try {
    console.log('🚀 Starting build process...');
    
    // Check if uploads directory exists and create if it doesn't
    ensureDirectoryExists(UPLOADS_DIR);
    
    // Clean dist directory
    if (fs.existsSync(DIST_DIR)) {
      console.log('🧹 Cleaning dist directory...');
      fs.rmSync(DIST_DIR, { recursive: true, force: true });
    }
    
    // Install dependencies if needed
    if (process.env.INSTALL_DEPS) {
      if (!await runCommand('npm install', 'Installing dependencies')) {
        return;
      }
    }
    
    // Build client
    if (!await runCommand('npx vite build', 'Building client')) {
      return;
    }
    
    // Build server
    if (!await runCommand(
      'npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist/server',
      'Building server'
    )) {
      return;
    }
    
    // Copy public files to client output
    if (fs.existsSync(PUBLIC_DIR)) {
      console.log(`📦 Copying public files to ${CLIENT_OUTPUT_DIR}...`);
      copyDirectory(PUBLIC_DIR, CLIENT_OUTPUT_DIR);
    }
    
    // Copy uploads directory to client output
    if (fs.existsSync(UPLOADS_DIR)) {
      const clientUploadsDir = path.join(CLIENT_OUTPUT_DIR, 'uploads');
      console.log(`📦 Copying uploads to ${clientUploadsDir}...`);
      copyDirectory(UPLOADS_DIR, clientUploadsDir);
    }
    
    // Create a package.json for production
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const prodPackageJson = {
      name: packageJson.name,
      version: packageJson.version,
      type: "module",
      dependencies: packageJson.dependencies,
      scripts: {
        start: "NODE_ENV=production node server/index.js"
      }
    };
    
    fs.writeFileSync(
      path.join(DIST_DIR, 'package.json'),
      JSON.stringify(prodPackageJson, null, 2)
    );
    console.log('📄 Created production package.json');
    
    console.log('\n✨ Build completed successfully!');
    console.log('\nTo start the production server:');
    console.log('cd dist && npm start');
    
  } catch (error) {
    console.error('❌ Build failed:', error);
  }
}

// Run the build process
build(); 