"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  QrCode,
  Printer,
  Sparkles,
  ArrowLeft,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Armchair,
  Smartphone,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function DemoQRPage() {
  const [seatNumber, setSeatNumber] = useState<string>("E12");
  const [tierName, setTierName] = useState<string>("Executive Prime");
  const [baseUrl, setBaseUrl] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  // Auto-detect base URL on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }
  }, []);

  const fullOrderUrl = `${baseUrl || "https://s3-cineplex.vercel.app"}/order?seat=${seatNumber.toUpperCase()}`;

  const handleCopy = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(fullOrderUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const setPreset = (seat: string, tier: string) => {
    setSeatNumber(seat);
    setTierName(tier);
  };

  return (
    <div className="w-full min-h-screen bg-[#09090C] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Control Header (Hidden when printing) */}
        <div className="no-print space-y-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Cinema Home</span>
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-5 py-2.5 rounded-xl bg-[#E1252C] hover:bg-[#FF5259] text-white font-mono font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#E1252C]/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print QR Card (Physical Pitch Prop)</span>
              </button>
            </div>
          </div>

          <div className="bg-[#121217] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#FF5259] font-bold uppercase">
                <QrCode className="w-3.5 h-3.5" />
                <span>Presenter Tool</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Printable Brushed Metal Seat Plaque
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400">
                Generate and print high-resolution metal QR armrest plaques to show the S3 Cineplex
                owners during your in-person pitch. Scanning this with any smartphone camera
                immediately opens the In-Seat Ordering web app!
              </p>
            </div>

            {/* Customizer Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block font-bold">
                  Seat Number Code
                </label>
                <input
                  type="text"
                  value={seatNumber}
                  onChange={(e) => setSeatNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. E12"
                  className="w-full bg-[#1A1A22] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white text-center font-bold focus:outline-none focus:border-[#E1252C]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block font-bold">
                  Seat Tier Label
                </label>
                <input
                  type="text"
                  value={tierName}
                  onChange={(e) => setTierName(e.target.value)}
                  placeholder="e.g. Executive Prime"
                  className="w-full bg-[#1A1A22] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-[#E1252C]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block font-bold">
                  Target Website URL
                </label>
                <input
                  type="text"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#1A1A22] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-mono text-zinc-300 focus:outline-none focus:border-[#E1252C]"
                />
              </div>
            </div>

            {/* Presets Strip */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs font-mono text-zinc-400">Quick Presets:</span>
              <button
                onClick={() => setPreset("E12", "Executive Prime")}
                className="px-3 py-1 rounded-lg bg-[#1A1A22] hover:bg-[#23232D] text-xs font-mono text-zinc-300 hover:text-white border border-white/5 transition-colors"
              >
                Seat E12 (Executive)
              </button>
              <button
                onClick={() => setPreset("H06", "VIP Motorized Recliner")}
                className="px-3 py-1 rounded-lg bg-[#1A1A22] hover:bg-[#23232D] text-xs font-mono text-zinc-300 hover:text-white border border-white/5 transition-colors"
              >
                Seat H06 (VIP Recliner)
              </button>
              <button
                onClick={() => setPreset("B08", "Regular Classic")}
                className="px-3 py-1 rounded-lg bg-[#1A1A22] hover:bg-[#23232D] text-xs font-mono text-zinc-300 hover:text-white border border-white/5 transition-colors"
              >
                Seat B08 (Regular)
              </button>
            </div>

            {/* Live Link Verification */}
            <div className="p-3.5 rounded-xl bg-[#1A1A22] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
              <div className="truncate max-w-lg">
                <span className="text-zinc-500">Encoded Link: </span>
                <span className="text-[#38B884] font-bold">{fullOrderUrl}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#38B884]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy Link"}</span>
                </button>
                <a
                  href={fullOrderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-lg bg-[#E1252C]/20 hover:bg-[#E1252C]/30 text-[#FF5259] flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Test Link</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* The Realistic Brushed Metal Plaque (Print Ready) */}
        <div className="print-plaque-container flex justify-center py-6">
          <div className="w-full max-w-lg metal-brushed border-4 border-[#E1252C] rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden text-white space-y-6">
            {/* Realistic Metal Corner Screw Rivets */}
            <div className="absolute top-4 left-4 w-4 h-4 rounded-full bg-gradient-to-br from-zinc-400 to-zinc-700 border border-zinc-900 shadow-inner flex items-center justify-center">
              <div className="w-2.5 h-[1px] bg-zinc-900 transform rotate-45"></div>
            </div>
            <div className="absolute top-4 right-4 w-4 h-4 rounded-full bg-gradient-to-br from-zinc-400 to-zinc-700 border border-zinc-900 shadow-inner flex items-center justify-center">
              <div className="w-2.5 h-[1px] bg-zinc-900 transform -rotate-45"></div>
            </div>
            <div className="absolute bottom-4 left-4 w-4 h-4 rounded-full bg-gradient-to-br from-zinc-400 to-zinc-700 border border-zinc-900 shadow-inner flex items-center justify-center">
              <div className="w-2.5 h-[1px] bg-zinc-900 transform -rotate-30"></div>
            </div>
            <div className="absolute bottom-4 right-4 w-4 h-4 rounded-full bg-gradient-to-br from-zinc-400 to-zinc-700 border border-zinc-900 shadow-inner flex items-center justify-center">
              <div className="w-2.5 h-[1px] bg-zinc-900 transform rotate-12"></div>
            </div>

            {/* Plaque Top S3 Cinema Bar */}
            <div className="text-center pb-4 border-b border-white/20 space-y-1">
              <div className="inline-flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#E1252C] flex items-center justify-center font-extrabold text-white text-sm shadow">
                  S3
                </div>
                <span className="text-xl font-extrabold tracking-widest text-white uppercase font-sans">
                  Cineplex
                </span>
              </div>
              <div className="text-[10px] font-mono tracking-[0.25em] text-[#FF5259] uppercase font-bold">
                Manendragarh (C.G.) • Luxury In-Seat Dining
              </div>
            </div>

            {/* Center Seat Badge + High-Res QR Code */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
              {/* Seat Details */}
              <div className="text-center sm:text-left space-y-2">
                <span className="text-xs font-mono tracking-widest text-zinc-400 uppercase block font-bold">
                  {tierName}
                </span>
                <div className="text-5xl sm:text-6xl font-black text-white font-sans tracking-tight">
                  SEAT {seatNumber.toUpperCase()}
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#38B884]/20 border border-[#38B884]/40 text-[#38B884] font-mono text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#38B884] animate-ping"></span>
                  <span>100% PREPAID UPI</span>
                </div>
              </div>

              {/* High-Resolution Scannable QR Code */}
              <div className="p-4 bg-white rounded-2xl shadow-2xl shrink-0 border-2 border-zinc-300">
                <QRCodeSVG
                  value={fullOrderUrl}
                  size={140}
                  level="H"
                  includeMargin={true}
                />
              </div>
            </div>

            {/* Bottom Instructions Strip */}
            <div className="pt-4 border-t border-white/20 text-center space-y-1">
              <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-[#FF5259]" />
                <span>Scan with Any Phone Camera • No App Needed</span>
              </div>
              <div className="text-[10px] font-mono text-zinc-400">
                Order Gourmet Popcorn, Burgers, Samosas &amp; Drinks Straight to Your Recliner
              </div>
              <div className="text-[9px] font-mono text-zinc-500 pt-1 tracking-wider uppercase">
                Anodized Aluminum • Water &amp; Scratch Resistant
              </div>
            </div>
          </div>
        </div>

        {/* Presenter Tip Box (Hidden on Print) */}
        <div className="no-print p-6 rounded-3xl bg-[#121217] border border-white/10 text-xs text-zinc-300 leading-relaxed space-y-2">
          <div className="font-bold text-[#FF5259] font-mono uppercase text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>How to Demo This to the S3 Cineplex Owner:</span>
          </div>
          <ol className="list-decimal list-inside space-y-1.5 text-zinc-400 font-mono">
            <li>Open this page on your laptop and click <strong>&quot;Print QR Card&quot;</strong> or present this plaque on your screen.</li>
            <li>Hand the printed plaque (or show your screen) to the owner and ask them to scan the QR code with their own phone.</li>
            <li>Their phone will immediately open the S3 In-Seat Dining menu with <code>SEAT {seatNumber}</code> pre-detected!</li>
            <li>Ask them to add a Caramel Popcorn and hit &quot;Pay via UPI&quot;.</li>
            <li>Simultaneously, have your second tab open to <strong className="text-white">/kitchen</strong> — the owner will hear the audio chime and watch their order ping in real time!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
