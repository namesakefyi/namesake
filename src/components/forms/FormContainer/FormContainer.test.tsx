import { FormContainer } from "@/components/forms";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("FormContainer", () => {
  it("renders children content", () => {
    render(
      <FormContainer>
        <div>Test Content</div>
      </FormContainer>,
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("renders back button", async () => {
    render(<FormContainer />);

    const backButton = screen.getByLabelText("Save and exit");
    expect(backButton).toBeInTheDocument();
  });

  it("renders form navigation component", () => {
    render(<FormContainer />);

    // Check for navigation controls that FormNavigation renders
    expect(screen.getByLabelText("Previous question")).toBeInTheDocument();
    expect(screen.getByLabelText("Next question")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "All questions" }),
    ).toBeInTheDocument();
  });
});
