import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        outDir: 'dist',
        lib: {
            entry: 'src/index.ts',
            fileName: 'index',
            formats: ['es'],
        },
    },
    plugins: [dts({ rollupTypes: true })],
});