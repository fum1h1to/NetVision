import { defineConfig } from 'vite';
import { resolve } from 'path';

const root = resolve(__dirname, 'src');
const outDir = resolve(__dirname, 'dist');

export default defineConfig({
    root: root,
    build: {
        emptyOutDir: true,
        outDir: outDir,
        rollupOptions: {
            input: {
                main: resolve(root, 'index.html'),
            },
        },
    }
});