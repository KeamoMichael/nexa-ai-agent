import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
    await build({
        configFile: false,
        plugins: [react()],
        base: './',
        root: __dirname,
        resolve: {
            dedupe: ['react', 'react-dom'],
        },
        build: {
            outDir: resolve(__dirname, 'dist'),
            assetsDir: 'assets',
            emptyOutDir: true,
            commonjsOptions: {
                include: [/node_modules/],
            },
        }
    });
    console.log('Build successful!');
} catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
}
