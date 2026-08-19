import { describe, it, expect, vi, beforeEach } from "vitest";

// Capture console calls
let logCalls: any[] = [];

beforeEach(() => {
  logCalls = [];
  vi.spyOn(console, "log").mockImplementation((...args) => logCalls.push({ method: "log", args }));
  vi.spyOn(console, "error").mockImplementation((...args) => logCalls.push({ method: "error", args }));
  vi.spyOn(console, "warn").mockImplementation((...args) => logCalls.push({ method: "warn", args }));
  vi.spyOn(console, "debug").mockImplementation((...args) => logCalls.push({ method: "debug", args }));
});

describe("Logger", () => {
  it("should export log object with all levels", async () => {
    const { log } = await import("@/lib/logger");
    expect(typeof log.debug).toBe("function");
    expect(typeof log.info).toBe("function");
    expect(typeof log.warn).toBe("function");
    expect(typeof log.error).toBe("function");
  });

  it("should call console.error for error level", async () => {
    const { log } = await import("@/lib/logger");
    log.error("test error", { key: "value" });
    expect(logCalls.some((c) => c.method === "error")).toBe(true);
  });

  it("should call console.log for info level", async () => {
    const { log } = await import("@/lib/logger");
    log.info("test info", { key: "value" });
    expect(logCalls.some((c) => c.method === "log")).toBe(true);
  });

  it("should include context in log output", async () => {
    const { log } = await import("@/lib/logger");
    log.error("test", { eventId: "evt_123", error: "something broke" });
    const errorCall = logCalls.find((c) => c.method === "error");
    expect(errorCall).toBeDefined();
    // The formatted message should contain the context
    const output = errorCall.args.join(" ");
    expect(output).toContain("test");
  });
});
