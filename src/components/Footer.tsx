import React from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Clock,
  ExternalLink,
  Heart,
  Mail,
  ShieldCheck,
  Film,
  UtensilsCrossed,
  Sparkles,
} from "lucide-react";
import { CINEMA_INFO } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-[#040406] border-t border-white/10 pt-16 pb-12 mt-auto text-sm text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E1252C] to-[#9E1117] flex items-center justify-center font-extrabold text-xl text-white shadow-lg shadow-[#E1252C]/30 border border-white/20">
                S3
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-white uppercase leading-none">
                  Cineplex
                </span>
                <span className="text-[10px] font-mono tracking-widest text-[#B6B2B8] uppercase mt-1">
                  Manendragarh
                </span>
              </div>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Manendragarh&apos;s premier entertainment destination. Featuring 4K Laser Projection,
              Dolby Atmos sound, plush recliner rows, and instant in-seat QR dining.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-[#38B884]">
              <span className="w-2 h-2 rounded-full bg-[#38B884] animate-pulse"></span>
              <span>4.2★ Rated (629+ Google &amp; Justdial Reviews)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">
              Cinema Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/#movies"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <Film className="w-4 h-4 text-[#E1252C]" />
                  <span>Now Showing Movies</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/#upcoming"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Upcoming Blockbusters</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/order"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <UtensilsCrossed className="w-4 h-4 text-[#FF5259]" />
                  <span>Food &amp; Beverages (In-Seat)</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/private-shows"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Private Screenings &amp; Birthdays</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/advertise"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <span className="text-xs font-mono text-[#38B884]">AD</span>
                  <span>On-Screen Local Advertising</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/kitchen"
                  className="hover:text-white transition-colors flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-xs font-mono pt-2"
                >
                  <span>Staff / Kitchen Login</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Location & Contact */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">
              Visit S3 Cineplex
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E1252C] shrink-0 mt-0.5" />
                <span>{CINEMA_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>Operating Hours: {CINEMA_INFO.hours}</span>
              </div>
              <a
                href={CINEMA_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF5259] hover:text-white transition-colors mt-1"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Direct Manager Contact & Adysys Tech Credit */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">
              Manager &amp; Inquiries
            </h4>
            <div className="space-y-3">
              <a
                href={`tel:${CINEMA_INFO.phone}`}
                className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors font-mono"
              >
                <Phone className="w-4 h-4 text-[#38B884]" />
                <span>{CINEMA_INFO.phone}</span>
              </a>
              <a
                href={`https://wa.me/${CINEMA_INFO.phoneRaw}?text=${encodeURIComponent(
                  "Hello S3 Cineplex, I would like to inquire about showtimes and bookings."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#38B884] hover:text-white transition-colors text-xs font-semibold"
              >
                <span>Chat on Official WhatsApp →</span>
              </a>

              {/* Digital Experience Prototype Badge */}
              <div className="mt-4 p-3.5 rounded-xl bg-[#121217] border border-white/10 space-y-1">
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                  Concept &amp; Prototype
                </div>
                <div className="text-xs font-bold text-white flex items-center justify-between">
                  <span>Adysys Tech</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#E1252C]/20 text-[#FF5259] font-mono">
                    PROPOSAL
                  </span>
                </div>
                <a
                  href="mailto:adysys.tech@outlook.com"
                  className="text-[11px] text-[#FF5259] hover:underline flex items-center gap-1 font-mono pt-1"
                >
                  <Mail className="w-3 h-3" />
                  <span>adysys.tech@outlook.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            &copy; 2026 S3 Cineplex Manendragarh. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-zinc-400">
              <ShieldCheck className="w-3.5 h-3.5 text-[#38B884]" />
              <span>Independent Cinema Tech Prototype</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
