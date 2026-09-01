import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const frontend = dirname(here);
const dist = join(frontend, 'dist');
const target = process.env.MEETING_PUBLISH_ROOT || dirname(frontend);

if (!existsSync(join(dist, 'index.html'))) {
  throw new Error('Run npm run build first. frontend/dist/index.html is missing.');
}

const html = readFileSync(join(dist, 'index.html'), 'utf8');
if (!html.includes('/Meeting/assets/')) {
  throw new Error(
    'Build is still pointing at /assets/. Rebuild with: npm run build (vite --base /Meeting/)',
  );
}

mkdirSync(join(target, 'assets'), { recursive: true });

const distAssets = join(dist, 'assets');
if (existsSync(distAssets)) {
  for (const name of readdirSync(distAssets)) {
    if (name.startsWith('index-') && (name.endsWith('.js') || name.endsWith('.css'))) {
      rmSync(join(target, 'assets', name), { force: true });
    }
  }
  cpSync(distAssets, join(target, 'assets'), { recursive: true });
}

cpSync(join(dist, 'index.html'), join(target, 'index.html'));
for (const extra of ['.htaccess', 'web.config', 'api-proxy.php']) {
  const from = join(dist, extra);
  if (existsSync(from)) cpSync(from, join(target, extra));
}

console.log(`Published Meeting Hall UI to ${target}`);
console.log('Confirm index.html contains /Meeting/assets/ then hard-refresh the browser.');
