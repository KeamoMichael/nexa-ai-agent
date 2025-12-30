import { build } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

const __dirname = resolve('.')

try {
    await build({
        configFile: false,
        root: __dirname,
        plugins: [react()],
        build: {
            outDir: 'dist_test',
            rollupOptions: {
                input: resolve(__dirname, 'test.html'),
            }
        }
    })
    console.log('Test build successful!')
} catch (err) {
    console.error('Test build failed:', err)
}
