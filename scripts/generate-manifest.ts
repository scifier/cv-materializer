import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const manifest = {
  short_name: `${process.env.REACT_APP_NAME} Portfolio`,
  name: `${process.env.REACT_APP_NAME} Portfolio`,
  icons: [
    {
      src: 'favicon.ico',
      sizes: '64x64 32x32 24x24 16x16',
      type: 'image/x-icon',
    },
    {
      src: 'logo192.png',
      type: 'image/png',
      sizes: '192x192',
    },
    {
      src: 'logo512.png',
      type: 'image/png',
      sizes: '512x512',
    },
  ],
  start_url: '.',
  display: 'standalone',
  theme_color: '#000000',
  background_color: '#ffffff',
};

try {
  fs.writeFileSync(
    path.resolve(__dirname, '..', 'public', 'manifest.json'),
    JSON.stringify(manifest, null, 2),
  );
  console.log('✓ Manifest generated');
} catch (e) {
  const error = e instanceof Error ? e.message : String(e);
  console.error('Error generating manifest:', error);
  process.exit(1);
}
