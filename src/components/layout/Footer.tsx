import React from "react";
import Link from "next/link";
import { Container } from "../ui/Container";
import {
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { InstagramIcon } from "@/components/ui/Icons";
import { SiteSettings } from "@/lib/db/schema";

interface FooterProps {
  settings: SiteSettings;
}

export function Footer({ settings }: FooterProps) {
  return (
    <footer className="bg-[#10243A] text-slate-300 border-t border-white/10 pt-16 pb-10">
      <Container size="wide">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          {/* Col 1: Institute Brand & Info */}
          <div className="space-y-4">
            <Link href="/" className="inline-block group" aria-label="Meddrainn Healthcare Home">
              <div className="relative h-14 sm:h-16 w-60 sm:w-72 flex items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/MeddRainn Healthcare Logo Header.png"
                  alt={settings.instituteName || "Meddrainn Healthcare"}
                  className="h-full w-auto max-h-16 object-contain object-left"
                />
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering healthcare engineering students and hospital professionals
              with hands-on medical equipment training, calibration standards, and
              practical biomedical laboratory experience.
            </p>
            <div className="pt-2">
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white hover:text-[#38BDF8] hover:border-[#38BDF8]/40 transition-colors"
                aria-label="Follow Meddrainn Healthcare on Instagram"
              >
                <InstagramIcon className="w-4 h-4 text-[#38BDF8]" />
                <span>Follow on Instagram</span>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Explore Institute
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>About &amp; Mission</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>Our Services</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/courses"
                  className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>Biomedical Courses</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>Our Gallery</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/feedback"
                  className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>Student Feedback</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0D9488]" />
                  <span>Privacy Notice</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/login"
                  className="hover:text-white transition-colors inline-flex items-center gap-1.5 text-slate-400 hover:text-[#38BDF8] cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>Admin Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Programs & Modules */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Specialized Modules
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>• Equipment Calibration & Safety Testing</li>
              <li>• ICU Ventilators & Critical Care</li>
              <li>• Multi-parameter Patient Monitors</li>
              <li>• Hospital Biomedical Internships</li>
              <li>• College Technical Bootcamps & Workshops</li>
            </ul>
          </div>

          {/* Col 4: Contact Details */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Contact & Location
            </h3>
            <div className="space-y-3.5 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
                <span className="text-slate-300 leading-relaxed text-xs sm:text-sm">
                  {settings.address}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#38BDF8] shrink-0" />
                <a
                  href={`tel:${settings.phone.replace(/\s+/g, "")}`}
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#38BDF8] shrink-0" />
                <a
                  href={`mailto:${settings.email}`}
                  className="text-slate-300 hover:text-white transition-colors truncate text-xs sm:text-sm"
                >
                  {settings.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400 relative z-30 pb-6 sm:pb-0">
          <p className="text-center md:text-left leading-relaxed">
            {settings.footerText ||
              "© Meddrainn Healthcare. All rights reserved. Empowering future healthcare professionals with practical expertise."}
          </p>
          <div className="flex items-center gap-4 shrink-0 sm:pr-0 pr-14">
            <Link href="/privacy" className="hover:text-white transition-colors cursor-pointer">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link
              id="footer-admin-login-link"
              href="/admin/login"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[#155EEF] border border-white/15 hover:border-[#155EEF] text-slate-200 hover:text-white shadow-sm transition-all font-semibold cursor-pointer select-none"
              title="Click to open Admin Portal Login"
            >
              <Lock className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
