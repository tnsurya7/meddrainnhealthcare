import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import { getSiteUrl } from "@/lib/seo/site-url";
import {
  generateEducationalOrganizationSchema,
  generateWebSiteSchema,
} from "@/lib/seo/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";
import { GoogleAnalytics } from "@/components/seo/GoogleAnalytics";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#10243A",
};

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Meddrainn Healthcare | Biomedical Training & Hospital Support Services",
    template: "%s | Meddrainn Healthcare",
  },
  description:
    "Established in 2021, Meddrainn Healthcare provides hands-on medical equipment training, biomedical internships, college workshops, and healthcare support services in Erode, Tamil Nadu.",
  keywords: [
    "Meddrainn Healthcare",
    "Meddrainn Healthcare Erode",
    "Biomedical training institute in Erode",
    "Biomedical equipment training in Erode",
    "Medical coding training in Erode",
    "Medical device training in Tamil Nadu",
    "Biomedical internship training in Tamil Nadu",
    "Biomedical equipment workshops in Erode",
    "Hands-on healthcare technical training",
  ],
  authors: [{ name: "Meddrainn Healthcare" }],
  creator: "Meddrainn Healthcare",
  publisher: "Meddrainn Healthcare",
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  alternates: {
    canonical: "./",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: getSiteUrl(),
    siteName: "Meddrainn Healthcare",
    title: "Meddrainn Healthcare | Practical Biomedical Equipment Training",
    description:
      "Equipping future healthcare professionals with practical expertise and industry-ready skills in medical equipment, sales and marketing, and hospital support services.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Meddrainn Healthcare Biomedical Training Laboratory",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Meddrainn Healthcare | Practical Biomedical Equipment Training",
    description:
      "Connecting academic knowledge with real-world healthcare needs through hands-on training in medical equipment and hospital support services.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgSchema = generateEducationalOrganizationSchema();
  const webSiteSchema = generateWebSiteSchema();

  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <JsonLd data={[orgSchema, webSiteSchema]} />
      </head>
      <body className="min-h-screen bg-[#F5F8FC] text-[#172B4D] antialiased flex flex-col font-sans">
        <GoogleAnalytics />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
