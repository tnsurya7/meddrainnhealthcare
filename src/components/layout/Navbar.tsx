"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X, Phone, ArrowRight } from "lucide-react";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";

interface NavbarProps {
  instituteName?: string;
  phone?: string;
  logoUrl?: string | null;
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/courses", label: "Courses" },
  { href: "/gallery", label: "Gallery" },
  { href: "/feedback", label: "Feedback" },
  { href: "/contact", label: "Contact" },
];

export function Navbar({
  instituteName = "Meddrainn Healthcare",
  phone = "+91 6380918863",
  logoUrl,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-[#10243A]/95 backdrop-blur-md shadow-md py-3 border-b border-white/10"
          : "bg-[#10243A] py-4 border-b border-white/5"
      }`}
    >
      <Container size="wide">
        <div className="flex items-center justify-between gap-4">
          {/* Logo / Brand Wordmark Header */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] rounded-lg shrink-0"
            aria-label="Meddrainn Healthcare Home"
          >
            <div className="relative h-12 sm:h-14 w-56 sm:w-72 flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/MeddRainn Healthcare Logo Header.png"
                alt="Meddrainn Healthcare"
                className="h-full w-auto max-h-14 object-contain object-left"
              />
            </div>
          </Link>

          {/* Desktop Navigation Links - Section names in one line */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 shrink-0">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                    isActive
                      ? "text-white bg-white/10 shadow-inner"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Header Action Button (Call & Apply) */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0">
            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-[#38BDF8] transition-colors py-1.5 px-2.5 rounded-lg border border-white/10 bg-white/5 whitespace-nowrap"
              aria-label={`Call institute at ${phone}`}
            >
              <Phone className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>{phone}</span>
            </a>
            <Link href="/contact" className="shrink-0">
              <Button
                variant="primary"
                size="sm"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                className="whitespace-nowrap"
              >
                Admission Enquiry
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="p-2 rounded-lg bg-white/5 text-[#38BDF8] border border-white/10"
              aria-label="Call institute"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] cursor-pointer"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#10243A] border-b border-white/10 px-4 pt-3 pb-6 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-1 mb-4">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2.5 rounded-lg text-base font-semibold transition-colors ${
                    isActive
                      ? "text-white bg-white/15"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-slate-200 bg-white/5 border border-white/10"
            >
              <Phone className="w-4 h-4 text-[#38BDF8]" />
              <span>Call: {phone}</span>
            </a>
            <Link href="/contact" className="w-full">
              <Button
                variant="primary"
                size="md"
                className="w-full justify-center"
              >
                Enquire Now
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
