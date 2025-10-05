// D:\Projects\Ease Chequ\Tests\notifications.test.ts
// Vitest unit test for notification service: DB logging + Telegram/email delivery.
// - Mocks 'pg' and 'node-fetch' before importing the service
// - Ensures environment variables exist
// - Uses relative path ../../server/services/notifications (from Tests to server)

import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock 'pg' Pool with spy-able query
class MockPool {
    public query = vi.fn(async (_sql: string, _params: any[]) => ({ rowCount: 1 }));
}
const mockPoolInstance = new MockPool();

vi.mock("pg", () => {
    return { Pool: vi.fn(() => mockPoolInstance) };
});

// Mock 'node-fetch' (default export)
vi.mock("node-fetch", () => {
    return {
        default: vi.fn(async () => ({
            ok: true,
            status: 200,
            statusText: "OK",
            json: async () => ({ ok: true }),
        })),
    };
});

// Ensure environment variables
process.env.TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "TEST_TELEGRAM_BOT_TOKEN";
process.env.DATABASE_URL = process.env.DATABASE_URL || "postgres://postgres:password@localhost:5432/easechequ";

// Import after mocks
import { logEvent } from "../../server/services/notifications";
import type { NotificationResult } from "../../server/services/notifications";

const getFetchMock = () => (require("node-fetch").default as ReturnType<typeof vi.fn>);

describe("Notifications service", () => {
    beforeEach(() => {
        mockPoolInstance.query.mockClear();
        getFetchMock().mockClear();
    });

    it("logs system event and transport results (email, telegram) to DB", async () => {
        const results: NotificationResult[] = await logEvent("test", "Unit test notification", { scope: "all" });

        expect(results).toBeDefined();
        expect(results.length).toBe(2);
        const transports = results.map((r) => r.transport).sort();
        expect(transports).toEqual(["email", "telegram"].sort());
        results.forEach((r) => expect(r.success).toBe(true));

        // Expect at least 3 DB inserts: 1 system + 2 transports
        expect(mockPoolInstance.query).toHaveBeenCalled();
        expect(mockPoolInstance.query.mock.calls.length).toBeGreaterThanOrEqual(3);

        // First insert should be the system event
        const firstCall = mockPoolInstance.query.mock.calls[0];
        const params = firstCall?.[1];
        expect(params?.[3]).toBe("system");
    });

    it("handles Telegram API failure and logs error to DB", async () => {
        // Make Telegram fail
        const fetchMock = getFetchMock();
        fetchMock.mockImplementationOnce(async () => ({
            ok: false,
            status: 500,
            statusText: "Internal Server Error",
            json: async () => ({ ok: false }),
        }));

        const results: NotificationResult[] = await logEvent("test", "Telegram failure case", { scope: "admin" });

        const map = Object.fromEntries(results.map((r) => [r.transport, r]));
        expect(map.email.success).toBe(true);
        expect(map.telegram.success).toBe(false);
        expect(typeof map.telegram.error).toBe("string");

        // Should still log both transports
        expect(mockPoolInstance.query.mock.calls.length).toBeGreaterThanOrEqual(3);
        const transportCalls = mockPoolInstance.query.mock.calls.slice(1);
        const hasTelegramFail = transportCalls.some((args) => args?.[1]?.[3] === "telegram" && args?.[1]?.[4] === false);
        expect(hasTelegramFail).toBe(true);
    });
});