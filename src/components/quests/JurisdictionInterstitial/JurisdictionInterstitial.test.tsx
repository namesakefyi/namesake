import { BIRTHPLACES, JURISDICTIONS } from "@convex/constants";
import { useNavigate } from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { JurisdictionInterstitial } from "./JurisdictionInterstitial";

describe("JurisdictionInterstitial", () => {
  const mockNavigate = vi.fn();
  const mockSetResidence = vi.fn();
  const mockSetBirthplace = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useNavigate as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockNavigate,
    );
    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockSetResidence,
    );
    (useQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      _id: "quest123",
      slug: "test-quest",
    });
  });

  it("renders court order form correctly", () => {
    render(<JurisdictionInterstitial type="courtOrder" />);

    expect(screen.getByText("Where do you live?")).toBeInTheDocument();
    expect(screen.getByText("Please select your state.")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Continue" }),
    ).toBeInTheDocument();
  });

  it("renders birth certificate form correctly", () => {
    render(<JurisdictionInterstitial type="birthCertificate" />);

    expect(screen.getByText("Where were you born?")).toBeInTheDocument();
    expect(
      screen.getByText("Please select your birthplace."),
    ).toBeInTheDocument();
  });

  it("shows error when submitting without selection", async () => {
    const user = userEvent.setup();
    render(<JurisdictionInterstitial type="stateId" />);

    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(screen.getByText("Please select a state.")).toBeInTheDocument();
  });

  it("updates residence and navigates on successful submission", async () => {
    const user = userEvent.setup();
    render(<JurisdictionInterstitial type="courtOrder" />);

    await user.click(screen.getByRole("listbox", { name: "Select a state" }));
    await user.click(screen.getByText(JURISDICTIONS.CA));
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(mockSetResidence).toHaveBeenCalledWith({ residence: "CA" });
    expect(mockNavigate).toHaveBeenCalledWith({
      to: "/quests/$questSlug",
      params: { questSlug: "test-quest" },
    });
  });

  it("updates birthplace for birth certificate form", async () => {
    const user = userEvent.setup();
    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockSetBirthplace,
    );

    render(<JurisdictionInterstitial type="birthCertificate" />);

    await user.click(screen.getByRole("listbox", { name: "Select a state" }));
    await user.click(screen.getByText(BIRTHPLACES.CA));
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(mockSetBirthplace).toHaveBeenCalledWith({ birthplace: "CA" });
  });

  it("updates birthplace and shows info toast when quest not found", async () => {
    const user = userEvent.setup();
    (useQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      undefined,
    );
    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockSetBirthplace,
    );

    render(<JurisdictionInterstitial type="birthCertificate" />);

    await user.click(screen.getByRole("listbox", { name: "Select a state" }));
    await user.click(screen.getByText(BIRTHPLACES.other));
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(mockSetBirthplace).toHaveBeenCalledWith({ birthplace: "other" });
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/" });
    expect(toast.info).toHaveBeenCalledWith(
      "Namesake can only assist with birth certificates for US states.",
    );
  });

  it("handles submission error", async () => {
    const user = userEvent.setup();
    mockSetResidence.mockRejectedValueOnce(new Error("Update failed"));

    render(<JurisdictionInterstitial type="stateId" />);

    await user.click(screen.getByRole("listbox"));
    await user.click(screen.getByRole("option", { name: "California" }));
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(
      screen.getByText("Failed to update. Please try again."),
    ).toBeInTheDocument();
  });

  it("shows appropriate toast when state not supported", async () => {
    const user = userEvent.setup();
    (useQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      undefined,
    );

    render(<JurisdictionInterstitial type="stateId" />);

    await user.click(screen.getByRole("listbox"));
    await user.click(screen.getByRole("option", { name: "California" }));
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(toast.info).toHaveBeenCalledWith(
      "Namesake doesn't support that state yet. Please check back soon.",
    );
  });
});
