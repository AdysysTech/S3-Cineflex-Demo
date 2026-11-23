"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  PartyPopper,
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  UtensilsCrossed,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Check,
  Film,
} from "lucide-react";
import confetti from "canvas-confetti";
import { PRIVATE_SHOW_TIERS, CINEMA_INFO } from "@/lib/data";

export default function PrivateShowsPage() {
  const [selectedTier, setSelectedTier] = useState<string>("birthday-intimate");
  const [organizerName, setOrganizerName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("10:00 AM Morning VIP Slot");
  const [guestCount, setGuestCount] = useState("25");
  const [occasionType, setOccasionType] = useState("Birthday Celebration");
  const [preferredMovie, setPreferredMovie] = useState("Latest Bollywood Release");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const occasionOptions = [
    "Birthday Celebration",
    "Anniversary Milestone",
    "College / School Reunion",
    "Corporate Team Outing",
    "Private Premiere Screening",
  ];

  const slotOptions = [
    "10:00 AM Morning VIP Slot (Before Public)",
    "02:00 PM Afternoon Matinee Slot",
    "10:30 PM Late Night Exclusive Lockout",
  ];

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizerName.trim() || !whatsappNumber.trim()) {
      alert("Please provide your name and WhatsApp number.");
      return;
    }

    setIsSubmitting(true);

    const tier =
      PRIVATE_SHOW_TIERS.find((t) => t.id === selectedTier) ||
      PRIVATE_SHOW_TIERS[0];

    // Capture to CRM API
    try {
      await fetch("/api/crm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${organizerName.trim()} (${occasionType})`,
          whatsappNumber: whatsappNumber.replace(/\D/g, "").slice(0, 10),
          optInMarketing: true,
          source: "PRIVATE_SHOW_INQUIRY",
          orderCount: 0,
          totalSpent: 0,
        }),
      });
    } catch (err) {
      console.warn("CRM private show capture notice:", err);
    }

    // Format WhatsApp Message
    const waText =
      `*Private Screening Booking Request for S3 Cineplex* 🍿\n\n` +
      `• *Organizer:* ${organizerName.trim()}\n` +
      `• *WhatsApp:* +91 ${whatsappNumber.trim()}\n` +
      `• *Occasion:* ${occasionType}\n` +
      `• *Package:* ${tier.name} (${tier.price})\n` +
      `• *Target Date:* ${eventDate || "Next Weekend"}\n` +
      `• *Preferred Slot:* ${timeSlot}\n` +
      `• *Estimated Guests:* ~${guestCount} people\n` +
      `• *Movie Choice:* ${preferredMovie}\n\n` +
      `Please check auditorium availability and confirm booking details!`;

    const waUrl = `https://wa.me/${CINEMA_INFO.phoneRaw}?text=${encodeURIComponent(
      waText
    )}`;

    if (typeof window !== "undefined") {
      window.open(waUrl, "_blank");
    }

    try {
      confetti({
        particleCount: 90,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#E1252C", "#FF5259", "#38B884", "#F59E0B"],
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
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider">
            <PartyPopper className="w-3.5 h-3.5" />
            <span>VIP Cinema Experience</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
            Book a Private Screening at <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-[#FF5259]">
              S3 Cineplex Manendragarh.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed font-normal">
            Host your next birthday, anniversary, or private group reunion in pure cinema luxury.
            Plush recliners, custom big-screen video tribute, and in-seat gourmet snacks.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#121217] border border-white/10 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#E1252C]/15 border border-[#E1252C]/30 flex items-center justify-center text-[#FF5259]">
              <Film className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Your Choice of Movie</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Screen the latest release, a Bollywood classic, or plug in your own home video/photos
              in glorious 4K Laser brilliance.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#121217] border border-white/10 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Big-Screen Tribute Video</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Surprise your birthday child, spouse, or college friends with a 2-minute personalized
              video tribute played right before the film starts.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#121217] border border-white/10 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#38B884]/15 border border-[#38B884]/30 flex items-center justify-center text-[#38B884]">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Gourmet Food Packages</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Fresh caramel popcorn tubs, gourmet pizzas, crispy samosas, and chilled beverages
              served right to your guests&apos; seats.
            </p>
          </div>
        </div>

        {/* Tier Packages */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Screening Packages
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Select the option that best fits your guest count and occasion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PRIVATE_SHOW_TIERS.map((tier) => {
              const isSelected = selectedTier === tier.id;
              return (
                <div
                  key={tier.id}
                  onClick={() => setSelectedTier(tier.id)}
                  className={`bg-[#121217] rounded-3xl p-6 sm:p-8 flex flex-col justify-between cursor-pointer transition-all duration-300 relative border-2 ${
                    tier.tag === "Most Popular"
                      ? "border-amber-400 shadow-2xl shadow-amber-400/20 -translate-y-2"
                      : isSelected
                      ? "border-white/60"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  {tier.tag && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-400 text-black font-mono font-bold text-[10px] uppercase tracking-wider shadow-md">
                      {tier.tag}
                    </div>
                  )}

                  <div className="space-y-6">
                    <div>
                      <span className="text-xs font-mono text-zinc-400 block uppercase font-bold">
                        {tier.capacity}
                      </span>
                      <h3 className="text-2xl font-extrabold text-white mt-1">{tier.name}</h3>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#1A1A22] border border-white/5 space-y-1">
                      <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                        {tier.price}
                      </div>
                      <div className="text-[11px] font-mono text-[#38B884]">
                        Includes auditorium rental &amp; staff
                      </div>
                    </div>

                    <ul className="space-y-2.5 text-xs text-zinc-300">
                      {tier.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
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
                          ? "bg-amber-400 text-black shadow-md shadow-amber-400/30"
                          : "bg-white/10 text-zinc-300 hover:text-white"
                      }`}
                    >
                      {isSelected ? "✓ Selected Package" : "Select Package"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Booking Inquiry Form */}
        <div className="max-w-2xl mx-auto bg-[#121217] border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          <div className="space-y-2 border-b border-white/10 pb-6">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Direct Manager Booking</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Reserve Your Private Slot
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400">
              Fill out your preferred event details to request availability. We&apos;ll open your
              booking request directly with the S3 manager on WhatsApp.
            </p>
          </div>

          {isSubmitted ? (
            <div className="p-8 text-center space-y-4 bg-[#1A1A22] rounded-2xl border border-amber-400/40 animate-in fade-in">
              <div className="w-14 h-14 rounded-full bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-white">Booking Request Dispatched!</h4>
              <p className="text-xs text-zinc-300 max-w-md mx-auto leading-relaxed">
                We have opened your pre-formatted WhatsApp chat with the S3 Cineplex team. Our manager
                will confirm hall slot availability and snack customization shortly.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold transition-colors"
              >
                Send Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitInquiry} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block font-bold">
                    Organizer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={organizerName}
                    onChange={(e) => setOrganizerName(e.target.value)}
                    placeholder="e.g. Vikram Agrawal"
                    className="w-full bg-[#1A1A22] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

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
                      className="w-full bg-[#1A1A22] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-xs sm:text-sm font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block font-bold">
                    Occasion Type
                  </label>
                  <select
                    value={occasionType}
                    onChange={(e) => setOccasionType(e.target.value)}
                    className="w-full bg-[#1A1A22] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    {occasionOptions.map((o) => (
                      <option key={o} value={o} className="bg-[#121217]">
                        {o}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block font-bold">
                    Target Date &amp; Approx Guests
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="bg-[#1A1A22] border border-white/10 rounded-xl px-2.5 py-3 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                    />
                    <input
                      type="number"
                      value={guestCount}
                      onChange={(e) => setGuestCount(e.target.value)}
                      placeholder="Guests"
                      className="bg-[#1A1A22] border border-white/10 rounded-xl px-3 py-3 text-xs font-mono text-white focus:outline-none focus:border-amber-400 text-center"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block font-bold">
                  Preferred Time Slot
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full bg-[#1A1A22] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  {slotOptions.map((s) => (
                    <option key={s} value={s} className="bg-[#121217]">
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block font-bold">
                  Movie or Media Preference
                </label>
                <input
                  type="text"
                  value={preferredMovie}
                  onChange={(e) => setPreferredMovie(e.target.value)}
                  placeholder="e.g. Current release, 3 Idiots, or Custom Tribute Video"
                  className="w-full bg-[#1A1A22] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-base shadow-lg shadow-amber-400/20 hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5 fill-black text-amber-400" />
                <span>Submit &amp; Open Manager WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-[10px] font-mono text-zinc-500 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#38B884]" />
                <span>Direct booking inquiry to {CINEMA_INFO.phone} • Zero booking markups</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
