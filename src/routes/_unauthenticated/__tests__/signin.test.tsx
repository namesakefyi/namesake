import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getInitialFlow } from "../signin";

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
});

describe("getInitialFlow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return 'signUp' for first-time visitors", () => {
    localStorageMock.getItem.mockReturnValue(null);

    const result = getInitialFlow();

    expect(result).toBe("signUp");
    expect(localStorageMock.getItem).toHaveBeenCalledWith("hasVisitedBefore");
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "hasVisitedBefore",
      "true",
    );
  });

  it("should return 'signIn' for returning visitors", () => {
    localStorageMock.getItem.mockReturnValue("true");

    const result = getInitialFlow();

    expect(result).toBe("signIn");
    expect(localStorageMock.getItem).toHaveBeenCalledWith("hasVisitedBefore");
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
  });

  it("should return 'signIn' when window is undefined (SSR)", () => {
    // Mock window as undefined to simulate server-side rendering
    const originalWindow = global.window;
    // @ts-expect-error - Intentionally setting window to undefined for SSR test
    global.window = undefined;

    const result = getInitialFlow();

    expect(result).toBe("signIn");
    expect(localStorageMock.getItem).not.toHaveBeenCalled();
    expect(localStorageMock.setItem).not.toHaveBeenCalled();

    // Restore window
    global.window = originalWindow;
  });

  it("should set localStorage flag only on first visit", () => {
    localStorageMock.getItem.mockReturnValue(null);
    const firstResult = getInitialFlow();

    expect(firstResult).toBe("signUp");
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "hasVisitedBefore",
      "true",
    );

    vi.clearAllMocks();

    localStorageMock.getItem.mockReturnValue("true");
    const secondResult = getInitialFlow();

    expect(secondResult).toBe("signIn");
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
  });
});
