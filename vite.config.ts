import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: "build",
  },
  plugins: [
    react(),
    tailwindcss(),
    svgr({
      include: "**/*.svg?react"
    })
  ],
  define: {
    "process.env.VITE_API_URL": JSON.stringify(process.env.VITE_API_URL),
  },
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      'src': './src',
      'api': path.resolve(__dirname, './src/api'),
      'app': path.resolve(__dirname, './src/app'),
      'assets': path.resolve(__dirname, './src/assets'),
      'branding': path.resolve(__dirname, './src/branding'),
      'components': path.resolve(__dirname, './src/components'),
      'constants': path.resolve(__dirname, './src/constants'),
      'hooks': path.resolve(__dirname, './src/hooks'),
      'modules': path.resolve(__dirname, './src/modules'),
      'routes': path.resolve(__dirname, './src/routes'),
      'services': path.resolve(__dirname, './src/services'),
      'stores': path.resolve(__dirname, './src/stores'),
      'types': path.resolve(__dirname, './src/types'),
      'utils': path.resolve(__dirname, './src/utils'),
    }
  }
});
