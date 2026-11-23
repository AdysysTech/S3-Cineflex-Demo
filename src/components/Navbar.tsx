"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Film,
  UtensilsCrossed,
  Sparkles,
  Tv,
  MapPin,
  Menu,
  X,
  ChefHat,
  QrCode,
  Compass,
  MonitorPlay,
} from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/#movies", label: "Now Showing", icon: Film },
    { href: "/#upcoming", label: "Upcoming", icon: Sparkles },
    { href: "/order", label: "Food & Beverages", icon: UtensilsCrossed, highlight: true },
    { href: "/private-shows", label: "Private Shows", icon: Compass },
    { href: "/advertise", label: "Advertise", icon: Tv },
  ];

  const isLinkActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return pathname === "/";
    return pathname.startsWith(href.split("?")[0]);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#09090C]/90 backdrop-blur-md border-b border-white/10 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3.5 group cursor-pointer focus:outline-none"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#E1252C] to-[#9E1117] flex items-center justify-center font-extrabold text-2xl text-white shadow-lg shadow-[#E1252C]/30 group-hover:scale-105 transition-transform duration-200 border border-white/20">
              S3
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-white uppercase leading-none group-hover:text-[#FF5259] transition-colors">
                Cineplex
              </span>
              <span className="text-[10px] font-mono tracking-widest text-[#B6B2B8] uppercase mt-1">
                Manendragarh (C.G.)
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1.5 xl:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                    active
                      ? "text-white bg-white/10 border border-white/15"
                      : link.highlight
                      ? "text-[#FF5259] hover:text-white hover:bg-white/5"
                      : "text-zinc-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      link.highlight ? "text-[#E1252C]" : "text-zinc-400"
                    }`}
                  />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Simple KDS button */}
            <Link
              href="/kitchen"
              className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-xs font-mono text-zinc-300 hover:text-white transition-all flex items-center gap-1.5"
              title="Kitchen Display System"
            >
              <ChefHat className="w-3.5 h-3.5 text-[#38B884]" />
              <span>KDS</span>
            </Link>

            {/* Google Directions Button */}
            <a
              href="https://maps.google.com/?cid=8116102637060065234"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full border border-white/15 hover:border-white/40 hover:bg-white/5 transition-all text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5 text-[#E1252C]" />
              <span>Directions</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/kitchen"
              className="px-2.5 py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-1 text-[11px] font-mono text-zinc-300"
            >
              <ChefHat className="w-3.5 h-3.5 text-[#38B884]" />
              <span>KDS</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0D0D12] border-b border-white/10 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isLinkActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  active
                    ? "bg-[#E1252C]/15 text-white border border-[#E1252C]/40"
                    : "text-zinc-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    link.highlight ? "text-[#E1252C]" : "text-zinc-400"
                  }`}
                />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <Link
              href="/kitchen"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-mono text-zinc-300 hover:text-white"
            >
              <div className="flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-[#38B884]" />
                <span>Kitchen Display (KDS)</span>
              </div>
            </Link>

            <a
              href="https://maps.google.com/?cid=8116102637060065234"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 text-sm font-semibold text-zinc-300 hover:text-white"
            >
              <MapPin className="w-4 h-4 text-[#E1252C]" />
              <span>S3 Cineplex on Google Maps</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
