import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendDir = path.resolve(__dirname, '..');
const backendPublicDir = path.resolve(frontendDir, '../backend/public');
const publicOutputPath = path.join(frontendDir, '.build_output/public');
const assetsPath = path.join(publicOutputPath, 'assets');
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

/**
 * Build a minimal SPA shell HTML.
 *
 * Since ssr: false is set, TanStack Router runs entirely on the client.
 * We must NOT use the Nitro-SSR-rendered page as the shell because it
 * embeds route state for "/" which breaks hydration on any other route.
 *
 * Instead we produce a bare-bones HTML document that:
 *   1. Loads the stylesheet built by Vite (discovered from the assets dir)
 *   2. Has an empty <body> – React mounts into it via document
 *   3. Loads the JS entry chunk (index-*.js discovered from the assets dir)
 */
function buildSpaShell() {
  console.log('Building minimal SPA shell HTML (ssr: false mode)...');

  if (!fs.existsSync(assetsPath)) {
    throw new Error(`Assets directory not found: ${assetsPath}`);
  }

  const assetFiles = fs.readdirSync(assetsPath);

  // Find the main JS entry — named index-<hash>.js
  const jsEntry = assetFiles.find(
    (f) => f.startsWith('index-') && f.endsWith('.js')
  );
  if (!jsEntry) {
    throw new Error('Could not find main JS entry (index-*.js) in assets.');
  }

  // Find the CSS stylesheet — named styles-<hash>.css or index-<hash>.css
  const cssEntry = assetFiles.find(
    (f) => (f.startsWith('styles-') || f.startsWith('index-')) && f.endsWith('.css')
  );

  const cssTag = cssEntry
    ? `<link rel="stylesheet" href="/assets/${cssEntry}" />`
    : '';

  const shell = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Campus Exchange \u2014 University Student Marketplace</title>
    <meta name="description" content="Buy and sell within your university community. Campus Exchange is a student marketplace for verified university students." />
    <link rel="icon" href="/favicon.ico" type="image/x-icon" />
    ${cssTag}
  </head>
  <body>
    <!--
      SPA shell — React/TanStack Router renders everything client-side into #root.
    -->
    <div id="root"></div>
    <script type="module" src="/assets/${jsEntry}"></script>
  </body>
</html>
`;

  fs.writeFileSync(indexHtmlPath, shell, 'utf-8');
  console.log(`SPA shell written (${shell.length} bytes) → ${indexHtmlPath}`);
}

async function syncToLaravel() {
  console.log(`Synchronizing assets to ${backendPublicDir}...`);

  if (!fs.existsSync(publicOutputPath)) {
    throw new Error(`Public build not found at ${publicOutputPath}`);
  }

  // ── assets/ ──────────────────────────────────────────────────────────────
  const assetsSrc = path.join(publicOutputPath, 'assets');
  const assetsDest = path.join(backendPublicDir, 'assets');

  if (fs.existsSync(assetsDest)) {
    console.log('Cleaning existing assets in Laravel...');
    try {
      fs.rmSync(assetsDest, { recursive: true, force: true });
    } catch (e) {
      if (e.code !== 'EPERM' && e.code !== 'EBUSY') throw e;
      console.warn(`[Postbuild] Could not completely remove ${assetsDest}. Will overwrite.`);
    }
  }

  if (!fs.existsSync(backendPublicDir)) {
    fs.mkdirSync(backendPublicDir, { recursive: true });
  }

  if (fs.existsSync(assetsSrc)) {
    copyDirectory(assetsSrc, assetsDest);
    // Also mirror under frontend/ for the Laravel _boost sub-path
    const frontendAssetsDest = path.join(backendPublicDir, 'frontend/assets');
    copyDirectory(assetsSrc, frontendAssetsDest);
  }

  // ── index.html → spa.html & frontend/index.html ──────────────────────────
  if (fs.existsSync(indexHtmlPath)) {
    fs.copyFileSync(indexHtmlPath, path.join(backendPublicDir, 'spa.html'));

    const frontendDir2 = path.join(backendPublicDir, 'frontend');
    if (!fs.existsSync(frontendDir2)) fs.mkdirSync(frontendDir2, { recursive: true });
    fs.copyFileSync(indexHtmlPath, path.join(frontendDir2, 'index.html'));
    console.log('Copied SPA shell → backend/public/spa.html & backend/public/frontend/index.html');
  }

  // ── favicon ───────────────────────────────────────────────────────────────
  const faviconSrc = path.join(publicOutputPath, 'favicon.ico');
  if (fs.existsSync(faviconSrc)) {
    fs.copyFileSync(faviconSrc, path.join(backendPublicDir, 'favicon.ico'));
  }

  console.log('Synchronization complete.');
}

async function run() {
  try {
    buildSpaShell();
    await syncToLaravel();
    console.log('\n✅ Build successfully synchronized to Laravel!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Postbuild failed:', error);
    process.exit(1);
  }
}

run();
