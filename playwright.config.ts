import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: "test-results/phase1",
  fullyParallel: true,
  workers: 3,
  reporter: [["list"], ["html", { open: "never" }], ["json", { outputFile: "test-results/phase1-summary.json" }]],
  use: { baseURL: "http://127.0.0.1:4173", trace: "retain-on-failure" },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"], deviceScaleFactor: 1, launchOptions: { ignoreDefaultArgs: ["--hide-scrollbars"] } } },
    { name: "firefox", use: { ...devices["Desktop Firefox"], deviceScaleFactor: 1 } },
    { name: "webkit", use: { ...devices["Desktop Safari"], deviceScaleFactor: 1 } },
  ],
  webServer: {
    command: "node scripts/serve-static.mjs",
    env: { QA_REFERENCE: "1" },
    url: "http://127.0.0.1:4173",
    reuseExistingServer: false,
  },
})
