import { useTheme } from "@/utils/useTheme";
import { THEMES } from "@convex/constants";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EditThemeSetting } from "./EditThemeSetting";

describe("EditThemeSetting", () => {
  const mockUpdateTheme = vi.fn();
  const mockSetNextTheme = vi.fn();
  const mockThemeSelection = new Set(["light"]);

  beforeEach(() => {
    vi.clearAllMocks();
    (useTheme as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      theme: "light",
      themeSelection: mockThemeSelection,
      setTheme: vi.fn((theme) => {
        const selectedTheme = [...theme][0];
        mockUpdateTheme({ theme: selectedTheme });
        mockSetNextTheme(selectedTheme);
      }),
    });
  });

  it("renders component correctly with correct initial theme", () => {
    render(<EditThemeSetting />);
    expect(screen.getByText("Theme")).toBeInTheDocument();
    expect(screen.getByText("Adjust your display.")).toBeInTheDocument();
    for (const theme of Object.values(THEMES)) {
      expect(screen.getByText(theme.label)).toBeInTheDocument();
    }
    const lightThemeButton = screen.getByRole("radio", {
      name: THEMES.light.label,
    });
    expect(lightThemeButton).toHaveAttribute("aria-checked", "true");
  });

  it("calls setTheme when a theme is selected", async () => {
    const user = userEvent.setup();
    render(<EditThemeSetting />);
    const darkThemeButton = screen.getByRole("radio", {
      name: THEMES.dark.label,
    });
    await user.click(darkThemeButton);
    expect(mockUpdateTheme).toHaveBeenCalledWith({ theme: "dark" });
    expect(mockSetNextTheme).toHaveBeenCalledWith("dark");
  });
});
