import {
  neonStorage,
  NeonObjectStorageService,
  StorageService,
  StorageUploadResult,
  NeonBucketCategory,
  ALLOWED_BUCKET_CATEGORIES,
} from "./neon-object-storage";

export type {
  StorageService,
  StorageUploadResult,
  NeonBucketCategory,
};

export type NeonBucketName = NeonBucketCategory;
export const ALLOWED_BUCKETS = ALLOWED_BUCKET_CATEGORIES;

export const storage = neonStorage;

export function getStorageService(): StorageService {
  return neonStorage;
}

export * from "./neon-object-storage";
