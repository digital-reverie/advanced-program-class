import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser',
  use: {baseURL:process.env.TEST_BASE_URL || 'http://127.0.0.1:4173', browserName:'chromium', channel:process.env.PLAYWRIGHT_CHANNEL || undefined},
  webServer: process.env.TEST_BASE_URL ? undefined : {command:'node build',url:'http://127.0.0.1:4173/health',env:{PORT:'4173',HOST:'127.0.0.1'},reuseExistingServer:false},
  reporter:'list'
});
