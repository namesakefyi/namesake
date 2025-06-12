import { useTheme } from "@/components/app";
import { THEMES, THEME_COLORS } from "@/constants";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EditThemeSetting } from "./EditThemeSetting";

vi.mock("@/components/app", () => ({
  useTheme: vi.fn(),
}));

describe("EditThemeSetting", () => {
  const mockUpdateTheme = vi.fn();
  const mockUpdateColor = vi.fn();
  const mockThemeSelection = new Set(["light"]);
  const mockColorSelection = new Set(["violet"]);

  beforeEach(() => {
    vi.clearAllMocks();
    (useTheme as ReturnType<typeof vi.fn>).mockReturnValue({
      theme: "light",
      themeSelection: mockThemeSelection,
      setTheme: vi.fn((theme) => {
        mockUpdateTheme({ theme });
      }),
      color: "violet",
      colorSelection: mockColorSelection,
      setColor: vi.fn((color) => {
        mockUpdateColor({ color });
      }),
    });
  });

  it("renders component with correct initial theme and color", () => {
    render(<EditThemeSetting />);

    // Check theme buttons
    for (const theme of Object.values(THEMES)) {
      expect(
        screen.getByRole("radio", { name: theme.label }),
      ).toBeInTheDocument();
    }
    const lightThemeButton = screen.getByRole("radio", {
      name: THEMES.light.label,
    });
    expect(lightThemeButton).toHaveAttribute("aria-checked", "true");

    // Check color buttons
    for (const color of Object.values(THEME_COLORS)) {
      expect(
        screen.getByRole("radio", { name: color.label }),
      ).toBeInTheDocument();
    }
    const violetColorButton = screen.getByRole("radio", {
      name: THEME_COLORS.violet.label,
    });
    expect(violetColorButton).toHaveAttribute("aria-checked", "true");
  });

  it("calls setTheme when a theme is selected", async () => {
    const user = userEvent.setup();
    render(<EditThemeSetting />);
    const darkThemeButton = screen.getByRole("radio", {
      name: THEMES.dark.label,
    });
    await user.click(darkThemeButton);
    expect(mockUpdateTheme).toHaveBeenCalledWith({ theme: "dark" });
  });

  it("calls setColor when a color is selected", async () => {
    const user = userEvent.setup();
    render(<EditThemeSetting />);
    const pinkColorButton = screen.getByRole("radio", {
      name: THEME_COLORS.pink.label,
    });
    await user.click(pinkColorButton);
    expect(mockUpdateColor).toHaveBeenCalledWith({ color: "pink" });
  });
});
