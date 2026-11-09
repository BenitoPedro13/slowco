import { defineConfig, devices } from "@playwright/test";

// docs/06-ARCHITECTURE.md §10. Runs against a production build on port 3100.
// PW_REUSE=1 reuses a server you started yourself (`pnpm build && pnpm start --port 3100`, with
// the same env). The WhatsApp number is a fictional test number (US 555-01xx range, reserved
// for fiction): never the store's real one.
export const TEST_WHATSAPP_NUMBER = "15555550100";

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  reporter: "list",
  use: { baseURL: "http://localhost:3100" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "pnpm build && pnpm start --port 3100",
    url: "http://localhost:3100",
    reuseExistingServer: Boolean(process.env.PW_REUSE),
    timeout: 300_000,
    env: { NEXT_PUBLIC_WHATSAPP_NUMBER: TEST_WHATSAPP_NUMBER },
  },
});
