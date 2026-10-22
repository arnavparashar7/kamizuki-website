import * as esbuild from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

async function build() {
  try {
    console.log('[Build] Bundling Thirdweb SDK v5 for browser...');
    await esbuild.build({
      entryPoints: [path.join(rootDir, 'src', 'thirdweb-entry.js')],
      bundle: true,
      format: 'iife',
      outfile: path.join(rootDir, 'js', 'thirdweb-bundle.js'),
      platform: 'browser',
      target: ['es2022'],
      define: {
        'process.env.NODE_ENV': '"production"',
        'global': 'window'
      }
    });
    console.log('[Build] Successfully generated js/thirdweb-bundle.js');
  } catch (err) {
    console.error('[Build] Failed to bundle Thirdweb SDK:', err);
    process.exit(1);
  }
}

build();
