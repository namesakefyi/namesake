import { describe, expect, it } from "vitest";
import { q } from "#lib/forms/questions";

describe("node builders", () => {
  it("lists the fields composite nodes write", () => {
    expect(q.name("oldName").writes.map((entry) => entry.id)).toEqual([
      "oldFirstName",
      "oldMiddleName",
      "oldLastName",
    ]);
    expect(
      q.address("residence", { county: true }).writes.map((entry) => entry.id),
    ).toEqual([
      "residenceStreetAddress",
      "residenceCity",
      "residenceCounty",
      "residenceState",
      "residenceZipCode",
    ]);
    expect(q.address("parent1").writes.map((entry) => entry.id)).toEqual([
      "parent1StreetAddress",
      "parent1City",
      "parent1State",
      "parent1ZipCode",
    ]);
  });

  it("rejects address parts the address type lacks", () => {
    // @ts-expect-error parent addresses have no county
    q.address("parent1", { county: true });
  });

  it("gives shared state and country fields their options", () => {
    expect(q.comboBox("birthplaceState", {}).props.options).not.toEqual([]);
    expect(() => q.comboBox("petKind", {})).toThrow("needs options");
  });
});
