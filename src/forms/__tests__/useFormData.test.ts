import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { FormConfig, FormSlug } from "../../constants/forms";
import * as database from "../../db/database";
import { useFormData } from "../useFormData";

vi.mock("../../db/database", () => ({
  getFieldsByNames: vi.fn(),
  saveField: vi.fn(),
  deleteField: vi.fn(),
}));

function makeConfig(fields: string[]): FormConfig {
  return {
    slug: "test" as FormSlug,
    steps: [
      {
        id: "s",
        title: "S",
        fields: fields as any,
        component: () => null,
      },
    ],
    pdfs: [],
    downloadTitle: "Test",
    instructions: [],
  };
}

describe("useFormData", () => {
  beforeEach(() => {
    vi.mocked(database.getFieldsByNames).mockResolvedValue([]);
    vi.mocked(database.saveField).mockResolvedValue(undefined);
    vi.mocked(database.deleteField).mockResolvedValue(undefined);
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  describe("initial state", () => {
    it("starts with isLoading true", async () => {
      const { result } = renderHook(() =>
        useFormData(makeConfig(["oldFirstName"])),
      );

      expect(result.current.isLoading).toBe(true);

      await act(async () => {});
    });

    it("exposes react-hook-form methods alongside custom properties", async () => {
      const { result } = renderHook(() =>
        useFormData(makeConfig(["oldFirstName"])),
      );

      expect(result.current).toHaveProperty("register");
      expect(result.current).toHaveProperty("handleSubmit");
      expect(result.current).toHaveProperty("getValues");
      expect(result.current).toHaveProperty("setValue");
      expect(result.current).toHaveProperty("isLoading");

      await act(async () => {});
    });
  });

  describe("loading saved data", () => {
    it("sets isLoading to false after loading completes", async () => {
      const { result } = renderHook(() =>
        useFormData(makeConfig(["oldFirstName"])),
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it("calls getFieldsByNames with the provided field names", async () => {
      const { result } = renderHook(() =>
        useFormData(makeConfig(["oldFirstName", "oldLastName"])),
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(database.getFieldsByNames).toHaveBeenCalledWith([
        "oldFirstName",
        "oldLastName",
      ]);
    });

    it("populates form values from saved IndexedDB records", async () => {
      vi.mocked(database.getFieldsByNames).mockResolvedValue([
        { field: "oldFirstName", value: "Jane", createdAt: 0, updatedAt: 0 },
        { field: "oldLastName", value: "Doe", createdAt: 0, updatedAt: 0 },
      ]);

      const { result } = renderHook(() =>
        useFormData(makeConfig(["oldFirstName", "oldLastName"])),
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.getValues("oldFirstName")).toBe("Jane");
      expect(result.current.getValues("oldLastName")).toBe("Doe");
    });

    it("sets isLoading to false even when getFieldsByNames throws", async () => {
      vi.mocked(database.getFieldsByNames).mockRejectedValue(
        new Error("DB unavailable"),
      );

      const { result } = renderHook(() =>
        useFormData(makeConfig(["oldFirstName"])),
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe("auto-save on change", () => {
    it("saves a field when its value changes after loading", async () => {
      const { result } = renderHook(() =>
        useFormData(makeConfig(["oldFirstName"])),
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await act(async () => {
        result.current.setValue("oldFirstName", "John");
      });

      await waitFor(() => {
        expect(database.saveField).toHaveBeenCalledWith("oldFirstName", "John");
      });
    });

    it("deletes a field when its value is cleared to an empty string", async () => {
      const { result } = renderHook(() =>
        useFormData(makeConfig(["oldFirstName"])),
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      vi.clearAllMocks();

      await act(async () => {
        result.current.setValue("oldFirstName", "");
      });

      await waitFor(() => {
        expect(database.deleteField).toHaveBeenCalledWith("oldFirstName");
      });
      expect(database.saveField).not.toHaveBeenCalled();
    });

    it("deletes a field when its value is set to null", async () => {
      const { result } = renderHook(() =>
        useFormData(makeConfig(["oldFirstName"])),
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      vi.clearAllMocks();

      await act(async () => {
        result.current.setValue("oldFirstName", null);
      });

      await waitFor(() => {
        expect(database.deleteField).toHaveBeenCalledWith("oldFirstName");
      });
      expect(database.saveField).not.toHaveBeenCalled();
    });

    it("deletes a field when its value is set to an empty array", async () => {
      const { result } = renderHook(() =>
        useFormData(makeConfig(["pronouns"])),
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      vi.clearAllMocks();

      await act(async () => {
        result.current.setValue("pronouns", []);
      });

      await waitFor(() => {
        expect(database.deleteField).toHaveBeenCalledWith("pronouns");
      });
      expect(database.saveField).not.toHaveBeenCalled();
    });

    it("logs an error when deleteField throws during auto-save", async () => {
      vi.mocked(database.deleteField).mockRejectedValue(
        new Error("Delete failed"),
      );

      const { result } = renderHook(() =>
        useFormData(makeConfig(["oldFirstName"])),
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      vi.clearAllMocks();
      vi.spyOn(console, "error").mockImplementation(() => {});

      await act(async () => {
        result.current.setValue("oldFirstName", null);
      });

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith(
          "Error saving field oldFirstName:",
          expect.any(Error),
        );
      });
    });

    it("logs an error when saveField throws during auto-save", async () => {
      vi.mocked(database.saveField).mockRejectedValue(
        new Error("Write failed"),
      );

      const { result } = renderHook(() =>
        useFormData(makeConfig(["oldFirstName"])),
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      vi.clearAllMocks();
      vi.spyOn(console, "error").mockImplementation(() => {});

      await act(async () => {
        result.current.setValue("oldFirstName", "John");
      });

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith(
          "Error saving field oldFirstName:",
          expect.any(Error),
        );
      });
    });

    it("does not save when value is undefined", async () => {
      const { result } = renderHook(() =>
        useFormData(makeConfig(["oldFirstName"])),
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      vi.clearAllMocks();

      await act(async () => {
        result.current.setValue("oldFirstName", undefined);
      });

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(database.saveField).not.toHaveBeenCalled();
    });
  });
});
