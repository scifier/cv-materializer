import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const { REACT_APP_DOMAIN } = process.env;

if (!REACT_APP_DOMAIN) {
  console.error('Error: REACT_APP_DOMAIN env var is required');
  process.exit(1);
}

try {
  const buildDir = path.join(__dirname, '..', 'build');
  if (!fs.existsSync(buildDir)) {
    console.warn('Warning: build directory does not exist yet');
    process.exit(0);
  }

  const cnameFile = path.join(buildDir, 'CNAME');
  fs.writeFileSync(cnameFile, `${REACT_APP_DOMAIN}\n`);
  console.log(`✓ CNAME file created: ${cnameFile}`);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error('Error creating CNAME:', message);
  process.exit(1);
}
