import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useHasVisited } from "../useHasVisited";

describe("useHasVisited", () => {
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock localStorage
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
    });
  });

  it("should return false and set localStorage item when user has not visited before", () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useHasVisited());

    expect(result.current).toBe(false);
    expect(localStorageMock.getItem).toHaveBeenCalledWith("hasVisitedBefore");
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "hasVisitedBefore",
      "true",
    );
  });

  it("should return true when user has visited before", () => {
    localStorageMock.getItem.mockReturnValue("true");

    const { result } = renderHook(() => useHasVisited());

    expect(result.current).toBe(true);
    expect(localStorageMock.getItem).toHaveBeenCalledWith("hasVisitedBefore");
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
  });

  it("should return true when localStorage contains any value", () => {
    localStorageMock.getItem.mockReturnValue("some-value");

    const { result } = renderHook(() => useHasVisited());

    expect(result.current).toBe(true);
    expect(localStorageMock.getItem).toHaveBeenCalledWith("hasVisitedBefore");
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
  });

  it("should handle empty string from localStorage", () => {
    localStorageMock.getItem.mockReturnValue("");

    const { result } = renderHook(() => useHasVisited());

    expect(result.current).toBe(false);
    expect(localStorageMock.getItem).toHaveBeenCalledWith("hasVisitedBefore");
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "hasVisitedBefore",
      "true",
    );
  });

  it("should only call localStorage methods once per hook call", () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useHasVisited());

    expect(result.current).toBe(false);
    expect(localStorageMock.getItem).toHaveBeenCalledTimes(1);
    expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
  });

  it("should use the correct localStorage key", () => {
    localStorageMock.getItem.mockReturnValue(null);

    renderHook(() => useHasVisited());

    expect(localStorageMock.getItem).toHaveBeenCalledWith("hasVisitedBefore");
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "hasVisitedBefore",
      "true",
    );
  });

  it("should return false on first call and true on subsequent calls", () => {
    // First call - no previous visit
    localStorageMock.getItem.mockReturnValue(null);
    const { result: firstResult } = renderHook(() => useHasVisited());
    expect(firstResult.current).toBe(false);

    // Second call - now localStorage has been set
    localStorageMock.getItem.mockReturnValue("true");
    const { result: secondResult } = renderHook(() => useHasVisited());
    expect(secondResult.current).toBe(true);
  });
});
