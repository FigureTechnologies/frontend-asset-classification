import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
    base: '/frontend-asset-classification',
    build: {
        outDir: 'build',
    },
    plugins: [react(), viteTsconfigPaths(), svgrPlugin(), nodePolyfills({ protocolImports: false })],
});
