import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "fake-indexeddb/auto";
import { IDBFactory } from "fake-indexeddb";
import {
  clearAllFields,
  clearFormProgress,
  deleteField,
  getAllFields,
  getField,
  getFieldsByNames,
  getFormProgress,
  saveField,
  saveFormProgress,
} from "../database";

describe("IndexedDB Database Operations", () => {
  beforeEach(() => {
    // Reset IndexedDB before each test
    global.indexedDB = new IDBFactory();
  });

  afterEach(async () => {
    // Clean up after each test
    await clearAllFields();
  });

  describe("DB upgrade", () => {
    it("creates both object stores on a fresh install (v0 → v2)", async () => {
      vi.resetModules();
      global.indexedDB = new IDBFactory();

      const { getDB } = await import("../init");
      const db = await getDB();

      expect(db.objectStoreNames.contains("formData")).toBe(true);
      expect(db.objectStoreNames.contains("formProgress")).toBe(true);
    });
  });

  describe("saveField", () => {
    it("should save a string field value", async () => {
      await saveField("firstName", "Alice");
      const value = await getField("firstName");
      expect(value).toBe("Alice");
    });

    it("should save a boolean field value", async () => {
      await saveField("isChecked", true);
      const value = await getField("isChecked");
      expect(value).toBe(true);
    });

    it("should save an array field value", async () => {
      await saveField("pronouns", ["they/them", "she/her"]);
      const value = await getField("pronouns");
      expect(value).toEqual(["they/them", "she/her"]);
    });

    it("should update existing field value", async () => {
      await saveField("firstName", "Alice");
      await saveField("firstName", "Bob");
      const value = await getField("firstName");
      expect(value).toBe("Bob");
    });

    it("should set createdAt timestamp on first save", async () => {
      const beforeSave = Date.now();
      await saveField("firstName", "Alice");
      const afterSave = Date.now();

      const records = await getFieldsByNames(["firstName"]);
      expect(records[0].createdAt).toBeGreaterThanOrEqual(beforeSave);
      expect(records[0].createdAt).toBeLessThanOrEqual(afterSave);
    });

    it("should preserve createdAt when updating existing field", async () => {
      await saveField("firstName", "Alice");
      const records1 = await getFieldsByNames(["firstName"]);
      const originalCreatedAt = records1[0].createdAt;

      // Wait a bit to ensure timestamps would be different
      await new Promise((resolve) => setTimeout(resolve, 10));

      await saveField("firstName", "Bob");
      const records2 = await getFieldsByNames(["firstName"]);

      expect(records2[0].createdAt).toBe(originalCreatedAt);
      expect(records2[0].updatedAt).toBeGreaterThan(originalCreatedAt);
    });
  });

  describe("getField", () => {
    it("should return undefined for non-existent field", async () => {
      const value = await getField("nonExistent");
      expect(value).toBeUndefined();
    });

    it("should retrieve saved field value", async () => {
      await saveField("email", "test@example.com");
      const value = await getField("email");
      expect(value).toBe("test@example.com");
    });
  });

  describe("getFieldsByNames", () => {
    it("should return empty array when no fields exist", async () => {
      const records = await getFieldsByNames(["field1", "field2"]);
      expect(records).toEqual([]);
    });

    it("should return only existing fields", async () => {
      await saveField("field1", "value1");
      await saveField("field3", "value3");

      const records = await getFieldsByNames(["field1", "field2", "field3"]);
      expect(records).toHaveLength(2);
      expect(records.map((r) => r.field)).toEqual(["field1", "field3"]);
      expect(records.map((r) => r.value)).toEqual(["value1", "value3"]);
    });

    it("should include createdAt and updatedAt timestamps", async () => {
      const beforeSave = Date.now();
      await saveField("field1", "value1");
      const afterSave = Date.now();

      const records = await getFieldsByNames(["field1"]);
      expect(records[0].createdAt).toBeGreaterThanOrEqual(beforeSave);
      expect(records[0].createdAt).toBeLessThanOrEqual(afterSave);
      expect(records[0].updatedAt).toBeGreaterThanOrEqual(beforeSave);
      expect(records[0].updatedAt).toBeLessThanOrEqual(afterSave);
      // On first save, createdAt and updatedAt should be the same
      expect(records[0].createdAt).toBe(records[0].updatedAt);
    });
  });

  describe("deleteField", () => {
    it("should delete an existing field", async () => {
      await saveField("toDelete", "value");
      await deleteField("toDelete");
      const value = await getField("toDelete");
      expect(value).toBeUndefined();
    });

    it("should not throw error when deleting non-existent field", async () => {
      await expect(deleteField("nonExistent")).resolves.not.toThrow();
    });
  });

  describe("clearAllFields", () => {
    it("should clear all fields", async () => {
      await saveField("field1", "value1");
      await saveField("field2", "value2");
      await saveField("field3", "value3");

      await clearAllFields();

      const allFields = await getAllFields();
      expect(allFields).toEqual([]);
    });

    it("should not throw error when clearing empty database", async () => {
      await expect(clearAllFields()).resolves.not.toThrow();
    });
  });

  describe("getAllFields", () => {
    it("should return empty array when no fields exist", async () => {
      const fields = await getAllFields();
      expect(fields).toEqual([]);
    });

    it("should return all saved fields", async () => {
      await saveField("firstName", "Alice");
      await saveField("lastName", "Smith");
      await saveField("email", "alice@example.com");

      const fields = await getAllFields();
      expect(fields).toHaveLength(3);
      expect(fields.map((f) => f.field).sort()).toEqual([
        "email",
        "firstName",
        "lastName",
      ]);
    });
  });

  describe("Error handling", () => {
    it("should handle concurrent writes to the same field", async () => {
      const promises = [
        saveField("concurrent", "value1"),
        saveField("concurrent", "value2"),
        saveField("concurrent", "value3"),
      ];

      await Promise.all(promises);

      // Should have one of the values (last write wins)
      const value = await getField("concurrent");
      expect(["value1", "value2", "value3"]).toContain(value);
    });
  });

  describe("saveFormProgress", () => {
    it("should save and retrieve machine state", async () => {
      const machineState = {
        value: { filling: "step-a" },
        context: { formSlug: "test-form", editingStepId: null, formData: {} },
        status: "active",
      };

      await saveFormProgress("test-form", machineState);
      const restored = await getFormProgress("test-form");

      expect(restored).toEqual(machineState);
    });

    it("should overwrite previous progress for the same slug", async () => {
      const first = { value: "title", status: "active" };
      const second = { value: { filling: "step-b" }, status: "active" };

      await saveFormProgress("my-form", first);
      await saveFormProgress("my-form", second);

      const restored = await getFormProgress("my-form");
      expect(restored).toEqual(second);
    });

    it("should keep progress for different slugs separate", async () => {
      const stateA = { value: "review", status: "active" };
      const stateB = { value: "title", status: "active" };

      await saveFormProgress("form-a", stateA);
      await saveFormProgress("form-b", stateB);

      expect(await getFormProgress("form-a")).toEqual(stateA);
      expect(await getFormProgress("form-b")).toEqual(stateB);
    });
  });

  describe("getFormProgress", () => {
    it("should return undefined for a slug with no saved progress", async () => {
      const result = await getFormProgress("nonexistent");
      expect(result).toBeUndefined();
    });
  });

  describe("clearFormProgress", () => {
    it("should remove saved progress for a slug", async () => {
      await saveFormProgress("form-a", { value: "review" });
      await clearFormProgress("form-a");

      expect(await getFormProgress("form-a")).toBeUndefined();
    });

    it("should not throw when clearing nonexistent progress", async () => {
      await expect(clearFormProgress("nonexistent")).resolves.not.toThrow();
    });

    it("should not affect other slugs", async () => {
      await saveFormProgress("form-a", { value: "review" });
      await saveFormProgress("form-b", { value: "title" });

      await clearFormProgress("form-a");

      expect(await getFormProgress("form-a")).toBeUndefined();
      expect(await getFormProgress("form-b")).toEqual({ value: "title" });
    });
  });
});
