import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
    process.chdir(__dirname);
    await build({
        configFile: false,
        root: __dirname,
        base: './',
        plugins: [react()],
        build: {
            outDir: resolve(__dirname, 'dist'),
            assetsDir: 'assets',
            emptyOutDir: true,
            rollupOptions: {
                input: resolve(__dirname, 'index.html'),
            }
        }
    });
    console.log('Build successful!');
} catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
}
