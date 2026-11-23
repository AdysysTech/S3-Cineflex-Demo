"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink, QrCode, ChefHat, MonitorPlay, Sparkles } from "lucide-react";

export default function PitchDeckPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 12;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        setCurrentSlide((prev) => Math.min(totalSlides - 1, prev + 1));
      } else if (e.key === "ArrowLeft") {
        setCurrentSlide((prev) => Math.max(0, prev - 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [totalSlides]);

  const slides = [
    {
      id: 1,
      badge: "Exclusive Growth Proposal • Manendragarh, CG",
      title: "S3 Cineplex",
      subtitle: "Digital Revenue & Guest Experience Upgrade",
      lead: "Turn every recliner and seat into an instant high-margin revenue engine — with luxury metal QR food ordering, automated weekday seat-filling, and full customer data ownership.",
      stats: [
        { num: "60–80%", label: "Typical gross profit margin on cinema food & beverage sales" },
        { num: "0 Conflict", label: "Phase 1 runs 100% independently of your BookMyShow contract" },
        { num: "30–45 Days", label: "Estimated payback period from extra F&B, weekday fills & local ads" },
      ],
    },
    {
      id: 2,
      badge: "01 / Current Snapshot",
      title: "Strong Local Leader. Four Silent Revenue Leaks.",
      lead: "S3 Cineplex already owns the best cinema reputation in Manendragarh — fixing four operational gaps unlocks revenue already sitting inside your hall.",
      cards: [
        {
          title: "What You Already Won",
          items: [
            "4.2★ Top-Rated Cinema in Town (629+ Google & 643 Justdial ratings)",
            "Premium Comfort & Sound (plush recliners, crisp audio, hygienic counter)",
            "Strong Weekend Demand (3 daily shows: 12:30 PM, 4:00 PM, 8:00 PM)",
          ],
        },
        {
          title: "Where Money Is Leaking Today",
          items: [
            "Lost Mid-Movie Orders: Guests skip crowded interval counter lines",
            "Zero Customer Data: BookMyShow retains moviegoer phone numbers",
            "Quiet Mon–Thu Shows: Fixed AC & projector run on empty weekday seats",
            "No Official Web Presence: Missed local screen ads & private show inquiries",
          ],
        },
      ],
    },
    {
      id: 3,
      badge: "02 / Cinema Economics",
      title: "Tickets Fill the Room. Food & Data Build the Profit.",
      lead: "Instead of fighting BookMyShow on Day 1, we target the two highest-margin levers S3 Cineplex controls 100%.",
      economics: [
        { name: "Box Office Tickets", margin: "~45–55% Shared with Distributors", bar: "48%" },
        { name: "Food & Beverages (In-Seat QR Orders)", margin: "60–80% Margin (100% S3 Profit)", bar: "78%" },
        { name: "Screen Ads & Private Off-Time Screenings", margin: "85–95% Margin (Near Zero Incremental Cost)", bar: "92%" },
      ],
    },
    {
      id: 4,
      badge: "03 / Pillar One — In-Seat Ordering",
      title: "Luxury In-Seat Metal QR Food Ordering",
      lead: "Guests order hot snacks from their recliner without missing a scene — prepaid via UPI and routed straight to your counter screen.",
      steps: [
        { step: "01", title: "Scan Permanent Metal Plaque", desc: "Each armrest gets a custom printed metal QR plate pre-tagged (?seat=E12). Zero app download." },
        { step: "02", title: "Order 'Now' or 'At Interval'", desc: "1-tap UPI checkout (PhonePe/GPay/Paytm). Kitchen preps 10 mins early before lights turn on." },
        { step: "03", title: "Live Counter Tablet Dashboard", desc: "Orders chime instantly on counter tablet with seat number and PAID UPI status — zero cash errors." },
      ],
    },
    {
      id: 5,
      badge: "04 / Pillar Two — Customer Data & Retention",
      title: "Own Your Audience. Fill Empty Weekday Seats.",
      lead: "Turn one-time weekend visitors into repeat Tuesday & Wednesday customers with automated WhatsApp broadcasts.",
      features: [
        { num: "1", title: "Automatic Data Capture", desc: "Every QR food order saves guest name & WhatsApp number into S3's private CRM." },
        { num: "2", title: "Thursday New-Release Alerts", desc: "Auto-send Friday posters & showtimes to thousands of locals before they check BMS." },
        { num: "3", title: "Weekday Unsold Seat Offers", desc: "Push '₹50 OFF + Free Popcorn' coupons filling slow Mon–Thu shows with zero BMS conflict." },
      ],
    },
    {
      id: 6,
      badge: "05 / Pillar Three — Reputation Autopilot",
      title: "Turn Every Happy Guest Into a 5-Star Google Review",
      lead: "Catch moviegoers at peak excitement — right after the credits roll — to cement S3 Cineplex as the undisputed #1 venue in the region.",
      timeline: [
        { time: "SHOWTIME", text: "Guest orders snacks via seat QR. System logs the show slot automatically." },
        { time: "+2 HOURS", text: "Automated Post-Show WhatsApp Trigger: 'Hope you loved the movie! Tap once to rate S3 on Google.'" },
        { time: "1-TAP LINK", text: "Direct Google Review Box + optional ₹20-off popcorn coupon on next visit drives 5★ dominance." },
      ],
      rating: "4.2★ (629 reviews) → 4.6★+ (1,200+ target reviews)",
    },
    {
      id: 7,
      badge: "06 / Pillar Four — Official Web Hub & B2B Funnels",
      title: "One Official Website. Two Brand-New Revenue Streams.",
      lead: "Replace outdated web pages with a fast S3 Cineplex portal built to capture high-ticket local inquiries 24/7.",
      streams: [
        { title: "Advertise on Our Big Screen", desc: "15–30 sec pre-show & interval ads for coaching institutes, jewellers, clinics, and dealerships." },
        { title: "Off-Time Private Screenings", desc: "Monetize unused morning & late slots with private birthday shows, reunions, and custom snack hampers." },
      ],
    },
    {
      id: 8,
      badge: "07 / Smart Contract Strategy",
      title: "Zero Contract Risk Today. Direct Ticketing Ready Tomorrow.",
      lead: "We protect your existing BookMyShow listing while keeping the door open for zero-fee direct booking in Phase 2.",
      phases: [
        { phase: "Phase 1 (Immediate)", desc: "100% independent of BMS. Metal QR food ordering, WhatsApp CRM, and local ad funnels." },
        { phase: "Phase 2 (Optional Upgrade)", desc: "Direct zero-fee web ticketing synced with box-office POS after reviewing BMS agreement terms." },
      ],
    },
    {
      id: 9,
      badge: "08 / Financial Impact",
      title: "Grounded Numbers. Real Profit Inside 45 Days.",
      lead: "No 100%-housefull fantasies — even modest daily adoption comfortably pays back the entire system in Month 1–2.",
      kpis: [
        { title: "In-Seat QR F&B", val: "₹81k – ₹1.08L / mo", sub: "From just 15–20 extra daily snack orders" },
        { title: "Weekday Seat Filler", val: "₹28k+ / mo", sub: "Just 10 extra Mon–Thu tickets/day via WhatsApp" },
        { title: "Ads & Private Shows", val: "₹25k – ₹45k / mo", sub: "2–3 local screen ads + 1 private birthday/month" },
      ],
      total: "Total Projected Net Profit: ₹87,000 – ₹1.25L / month",
    },
    {
      id: 10,
      badge: "09 / Investment & Packages",
      title: "Choose Your Growth Package",
      lead: "Built for long-term reliability — your team runs the cinema while Adysys Tech manages the technology.",
      packages: [
        {
          name: "Starter • Foundation",
          price: "₹45,000",
          maint: "+ ₹6,000 / mo hosting & support",
          items: ["Mobile-First Website & Local SEO", "In-Seat QR Food App", "Pre-Interval Delivery Scheduler", "1-Tap UPI Gateway", "Live Kitchen Counter KDS"],
        },
        {
          name: "Growth • Full Revenue System (Recommended)",
          price: "₹75,000",
          maint: "+ ₹10,000 / mo managed growth",
          items: ["Everything in Starter", "Private Customer Database (CRM)", "Automated WhatsApp Friday Alerts & Weekday Offers", "Automated Post-Show Google Review Booster", "B2B Screen Ad & Private Show Funnels", "Weekly Showtime & Menu Management"],
        },
      ],
    },
    {
      id: 11,
      badge: "10 / Execution Plan",
      title: "Live Across Every Seat in 30 Days",
      lead: "Phased rollout designed so your daily shows keep running smoothly while we build, test, and train your staff.",
      weeks: [
        { w: "Week 01", title: "Discovery & Metal Plates", desc: "Finalize menu, seat map & approve custom metal QR plaque design for fabrication." },
        { w: "Week 02", title: "Core Platform Build", desc: "Build website, In-Seat QR web app, KDS counter screen, and WhatsApp CRM flow." },
        { w: "Week 03", title: "Staff Training & Soft Pilot", desc: "Install metal plates on premium recliner rows, train runners on KDS alerts, test weekend timing." },
        { w: "Week 04", title: "Full Launch & Campaigns", desc: "Full hall metal plate rollout, activate Google Review booster & first WhatsApp blast." },
      ],
    },
    {
      id: 12,
      badge: "11 / Let's Launch",
      title: "Let's Turn Every Seat Into a Profit Center.",
      lead: "Try our 30-second live QR-to-Kitchen demo right now — scan a sample seat tag on your phone and watch the order ping live on screen.",
      cta: {
        company: "Adysys Tech",
        email: "adysys.tech@outlook.com",
        phone: "+91 8718982504",
      },
    },
  ];

  const slide = slides[currentSlide];

  return (
    <div className="w-full min-h-screen bg-[#040406] text-white flex flex-col justify-between p-4 sm:p-8">
      {/* Top Deck Navigation */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between pb-4 border-b border-white/10">
        <Link
          href="/"
          className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Cineplex Home</span>
        </Link>

        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-[#FF5259] font-bold">
            Slide {String(currentSlide + 1).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}
          </span>

          <div className="flex items-center gap-2">
            <Link
              href="/order?seat=E12"
              target="_blank"
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1"
            >
              <QrCode className="w-3.5 h-3.5 text-[#FF5259]" />
              <span>Open Phone QR</span>
            </Link>

            <Link
              href="/kitchen"
              target="_blank"
              className="px-3 py-1.5 rounded-lg bg-[#38B884]/20 border border-[#38B884]/40 text-xs font-mono text-[#38B884] flex items-center gap-1"
            >
              <ChefHat className="w-3.5 h-3.5" />
              <span>Open KDS</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Slide Canvas (16:9 Cinema Aspect Card) */}
      <div className="max-w-6xl mx-auto w-full my-auto py-8">
        <div className="bg-[#09090C] border border-white/15 rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden min-h-[550px] flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#E1252C]/10 rounded-full filter blur-3xl pointer-events-none"></div>

          {/* Slide Header */}
          <div className="space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-[#E1252C]/20 border border-[#E1252C]/40 text-[#FF5259] text-xs font-mono font-bold uppercase tracking-wider">
              {slide.badge}
            </span>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {slide.title}
              {slide.subtitle && (
                <span className="block text-2xl sm:text-3xl text-[#FF5259] font-bold mt-2">
                  {slide.subtitle}
                </span>
              )}
            </h1>

            <p className="text-base sm:text-xl text-zinc-300 leading-relaxed max-w-3xl font-normal">
              {slide.lead}
            </p>
          </div>

          {/* Slide Dynamic Content Area */}
          <div className="py-6">
            {/* Slide 1 Stats */}
            {slide.stats && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                {slide.stats.map((s, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-[#121217] border border-white/10 space-y-2">
                    <div className="text-3xl sm:text-4xl font-extrabold text-[#FF5259] font-mono">
                      {s.num}
                    </div>
                    <div className="text-xs text-zinc-300 leading-relaxed">{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Slide 2 Cards */}
            {slide.cards && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {slide.cards.map((c, i) => (
                  <div
                    key={i}
                    className={`p-6 rounded-2xl border space-y-3 ${
                      i === 1 ? "bg-[#1A1113] border-[#E1252C]/50" : "bg-[#121217] border-white/10"
                    }`}
                  >
                    <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                      {c.title}
                    </h3>
                    <ul className="space-y-2 text-xs text-zinc-300">
                      {c.items.map((it, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <span className={i === 1 ? "text-[#FF5259]" : "text-[#38B884]"}>•</span>
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* Slide 3 Economics */}
            {slide.economics && (
              <div className="space-y-4">
                {slide.economics.map((ec, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[#121217] border border-white/10 space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="font-bold text-white">{ec.name}</span>
                      <span className="text-[#38B884] font-bold">{ec.margin}</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#E1252C] to-[#38B884]"
                        style={{ width: ec.bar }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Slide 4 Steps */}
            {slide.steps && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {slide.steps.map((st, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-[#121217] border border-white/10 space-y-2">
                    <div className="text-xs font-mono font-bold text-[#FF5259]">{st.step}</div>
                    <h4 className="text-base font-bold text-white">{st.title}</h4>
                    <p className="text-xs text-zinc-400">{st.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Slide 9 KPIs */}
            {slide.kpis && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {slide.kpis.map((kp, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-[#121217] border border-white/10 space-y-1">
                      <div className="text-xs font-mono text-zinc-400 uppercase">{kp.title}</div>
                      <div className="text-2xl font-bold text-[#FF5259] font-mono">{kp.val}</div>
                      <div className="text-[11px] text-zinc-500">{kp.sub}</div>
                    </div>
                  ))}
                </div>
                <div className="p-4 rounded-2xl bg-[#38B884]/20 border border-[#38B884]/40 text-center text-sm font-mono text-[#38B884] font-bold">
                  {slide.total}
                </div>
              </div>
            )}

            {/* Slide 10 Packages */}
            {slide.packages && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {slide.packages.map((pkg, i) => (
                  <div
                    key={i}
                    className={`p-6 sm:p-8 rounded-3xl border-2 space-y-4 ${
                      i === 1
                        ? "bg-[#1A1215] border-[#E1252C] shadow-xl"
                        : "bg-[#121217] border-white/10"
                    }`}
                  >
                    <div className="text-xs font-mono text-zinc-400 uppercase font-bold">
                      {pkg.name}
                    </div>
                    <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                      {pkg.price}
                    </div>
                    <div className="text-xs font-mono text-zinc-400">{pkg.maint}</div>
                    <ul className="space-y-2 text-xs text-zinc-300 pt-2 border-t border-white/10">
                      {pkg.items.map((it, j) => (
                        <li key={j} className="flex items-center gap-2">
                          <span className="text-[#38B884]">✓</span>
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* Slide 11 Weeks */}
            {slide.weeks && (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {slide.weeks.map((wk, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-[#121217] border border-white/10 space-y-2">
                    <div className="text-xs font-mono text-[#FF5259] font-bold">{wk.w}</div>
                    <h4 className="text-sm font-bold text-white">{wk.title}</h4>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">{wk.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Slide 12 CTA */}
            {slide.cta && (
              <div className="p-8 rounded-3xl bg-[#121217] border border-[#E1252C]/60 text-center space-y-4 max-w-xl mx-auto">
                <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
                  Technology &amp; Automation Partner
                </div>
                <div className="text-3xl font-extrabold text-white">{slide.cta.company}</div>
                <div className="text-sm font-mono text-[#FF5259]">{slide.cta.email}</div>
                <div className="pt-2 flex justify-center gap-3">
                  <Link
                    href="/order?seat=E12"
                    target="_blank"
                    className="px-6 py-3 rounded-xl bg-[#E1252C] hover:bg-[#FF5259] text-white font-bold text-xs"
                  >
                    Launch Live QR Order Demo
                  </Link>
                  <Link
                    href="/kitchen"
                    target="_blank"
                    className="px-6 py-3 rounded-xl bg-[#38B884] text-black font-bold text-xs"
                  >
                    Open Live KDS Counter
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Slide Footer */}
          <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-zinc-500">
            <span>S3 Cineplex Growth Blueprint • Manendragarh</span>
            <span>Use Left/Right arrow keys or buttons below</span>
          </div>
        </div>
      </div>

      {/* Bottom Slide Controller Bar */}
      <div className="max-w-md mx-auto w-full flex items-center justify-between gap-4 py-2">
        <button
          onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
          disabled={currentSlide === 0}
          className="px-5 py-2.5 rounded-xl bg-[#121217] border border-white/10 hover:border-white/30 text-xs font-mono text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          ← Previous
        </button>

        {/* Progress Dots */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalSlides }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === i ? "w-6 bg-[#E1252C]" : "w-2 bg-zinc-700 hover:bg-zinc-500"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            ></button>
          ))}
        </div>

        <button
          onClick={() => setCurrentSlide((prev) => Math.min(totalSlides - 1, prev + 1))}
          disabled={currentSlide === totalSlides - 1}
          className="px-5 py-2.5 rounded-xl bg-[#121217] border border-white/10 hover:border-white/30 text-xs font-mono text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
