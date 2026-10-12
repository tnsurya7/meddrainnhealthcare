import { getDb } from "../index";
import { courses, services, galleryImages, students, enquiries, feedback, Enquiry } from "../schema";
import { initialCourses, initialServices, initialGalleryImages, initialFeedback } from "../seed-data";
import { desc, sql, eq } from "drizzle-orm";

export interface DashboardStats {
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  totalServices: number;
  totalGalleryItems: number;
  publishedGalleryImages: number;
  totalStudents: number;
  pendingFeedback: number;
  approvedFeedback: number;
  newEnquiriesCount: number;
  totalEnquiriesCount: number;
  recentEnquiries: Enquiry[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const db = getDb();
  if (!db) {
    return {
      totalCourses: initialCourses.length,
      publishedCourses: initialCourses.filter((c) => c.status === "published").length,
      draftCourses: initialCourses.filter((c) => c.status === "draft").length,
      totalServices: initialServices.length,
      totalGalleryItems: initialGalleryImages.length,
      publishedGalleryImages: initialGalleryImages.filter((g) => g.status === "published").length,
      totalStudents: 0,
      pendingFeedback: 0,
      approvedFeedback: initialFeedback.length,
      newEnquiriesCount: 0,
      totalEnquiriesCount: 0,
      recentEnquiries: [],
    };
  }

  try {
    const [
      coursesList,
      servicesList,
      galleryList,
      studentsCountRes,
      allEnquiries,
      feedbackList,
    ] = await Promise.all([
      db.select({ status: courses.status }).from(courses),
      db.select({ status: services.status }).from(services),
      db.select({ status: galleryImages.status }).from(galleryImages),
      db.select({ count: sql<number>`count(*)` }).from(students),
      db.select().from(enquiries).orderBy(desc(enquiries.createdAt)),
      db.select({ status: feedback.status }).from(feedback),
    ]);

    const totalCourses = coursesList.length;
    const publishedCourses = coursesList.filter((c) => c.status === "published").length;
    const draftCourses = coursesList.filter((c) => c.status === "draft").length;

    const totalServices = servicesList.length;
    const totalGalleryItems = galleryList.length;
    const publishedGalleryImages = galleryList.filter((g) => g.status === "published").length;

    const totalStudents = Number(studentsCountRes[0]?.count || 0);

    const pendingFeedback = feedbackList.filter((f) => f.status === "pending").length;
    const approvedFeedback = feedbackList.filter((f) => f.status === "approved").length;

    const newEnquiriesCount = allEnquiries.filter((e) => e.status === "new").length;
    const totalEnquiriesCount = allEnquiries.length;
    const recentEnquiries = allEnquiries.slice(0, 5);

    return {
      totalCourses,
      publishedCourses,
      draftCourses,
      totalServices,
      totalGalleryItems,
      publishedGalleryImages,
      totalStudents,
      pendingFeedback,
      approvedFeedback,
      newEnquiriesCount,
      totalEnquiriesCount,
      recentEnquiries,
    };
  } catch (error) {
    console.error("Neon PostgreSQL error fetching dashboard stats:", error);
    return {
      totalCourses: initialCourses.length,
      publishedCourses: initialCourses.filter((c) => c.status === "published").length,
      draftCourses: initialCourses.filter((c) => c.status === "draft").length,
      totalServices: initialServices.length,
      totalGalleryItems: initialGalleryImages.length,
      publishedGalleryImages: initialGalleryImages.filter((g) => g.status === "published").length,
      totalStudents: 0,
      pendingFeedback: 0,
      approvedFeedback: initialFeedback.length,
      newEnquiriesCount: 0,
      totalEnquiriesCount: 0,
      recentEnquiries: [],
    };
  }
}
