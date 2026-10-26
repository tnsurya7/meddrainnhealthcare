import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Meddrainn Healthcare",
    short_name: "Meddrainn",
    description:
      "Biomedical Equipment Training, Calibration & Hospital Support Services in Erode.",
    start_url: "/",
    display: "standalone",
    background_color: "#F5F8FC",
    theme_color: "#10243A",
    icons: [
      {
        src: "/favicon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/favicon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
