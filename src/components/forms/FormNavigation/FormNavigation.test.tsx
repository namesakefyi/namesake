import { FormNavigation, FormSection } from "@/components/forms";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock react-hook-form
vi.mock("react-hook-form", () => ({
  useForm: vi.fn(),
  useFormContext: vi.fn(() => ({
    watch: vi.fn((callback) => {
      callback?.();
      return { unsubscribe: vi.fn() };
    }),
    getValues: vi.fn(() => ({
      field1: "",
      field2: "",
    })),
  })),
  FormProvider: ({ children }: { children: React.ReactNode }) => children,
}));

const mockSections = [
  { hash: "first-question", title: "First Question" },
  { hash: "second-question", title: "Second Question" },
  { hash: "third-question", title: "Third Question" },
];

// Mock useFormSections
vi.mock("@/utils/useFormSections", () => ({
  useFormSections: vi.fn(() => ({
    sections: mockSections,
  })),
}));

describe("FormNavigation", () => {
  beforeEach(() => {
    // Mock the DOM structure that FormNavigation expects
    for (const section of mockSections) {
      render(<FormSection title={section.title} />);
    }

    // Mock IntersectionObserver
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      disconnect: () => null,
    });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders navigation elements", () => {
    render(<FormNavigation title="Test Form" />);

    expect(screen.getByText("Test Form")).toBeInTheDocument();
    expect(screen.getByLabelText("Back")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "All questions" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("progressbar", { name: "Progress" }),
    ).toBeInTheDocument();
  });

  it("renders all questions in menu popover", async () => {
    const user = userEvent.setup();
    render(<FormNavigation title="Test Form" />);

    await user.click(screen.getByRole("button", { name: "All questions" }));

    const menu = await screen.findByRole("menu");
    expect(menu).toBeInTheDocument();

    for (const section of mockSections) {
      expect(
        screen.getByRole("menuitem", { name: section.title }),
      ).toBeInTheDocument();
    }
  });
});
