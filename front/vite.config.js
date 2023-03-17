import { defineConfig } from 'vite';
import { resolve } from 'path';
import autoPrefixer from 'autoprefixer';

const root = resolve(__dirname, 'src');
const outDir = resolve(__dirname, 'dist');

export default defineConfig({
    base: "/",
    root: root,
    publicDir: "../public",
    build: {
        emptyOutDir: true,
        outDir: outDir,
        rollupOptions: {
            input: {
                main: resolve(root, 'index.html'),
            },
        },
    },
    worker: {
        format: 'es',
    }
});