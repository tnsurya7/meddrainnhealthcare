import React from "react";
import type { Metadata } from "next";
import { getPublishedGalleryImages } from "@/lib/db/queries/gallery";
import { getSiteSettings } from "@/lib/db/queries/site-settings";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { GalleryExplorer } from "@/components/gallery/GalleryExplorer";

import { getAbsoluteUrl } from "@/lib/seo/site-url";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Our Gallery | Meddrainn Healthcare",
  description:
    "A glimpse into our practical biomedical training environment. Explore real moments from our hands-on biomedical training sessions, equipment demonstrations and hospital exposure programs at Meddrainn Healthcare.",
  alternates: {
    canonical: getAbsoluteUrl("/gallery"),
  },
  openGraph: {
    title: "Our Gallery | Meddrainn Healthcare",
    description:
      "A glimpse into our practical biomedical training environment. Explore real moments from hands-on medical equipment training sessions at Meddrainn Healthcare.",
    url: getAbsoluteUrl("/gallery"),
  },
};

export default async function GalleryPage() {
  const [images, settings] = await Promise.all([
    getPublishedGalleryImages(),
    getSiteSettings(),
  ]);

  return (
    <div className="flex flex-col w-full pb-20">
      <PageHeader
        badge="Biomedical Training Moments"
        title="Our Gallery"
        description={
          settings.galleryDescription ||
          "A glimpse into our practical biomedical training environment. Explore real moments from our hands-on biomedical training sessions, equipment demonstrations and hospital exposure programs at Meddrainn Healthcare."
        }
        breadcrumbs={[{ label: "Our Gallery" }]}
      />

      <section className="py-12 bg-[#F5F8FC]">
        <Container size="wide">
          {settings.publicGalleryVisibility ? (
            <GalleryExplorer initialImages={images} />
          ) : (
            <div className="text-center py-16 text-[#64748B]">
              The public photo gallery is currently being updated by the administrator.
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
