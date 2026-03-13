import { promises as fs } from 'fs';
import path from 'path';

const ICON_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg']);

const run = async () => {
  const iconDir = path.resolve(process.cwd(), 'public', 'icon');
  const manifestPath = path.resolve(iconDir, 'index.json');

  const entries = await fs.readdir(iconDir, { withFileTypes: true });
  const iconNames = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => name !== 'index.json')
    .filter((name) => ICON_EXTENSIONS.has(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  await fs.writeFile(manifestPath, `${JSON.stringify(iconNames, null, 2)}\n`, 'utf8');
  console.log(`Generated icon manifest: ${manifestPath} (${iconNames.length} items)`);
};

run().catch((error) => {
  console.error('Failed to generate icon manifest.', error);
  process.exit(1);
});
