import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendDir = path.resolve(__dirname, '..');
const backendPublicDir = path.resolve(frontendDir, '../backend/public');
const frontendTargetDir = path.join(backendPublicDir, 'frontend');

const serverOutputPath = path.join(frontendDir, '.output/server/index.mjs');
const publicOutputPath = path.join(frontendDir, '.output/public');
const indexHtmlPath = path.join(publicOutputPath, 'index.html');

function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

async function buildIndexHtml() {
  console.log('Starting Nitro server to capture index.html...');
  return new Promise((resolve, reject) => {
    const server = spawn('node', [serverOutputPath], {
      env: { ...process.env, PORT: '3333' }
    });

    let htmlCaptured = false;

    server.stdout.on('data', async (data) => {
      const out = data.toString();
      // Wait for server to be ready
      if (out.includes('Listening on') || out.includes('http://')) {
        try {
          const res = await fetch('http://localhost:3333/');
          const html = await res.text();
          fs.writeFileSync(indexHtmlPath, html, 'utf-8');
          console.log(`Successfully wrote index.html (${html.length} bytes)`);
          htmlCaptured = true;
          server.kill();
          resolve();
        } catch (e) {
          server.kill();
          reject(e);
        }
      }
    });

    server.stderr.on('data', (data) => {
      console.error('Server error:', data.toString());
    });

    server.on('close', (code) => {
      if (!htmlCaptured) {
        reject(new Error(`Server closed with code ${code} before capturing HTML`));
      }
    });
    
    // Timeout
    setTimeout(() => {
      if (!htmlCaptured) {
        server.kill();
        reject(new Error('Timed out waiting for server to start'));
      }
    }, 10000);
  });
}

async function syncToLaravel() {
  console.log(`Synchronizing assets to ${frontendTargetDir}...`);
  if (!fs.existsSync(publicOutputPath)) {
    throw new Error(`Public build not found at ${publicOutputPath}`);
  }

  if (fs.existsSync(frontendTargetDir)) {
    console.log('Cleaning existing frontend assets in Laravel...');
    fs.rmSync(frontendTargetDir, { recursive: true, force: true });
  }

  if (!fs.existsSync(backendPublicDir)) {
    fs.mkdirSync(backendPublicDir, { recursive: true });
  }

  copyDirectory(publicOutputPath, frontendTargetDir);
  console.log('Synchronization complete.');
}

async function run() {
  try {
    await buildIndexHtml();
    await syncToLaravel();
    console.log('\n✅ Build successfully synchronized to Laravel!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Postbuild failed:', error);
    process.exit(1);
  }
}

run();
