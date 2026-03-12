import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { appLogger, createScopedLogger } from "./appLogger";

describe("appLogger", () => {
  let consoleSpy: { debug: ReturnType<typeof vi.spyOn>; info: ReturnType<typeof vi.spyOn>; warn: ReturnType<typeof vi.spyOn>; error: ReturnType<typeof vi.spyOn> };

  beforeEach(() => {
    consoleSpy = {
      debug: vi.spyOn(console, "debug").mockImplementation(() => {}),
      info: vi.spyOn(console, "info").mockImplementation(() => {}),
      warn: vi.spyOn(console, "warn").mockImplementation(() => {}),
      error: vi.spyOn(console, "error").mockImplementation(() => {}),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("info logs with context and message", () => {
    appLogger.info("Tasks:AppView", "view mode change", { mode: "app" });
    expect(consoleSpy.info).toHaveBeenCalledTimes(1);
    expect(consoleSpy.info.mock.calls[0][0]).toContain("[Tasks:AppView]");
    expect(consoleSpy.info.mock.calls[0][0]).toContain("view mode change");
    expect(consoleSpy.info.mock.calls[0][0]).toContain("app");
  });

  it("error logs with context and message", () => {
    appLogger.error("Tasks:Screen", "load failed", { err: "Network" });
    expect(consoleSpy.error).toHaveBeenCalledTimes(1);
    expect(consoleSpy.error.mock.calls[0][0]).toContain("[Tasks:Screen]");
    expect(consoleSpy.error.mock.calls[0][0]).toContain("load failed");
  });

  it("scoped logger uses fixed context", () => {
    const log = createScopedLogger("Tasks:AppView");
    log.info("render", { index: 1 });
    expect(consoleSpy.info).toHaveBeenCalledTimes(1);
    expect(consoleSpy.info.mock.calls[0][0]).toContain("[Tasks:AppView]");
    expect(consoleSpy.info.mock.calls[0][0]).toContain("render");
  });
});
