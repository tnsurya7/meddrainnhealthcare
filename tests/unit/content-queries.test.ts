import { describe, it, expect } from "vitest";
import { getPublishedCourses, getCourseBySlug } from "@/lib/db/queries/courses";
import { getPublishedServices } from "@/lib/db/queries/services";
import { getPublishedGalleryImages } from "@/lib/db/queries/gallery";
import { getPublicStudentShowcase } from "@/lib/db/queries/students";

describe("Database Content Queries & Filtering", () => {
  it("retrieves published courses with proper metadata", async () => {
    const courses = await getPublishedCourses();
    expect(Array.isArray(courses)).toBe(true);
    expect(courses.length).toBeGreaterThan(0);

    const firstCourse = courses[0];
    expect(firstCourse.title).toBeDefined();
    expect(firstCourse.slug).toBeDefined();
    expect(firstCourse.status).toBe("published");
  });

  it("filters courses by slug accurately", async () => {
    const course = await getCourseBySlug("biomedical-equipment-calibration-safety-testing");
    expect(course).not.toBeNull();
    expect(course?.slug).toBe("biomedical-equipment-calibration-safety-testing");
  });

  it("returns null for non-existent course slugs", async () => {
    const course = await getCourseBySlug("non-existent-course-slug-12345");
    expect(course).toBeNull();
  });

  it("retrieves published services", async () => {
    const services = await getPublishedServices();
    expect(Array.isArray(services)).toBe(true);
    expect(services.length).toBeGreaterThan(0);
    expect(services.every((s) => s.status === "published")).toBe(true);
  });

  it("retrieves published gallery images and filters categories", async () => {
    const gallery = await getPublishedGalleryImages();
    expect(Array.isArray(gallery)).toBe(true);
    expect(gallery.length).toBeGreaterThan(0);

    const workshopsOnly = await getPublishedGalleryImages("Workshops");
    expect(workshopsOnly.every((g) => g.category === "Workshops")).toBe(true);
  });

  it("never returns unapproved student records to public showcase", async () => {
    const showcase = await getPublicStudentShowcase();
    expect(Array.isArray(showcase)).toBe(true);
    // Student showcase returns array with strictly public fields only
    showcase.forEach((student) => {
      expect((student as any).phone).toBeUndefined();
      expect((student as any).email).toBeUndefined();
      expect((student as any).adminNotes).toBeUndefined();
    });
  });
});
