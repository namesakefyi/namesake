import { beforeEach, describe, expect, it, vi } from "vitest";
import { getFormStatus } from "../getFormStatus";

vi.mock("../../db/database", () => ({
  getFormProgress: vi.fn(),
}));

import { getFormProgress } from "../../db/database";

describe("getFormStatus", () => {
  beforeEach(() => {
    vi.mocked(getFormProgress).mockReset();
  });

  it("returns null when no progress exists", async () => {
    vi.mocked(getFormProgress).mockResolvedValue(undefined);
    expect(await getFormStatus("some-form")).toBe(null);
  });

  it("returns null when snapshot is null", async () => {
    vi.mocked(getFormProgress).mockResolvedValue(null);
    expect(await getFormStatus("some-form")).toBe(null);
  });

  it("returns null when snapshot is not an object", async () => {
    vi.mocked(getFormProgress).mockResolvedValue("string" as never);
    expect(await getFormStatus("some-form")).toBe(null);

    vi.mocked(getFormProgress).mockResolvedValue(42 as never);
    expect(await getFormStatus("some-form")).toBe(null);
  });

  it("returns null for title phase (not started)", async () => {
    vi.mocked(getFormProgress).mockResolvedValue({ value: "title" });
    expect(await getFormStatus("some-form")).toBe(null);
  });

  it("returns 'inProgress' for filling phase", async () => {
    vi.mocked(getFormProgress).mockResolvedValue({ value: "filling" });
    expect(await getFormStatus("some-form")).toBe("inProgress");
  });

  it("returns 'inProgress' for review phase", async () => {
    vi.mocked(getFormProgress).mockResolvedValue({ value: "review" });
    expect(await getFormStatus("some-form")).toBe("inProgress");
  });

  it("returns 'inProgress' for editing phase", async () => {
    vi.mocked(getFormProgress).mockResolvedValue({ value: "editing" });
    expect(await getFormStatus("some-form")).toBe("inProgress");
  });

  it("returns 'inProgress' for submitting phase", async () => {
    vi.mocked(getFormProgress).mockResolvedValue({ value: "submitting" });
    expect(await getFormStatus("some-form")).toBe("inProgress");
  });

  it("returns 'complete' for complete phase", async () => {
    vi.mocked(getFormProgress).mockResolvedValue({ value: "complete" });
    expect(await getFormStatus("some-form")).toBe("complete");
  });

  it("handles compound state values (object)", async () => {
    vi.mocked(getFormProgress).mockResolvedValue({
      value: { filling: "legal-name" },
    });
    expect(await getFormStatus("some-form")).toBe("inProgress");
  });

  it("returns null for unknown phase", async () => {
    vi.mocked(getFormProgress).mockResolvedValue({ value: "unknown" });
    expect(await getFormStatus("some-form")).toBe(null);
  });

  it("passes form slug to getFormProgress", async () => {
    vi.mocked(getFormProgress).mockResolvedValue({ value: "complete" });
    await getFormStatus("court-order-ma");
    expect(getFormProgress).toHaveBeenCalledWith("court-order-ma");
  });
});
