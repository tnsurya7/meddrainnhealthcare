import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingContact } from "@/components/ui/FloatingContact";
import { getSiteSettings } from "@/lib/db/queries/site-settings";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar
        instituteName={settings.instituteName}
        phone={settings.phone}
        logoUrl={settings.logoUrl}
      />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      <FloatingContact
        phone={settings.phone}
        instagramUrl={settings.instagramUrl}
      />
    </div>
  );
}
