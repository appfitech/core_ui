import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: 'https://appfitech.com/v1/app/v3/api-docs/fitech-api',
  output: {
    path: 'types/api',
    indexFile: false,
  },
  exportCore: false,
  plugins: ['@hey-api/typescript'],
});
