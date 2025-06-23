import { act, render, screen } from "@testing-library/react";
import { useMutation } from "convex/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { THEME_COLORS, THEMES, type ThemeColor } from "@/constants";
import { ThemeProvider, useTheme } from "./ThemeProvider";

const mockMatchMedia = vi.fn().mockImplementation((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(), // Deprecated but still used in the component
  removeListener: vi.fn(), // Deprecated but still used in the component
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: mockMatchMedia,
});

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

const TestComponent = () => {
  const { theme, setTheme, color, setColor } = useTheme();
  return (
    <div>
      <div data-testid="current-theme">{theme}</div>
      <div data-testid="current-color">{color}</div>
      <div>
        {Object.entries(THEMES).map(([theme, { label }]) => (
          <button
            key={theme}
            type="button"
            onClick={() => setTheme(theme as "system" | "light" | "dark")}
            data-testid={`theme-${theme}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div>
        {Object.entries(THEME_COLORS).map(([color, { label }]) => (
          <button
            key={color}
            type="button"
            onClick={() => setColor(color as ThemeColor)}
            data-testid={`color-${color}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

describe("ThemeProvider", () => {
  const mockSetTheme = vi.fn();
  const mockSetColor = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();

    (useMutation as unknown as ReturnType<typeof vi.fn>)
      .mockReturnValueOnce(mockSetTheme)
      .mockReturnValueOnce(mockSetColor);
  });

  it("renders children with default theme and color", () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("current-theme")).toHaveTextContent("system");
    expect(screen.getByTestId("current-color")).toHaveTextContent("rainbow");
  });

  it("changes theme when setTheme is called", () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    act(() => {
      screen.getByText("Dark").click();
    });

    expect(screen.getByTestId("current-theme")).toHaveTextContent("dark");
    expect(localStorage.setItem).toHaveBeenCalledWith("theme", "dark");
  });

  it("changes color when setColor is called", () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    act(() => {
      screen.getByText("Rainbow").click();
    });

    expect(screen.getByTestId("current-color")).toHaveTextContent("rainbow");
    expect(localStorage.setItem).toHaveBeenCalledWith("color", "rainbow");
  });

  it("loads theme from localStorage on mount", () => {
    localStorage.setItem("theme", "light");
    localStorage.setItem("color", "blue");

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("current-theme")).toHaveTextContent("light");
    expect(screen.getByTestId("current-color")).toHaveTextContent("blue");
  });

  it("applies theme and color to document element", () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    act(() => {
      screen.getByText("Dark").click();
    });
    act(() => {
      screen.getByText("Turquoise").click();
    });

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(document.documentElement.getAttribute("data-color")).toBe(
      "turquoise",
    );
  });

  it("handles system theme changes", () => {
    mockMatchMedia.mockImplementation((query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    act(() => {
      screen.getByText("System").click();
    });

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("updates both theme and color in Convex database", () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    act(() => {
      screen.getByText("Dark").click();
      screen.getByText("Turquoise").click();
    });

    expect(mockSetTheme).toHaveBeenCalledWith({ theme: "dark" });
    expect(mockSetColor).toHaveBeenCalledWith({ color: "turquoise" });
  });
});
