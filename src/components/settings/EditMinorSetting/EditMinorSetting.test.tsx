import type { Doc, Id } from "@convex/_generated/dataModel";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useMutation } from "convex/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EditMinorSetting } from "./EditMinorSetting";

describe("EditMinorSetting", () => {
  const mockUser: Doc<"users"> = {
    _id: "user123" as Id<"users">,
    isMinor: false,
    _creationTime: 123,
    role: "user",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly with initial state", () => {
    render(<EditMinorSetting user={mockUser} />);

    expect(screen.getByText("Under 18")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Are you under 18 years old or applying on behalf of someone who is?",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("switch", { name: "Is minor" })).not.toBeChecked();
  });

  it("toggles the switch and calls updateIsMinor mutation", async () => {
    const user = userEvent.setup();
    const updateIsMinorMock = vi.fn();
    (useMutation as ReturnType<typeof vi.fn>).mockReturnValue(
      updateIsMinorMock,
    );

    render(<EditMinorSetting user={mockUser} />);

    const freeSwitch = screen.getByRole("switch", { name: "Is minor" });
    await user.click(freeSwitch);

    expect(updateIsMinorMock).toHaveBeenCalledWith({ isMinor: true });
  });
});
