import { getSiteUrl, getAbsoluteUrl } from "./site-url";

export interface EducationalOrgSchemaOptions {
  name?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  instagramUrl?: string;
  logoUrl?: string;
}

/**
 * Generates schema.org EducationalOrganization / Organization JSON-LD
 * Strictly adheres to verified official Meddrainn Healthcare institute facts.
 */
export function generateEducationalOrganizationSchema(
  options?: EducationalOrgSchemaOptions
) {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${siteUrl}/#organization`,
    name: options?.name || "Meddrainn Healthcare",
    alternateName: "Meddrainn Healthcare Biomedical Training",
    url: siteUrl,
    logo: options?.logoUrl || getAbsoluteUrl("/images/logo.png"),
    description:
      options?.description ||
      "Established in 2021, Meddrainn Healthcare provides hands-on practical training in medical equipment, biomedical technologies, college internships, and hospital support services.",
    telephone: options?.phone || "+91 6380918863",
    email: options?.email || "meddrainnhealthcare2019@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "H-42, 80 Feet Road, Periyar Nagar",
      addressLocality: "Erode",
      postalCode: "638001",
      addressRegion: "Tamil Nadu",
      addressCountry: "IN",
    },
    sameAs: [
      options?.instagramUrl || "https://www.instagram.com/meddrainnhealthcare/",
    ].filter(Boolean),
  };
}

/**
 * Generates schema.org WebSite JSON-LD with Sitelinks SearchBox capability
 */
export function generateWebSiteSchema() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: "Meddrainn Healthcare",
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    inLanguage: "en-US",
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Generates schema.org BreadcrumbList JSON-LD
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : getAbsoluteUrl(item.url),
    })),
  };
}

export interface CourseSchemaOptions {
  title: string;
  description: string;
  slug: string;
  duration?: string | null;
  prerequisites?: string | null;
  thumbnailUrl?: string | null;
}

/**
 * Generates schema.org Course JSON-LD for verified published courses
 */
export function generateCourseSchema(course: CourseSchemaOptions) {
  const siteUrl = getSiteUrl();
  const courseUrl = `${siteUrl}/courses/${course.slug}`;

  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description,
    url: courseUrl,
    provider: {
      "@type": "EducationalOrganization",
      name: "Meddrainn Healthcare",
      sameAs: siteUrl,
    },
  };

  if (course.thumbnailUrl) {
    schema.image = course.thumbnailUrl;
  }

  if (course.duration) {
    schema.timeRequired = course.duration;
  }

  if (course.prerequisites) {
    schema.coursePrerequisites = course.prerequisites;
  }

  return schema;
}
