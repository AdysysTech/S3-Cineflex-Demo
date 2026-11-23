"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Tv,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Users,
  Eye,
  Send,
  Building,
  Phone,
  MessageCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Check,
} from "lucide-react";
import confetti from "canvas-confetti";
import { AD_PACKAGES, CINEMA_INFO } from "@/lib/data";

export default function AdvertisePage() {
  const [selectedPackage, setSelectedPackage] = useState<string>("interval-30");
  const [businessName, setBusinessName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [businessCategory, setBusinessCategory] = useState("Coaching Institute / School");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const categories = [
    "Coaching Institute / School",
    "Jewellers & Lifestyle",
    "Hospital / Clinic / Pathology",
    "Automobile Dealership",
    "Real Estate / Builder",
    "Restaurant / Retail Store",
    "Other Local Business",
  ];

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !whatsappNumber.trim()) {
      alert("Please provide your business name and WhatsApp number.");
      return;
    }

    setIsSubmitting(true);

    const pkg = AD_PACKAGES.find((p) => p.id === selectedPackage) || AD_PACKAGES[1];

    // Capture to CRM API
    try {
      await fetch("/api/crm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${contactPerson.trim() || businessName.trim()} (${businessName.trim()})`,
          whatsappNumber: whatsappNumber.replace(/\D/g, "").slice(0, 10),
          optInMarketing: true,
          source: "AD_INQUIRY",
          orderCount: 0,
          totalSpent: 0,
        }),
      });
    } catch (err) {
      console.warn("CRM auto capture notice:", err);
    }

    // Prepare WhatsApp message
    const waText = `*New Big Screen Ad Inquiry for S3 Cineplex* 🎬\n\n` +
      `• *Business:* ${businessName.trim()}\n` +
      `• *Contact Person:* ${contactPerson.trim() || "N/A"}\n` +
      `• *Phone/WhatsApp:* +91 ${whatsappNumber.trim()}\n` +
      `• *Category:* ${businessCategory}\n` +
      `• *Package:* ${pkg.title} (${pkg.price}/${pkg.period})\n` +
      (notes.trim() ? `• *Requirements:* ${notes.trim()}\n\n` : `\n`) +
      `Please share slot availability and slide dimension guidelines.`;

    const waUrl = `https://wa.me/${CINEMA_INFO.phoneRaw}?text=${encodeURIComponent(waText)}`;

    // Open WhatsApp in new tab
    if (typeof window !== "undefined") {
      window.open(waUrl, "_blank");
    }

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#E1252C", "#FF5259", "#38B884", "#FFFFFF"],
      });
    } catch {
      // ignore
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="w-full min-h-screen bg-[#09090C] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E1252C]/15 border border-[#E1252C]/40 text-[#FF5259] text-xs font-mono font-bold uppercase tracking-wider">
            <Tv className="w-3.5 h-3.5" />
            <span>Local B2B Cinema Advertising</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
            Put Your Business on the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5259] via-[#E1252C] to-amber-400">
              Big Screen in Manendragarh.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed font-normal">
            Reach thousands of local consumers every month when their attention is 100% captive.
            Affordable 15-sec &amp; 30-sec on-screen slides starting at just{" "}
            <strong className="text-white">₹3,500/month</strong> (~₹38 per show).
          </p>
        </div>

        {/* Audience & Impact Metric Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-6 rounded-3xl bg-[#121217] border border-white/10 text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#FF5259] font-mono">
              90+
            </div>
            <div className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Shows Every Month
            </div>
            <div className="text-[11px] text-zinc-400">3 daily prime cinema shows</div>
          </div>

          <div className="p-6 rounded-3xl bg-[#121217] border border-white/10 text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#38B884] font-mono">
              4,500+
            </div>
            <div className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Local Viewers
            </div>
            <div className="text-[11px] text-zinc-400">High purchasing power locals</div>
          </div>

          <div className="p-6 rounded-3xl bg-[#121217] border border-white/10 text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
              100%
            </div>
            <div className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Captive Attention
            </div>
            <div className="text-[11px] text-zinc-400">Zero ad-blockers, zero scrolling</div>
          </div>

          <div className="p-6 rounded-3xl bg-[#121217] border border-white/10 text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono">
              4K Laser
            </div>
            <div className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Giant Screen Clarity
            </div>
            <div className="text-[11px] text-zinc-400">Crisp visuals &amp; Dolby sound</div>
          </div>
        </div>

        {/* Package Comparison Cards */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Choose Your Screen Package
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Flexible monthly agreements. Creative design assistance included.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {AD_PACKAGES.map((pkg) => {
              const isSelected = selectedPackage === pkg.id;
              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={`bg-[#121217] rounded-3xl p-6 sm:p-8 flex flex-col justify-between cursor-pointer transition-all duration-300 relative border-2 ${
                    pkg.highlight
                      ? "border-[#E1252C] shadow-2xl shadow-[#E1252C]/20 -translate-y-2"
                      : isSelected
                      ? "border-white/60"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  {pkg.highlight && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#E1252C] text-white font-mono font-bold text-[10px] uppercase tracking-wider shadow-md">
                      Most Popular for Local Retail
                    </div>
                  )}

                  <div className="space-y-6">
                    <div>
                      <span className="text-xs font-mono text-zinc-400 block uppercase font-bold">
                        {pkg.subtitle}
                      </span>
                      <h3 className="text-2xl font-extrabold text-white mt-1">{pkg.title}</h3>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#1A1A22] border border-white/5 space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                          {pkg.price}
                        </span>
                        <span className="text-xs text-zinc-400 font-mono">/{pkg.period}</span>
                      </div>
                      <div className="text-[11px] font-mono text-[#38B884]">
                        {pkg.impressions}
                      </div>
                    </div>

                    {/* Features List */}
                    <ul className="space-y-2.5 text-xs text-zinc-300">
                      {pkg.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-[#38B884] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-white/10 mt-6">
                    <button
                      type="button"
                      className={`w-full py-3 rounded-xl font-mono font-bold text-xs transition-all ${
                        isSelected
                          ? "bg-[#E1252C] text-white shadow-md shadow-[#E1252C]/30"
                          : "bg-white/10 text-zinc-300 hover:text-white"
                      }`}
                    >
                      {isSelected ? "✓ Selected for Inquiry" : "Select Package"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Working Booking Inquiry Form */}
        <div className="max-w-2xl mx-auto bg-[#121217] border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          <div className="space-y-2 border-b border-white/10 pb-6">
            <div className="flex items-center gap-2 text-xs font-mono text-[#FF5259] uppercase font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Instant WhatsApp Route</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Request Your Screen Slot
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400">
              Submit your business details below to reserve your slide and connect directly with
              the S3 Cineplex advertising manager on WhatsApp.
            </p>
          </div>

          {isSubmitted ? (
            <div className="p-8 text-center space-y-4 bg-[#1A1A22] rounded-2xl border border-[#38B884]/40 animate-in fade-in">
              <div className="w-14 h-14 rounded-full bg-[#38B884]/20 border-2 border-[#38B884] flex items-center justify-center text-[#38B884] mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-white">Inquiry Sent Successfully!</h4>
              <p className="text-xs text-zinc-300 max-w-md mx-auto leading-relaxed">
                We have opened your pre-formatted WhatsApp chat with the S3 Cineplex manager.
                Our team will confirm slot availability within 2 working hours.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold transition-colors"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitInquiry} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block font-bold">
                    Business / Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Apex Coaching Classes"
                    className="w-full bg-[#1A1A22] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#E1252C]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block font-bold">
                    Contact Person Name
                  </label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. Dr. Amit Sharma"
                    className="w-full bg-[#1A1A22] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#E1252C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block font-bold">
                    WhatsApp Number *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-xs font-mono text-zinc-400">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      value={whatsappNumber}
                      onChange={(e) =>
                        setWhatsappNumber(e.target.value.replace(/\D/g, "").slice(0, 10))
                      }
                      placeholder="87189XXXXX"
                      className="w-full bg-[#1A1A22] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-xs sm:text-sm font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-[#E1252C]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block font-bold">
                    Business Category
                  </label>
                  <select
                    value={businessCategory}
                    onChange={(e) => setBusinessCategory(e.target.value)}
                    className="w-full bg-[#1A1A22] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-[#E1252C]"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c} className="bg-[#121217]">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block font-bold">
                  Selected Package
                </label>
                <div className="p-3.5 rounded-xl bg-[#1A1A22] border border-white/10 flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-white">
                    {AD_PACKAGES.find((p) => p.id === selectedPackage)?.title}
                  </span>
                  <span className="text-[#38B884] font-bold">
                    {AD_PACKAGES.find((p) => p.id === selectedPackage)?.price}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block font-bold">
                  Specific Campaign Details or Questions
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Planning a summer admission campaign starting next month..."
                  className="w-full bg-[#1A1A22] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#E1252C]"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#E1252C] to-[#B8181E] hover:from-[#FF5259] hover:to-[#E1252C] text-white font-bold text-base shadow-lg shadow-[#E1252C]/30 hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5 fill-white text-[#E1252C]" />
                <span>Submit &amp; Open Manager WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-[10px] font-mono text-zinc-500 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#38B884]" />
                <span>Direct inquiry to {CINEMA_INFO.phone} • Zero third-party agency fee</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
