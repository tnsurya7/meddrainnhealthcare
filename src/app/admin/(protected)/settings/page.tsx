import React from "react";
import { getSiteSettings } from "@/lib/db/queries/site-settings";
import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return <SiteSettingsForm initialSettings={settings} />;
}
