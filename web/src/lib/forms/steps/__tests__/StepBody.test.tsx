import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useFormContext } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";
import { renderWithFormProvider } from "#components/forms/test-utils";
import type { BodyStep } from "../../types";
import { block, field } from "../builders";
import { isTrue } from "../conditions";
import { renderers } from "../renderers";
import { StepBody } from "../StepBody";

/** A fallback that registers a field it doesn't declare. */
function UndeclaredWriter() {
  useFormContext().register("email");
  return null;
}

describe("StepBody", () => {
  it("renders each node and leaves hidden ones unmounted", async () => {
    const step: BodyStep = {
      id: "previous-name",
      title: "Have you changed your name before?",
      body: [
        field.yesNo("hasPreviousNameChange"),
        block.subsection(
          [field.shortText("previousNameFrom", { label: "Previous name" })],
          { title: "Details", when: isTrue("hasPreviousNameChange") },
        ),
        block.banner("Read the [guide](https://example.com/guide).", {
          when: isTrue("hasPreviousNameChange"),
        }),
      ],
    };
    renderWithFormProvider(<StepBody step={step} />);

    expect(
      screen.getByRole("radiogroup", {
        name: "Have you changed your name before?",
      }),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText("Previous name")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("radio", { name: "Yes" }));

    expect(screen.getByLabelText("Previous name")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Details" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "guide" })).toHaveAttribute(
      "href",
      "https://example.com/guide",
    );
  });

  it("escapes answers interpolated into banner content", () => {
    const step: BodyStep = {
      id: "banner",
      title: "Banner",
      body: [block.banner((data) => `Hello, ${data.newFirstName}`)],
    };
    renderWithFormProvider(<StepBody step={step} />, {
      defaultValues: { newFirstName: "<b>Sylvia</b>" },
    });
    expect(screen.getByText("Hello, <b>Sylvia</b>")).toBeInTheDocument();
  });

  it("passes computed props to render overrides", () => {
    const render = vi.fn(({ label, field: bound }) => (
      <span>{`${label}: ${bound?.value}`}</span>
    ));
    const step: BodyStep = {
      id: "override",
      title: "Override",
      body: [field.shortText("occupation", { label: "Job", render })],
    };
    renderWithFormProvider(<StepBody step={step} />, {
      defaultValues: { occupation: "Baker" },
    });
    expect(screen.getByText("Job: Baker")).toBeInTheDocument();
  });

  it("warns in development when a fallback writes an undeclared field", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const step: BodyStep = {
      id: "custom",
      title: "Custom",
      body: [
        block.custom({ writes: ["phoneNumber"], render: UndeclaredWriter }),
      ],
    };
    renderWithFormProvider(<StepBody step={step} />);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('registers "email", which is not in its writes'),
    );
  });

  it("names every renderer after its builder", () => {
    for (const [kind, renderer] of Object.entries(renderers)) {
      expect(renderer.displayName).toBe(kind);
    }
  });
});
