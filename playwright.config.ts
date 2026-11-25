import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: "test-results/revision-2026-11-20",
  fullyParallel: true,
  workers: 3,
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-report/revision-2026-11-20" }],
    ["json", { outputFile: "test-results/revision-2026-11-20-summary.json" }],
  ],
  use: { baseURL: "http://127.0.0.1:4174", trace: "retain-on-failure" },
  projects: [
    {
      name: "chromium",
      testIgnore: "**/touch.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        deviceScaleFactor: 1,
        launchOptions: { ignoreDefaultArgs: ["--hide-scrollbars"] },
      },
    },
    { name: "firefox", testIgnore: "**/touch.spec.ts", use: { ...devices["Desktop Firefox"], deviceScaleFactor: 1 } },
    { name: "webkit", testIgnore: "**/touch.spec.ts", use: { ...devices["Desktop Safari"], deviceScaleFactor: 1 } },
    {
      name: "touch-chromium",
      testMatch: "**/touch.spec.ts",
      use: { ...devices["Pixel 7"], browserName: "chromium", reducedMotion: "reduce" },
    },
  ],
  webServer: {
    command: "node scripts/serve-static.mjs",
    env: { QA_REFERENCE: "1", PORT: "4174" },
    url: "http://127.0.0.1:4174",
    reuseExistingServer: false,
  },
})
