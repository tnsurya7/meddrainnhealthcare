import { describe, it, expect } from "vitest";
import { getStorageService } from "@/lib/storage";

describe("Storage Service Abstraction", () => {
  it("provides upload and deletion functions without crashing", async () => {
    const storageService = getStorageService();
    expect(storageService).toBeDefined();

    const sampleFile = Buffer.from("Biomed test image payload");
    const result = await storageService.uploadFile(
      sampleFile,
      "test-diagram.png",
      "image/png"
    );

    expect(result.url).toBeDefined();
    expect(result.key).toBeDefined();
    expect(result.size).toBe(sampleFile.length);
    expect(result.contentType).toBe("image/png");

    const deleteOk = await storageService.deleteFile(result.key);
    expect(deleteOk).toBe(true);
  });
});
