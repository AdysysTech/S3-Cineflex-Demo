"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Film,
  Ticket,
  UtensilsCrossed,
  Sparkles,
  Tv,
  Star,
  MonitorPlay,
  Speaker,
  Armchair,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Heart,
} from "lucide-react";
import { MOVIES, UPCOMING_MOVIES, CINEMA_INFO } from "@/lib/data";

export default function HomePage() {
  const [movieTab, setMovieTab] = useState<"NOW_SHOWING" | "UPCOMING">("NOW_SHOWING");
  const nowShowingRef = useRef<HTMLDivElement>(null);
  const upcomingRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (ref: React.RefObject<HTMLDivElement | null>, direction: "left" | "right") => {
    if (ref.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full flex flex-col">
      {/* 1. Cinematic Hero Section - Atmospheric, allows backdrop to breathe before text */}
      <section className="relative min-h-[88vh] sm:min-h-[80vh] lg:min-h-[85vh] w-full flex flex-col justify-end overflow-hidden bg-[#09090C]">
        {/* Cinema Background Backdrop */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=85&w=2000"
            alt="S3 Cineplex Luxury Auditorium"
            fill
            priority
            className="object-cover object-center opacity-60 sm:opacity-40 scale-105 transform hover:scale-100 transition-transform duration-1000 ease-out"
          />
          {/* Multi-layer cinema vignette and atmospheric gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090C] via-[#09090C]/45 to-transparent sm:via-[#09090C]/75"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#09090C]/80 via-transparent to-transparent sm:via-[#09090C]/50"></div>
          <div className="absolute inset-0 cinema-grid-bg opacity-30 sm:opacity-40"></div>
          <div className="absolute inset-0 cinema-radial-glow opacity-80 pointer-events-none"></div>
        </div>

        {/* Hero Content - Placed with generous top breathing room so cinema ambiance shines first */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-44 sm:pt-28 pb-12 sm:pb-20 w-full">
          <div className="max-w-3xl space-y-6 text-center sm:text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#E1252C]/15 border border-[#E1252C]/40 text-[#FF5259] text-xs font-mono tracking-wider uppercase backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#E1252C] animate-ping"></span>
              <span>Premier 4K Laser &amp; Recliner Cinema</span>
            </div>

            {/* Hero Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] drop-shadow-2xl">
              Experience Cinema <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5259] via-[#E1252C] to-[#FF858A]">
                Like Never Before.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-zinc-300 leading-relaxed font-normal max-w-2xl drop-shadow-md">
              Welcome to <strong className="text-white">S3 Cineplex, Manendragarh</strong>.
              Crystal-clear 4K Laser projection, immersive Dolby Atmos surround sound, plush
              motorized recliners, and gourmet cinema food served fresh to your seat.
            </p>

            {/* Customer CTAs */}
            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4">
              <a
                href="#movies"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#E1252C] to-[#B8181E] hover:from-[#FF5259] hover:to-[#E1252C] text-white font-bold text-base shadow-lg shadow-[#E1252C]/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5"
              >
                <Ticket className="w-5 h-5" />
                <span>Book Tickets</span>
              </a>

              <Link
                href="/order"
                className="px-8 py-4 rounded-xl bg-[#121217]/90 hover:bg-[#1A1A22] border border-white/20 hover:border-[#FF5259]/60 text-white font-bold text-base backdrop-blur-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5"
              >
                <UtensilsCrossed className="w-5 h-5 text-[#FF5259]" />
                <span>Food &amp; Beverages</span>
              </Link>
            </div>

            {/* Quick Stats Trust Row */}
            <div className="pt-6 flex flex-wrap items-center justify-center sm:justify-start gap-6 text-xs text-zinc-400 font-mono">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-white font-bold">4.2★</span>
                <span>(629+ Google Reviews)</span>
              </div>
              <div className="hidden sm:block text-zinc-700">•</div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#FF5259]" />
                <span>Daily 12:30 PM • 4:00 PM • 8:00 PM</span>
              </div>
              <div className="hidden sm:block text-zinc-700">•</div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#38B884]" />
                <span>Dolby Atmos 7.1 Surround</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Facilities Strip */}
      <section className="border-y border-white/10 bg-[#121217]/90 py-10 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#1A1A22]/50 border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-[#E1252C]/15 border border-[#E1252C]/30 flex items-center justify-center text-[#FF5259] shrink-0">
                <MonitorPlay className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm sm:text-base">4K Laser Projection</h4>
                <p className="text-xs text-zinc-400">Ultra-bright, vivid color depth</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#1A1A22]/50 border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-[#E1252C]/15 border border-[#E1252C]/30 flex items-center justify-center text-[#FF5259] shrink-0">
                <Speaker className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm sm:text-base">Dolby Atmos Sound</h4>
                <p className="text-xs text-zinc-400">360° heart-thumping surround</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#1A1A22]/50 border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-[#E1252C]/15 border border-[#E1252C]/30 flex items-center justify-center text-[#FF5259] shrink-0">
                <Armchair className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm sm:text-base">VIP Plush Recliners</h4>
                <p className="text-xs text-zinc-400">160° motorized comfort</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#1A1A22]/50 border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-[#38B884]/15 border border-[#38B884]/30 flex items-center justify-center text-[#38B884] shrink-0">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm sm:text-base">In-Seat Dining</h4>
                <p className="text-xs text-zinc-400">Food delivered to your seat</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Movies Section with Tabs: Now Showing & Upcoming with Mobile Carousel */}
      <section id="movies" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header with Switcher Tabs & Carousel Nav Arrows */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 border-b border-white/10 pb-6 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#FF5259] mb-2">
              <span className="w-2 h-2 rounded-full bg-[#E1252C]"></span>
              <span>Cinematic Lineup</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Movies at S3 Cineplex
            </h2>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            {/* Toggle Tabs */}
            <div className="flex items-center gap-1.5 bg-[#121217] p-1.5 rounded-2xl border border-white/10">
              <button
                onClick={() => setMovieTab("NOW_SHOWING")}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                  movieTab === "NOW_SHOWING"
                    ? "bg-[#E1252C] text-white shadow-md shadow-[#E1252C]/30"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Film className="w-4 h-4" />
                <span>Now Showing ({MOVIES.length})</span>
              </button>

              <button
                id="upcoming"
                onClick={() => setMovieTab("UPCOMING")}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                  movieTab === "UPCOMING"
                    ? "bg-[#E1252C] text-white shadow-md shadow-[#E1252C]/30"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Upcoming ({UPCOMING_MOVIES.length})</span>
              </button>
            </div>

            {/* Desktop / Tablet Scroll Arrows */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={() =>
                  scrollCarousel(
                    movieTab === "NOW_SHOWING" ? nowShowingRef : upcomingRef,
                    "left"
                  )
                }
                className="p-2.5 rounded-xl bg-[#121217] hover:bg-[#1A1A22] border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  scrollCarousel(
                    movieTab === "NOW_SHOWING" ? nowShowingRef : upcomingRef,
                    "right"
                  )
                }
                className="p-2.5 rounded-xl bg-[#121217] hover:bg-[#1A1A22] border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Swipe Hint */}
        <div className="sm:hidden flex items-center justify-between text-[11px] font-mono text-zinc-400 pb-3 -mt-2">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E1252C] animate-pulse"></span>
            Swipe horizontally to browse cards
          </span>
          <span className="text-[#FF5259] font-bold">Swipe ➔</span>
        </div>

        {/* Tab 1: Now Showing Movies Carousel (Swipeable on mobile, grid on desktop) */}
        {movieTab === "NOW_SHOWING" && (
          <div
            ref={nowShowingRef}
            className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar gap-4 sm:gap-6 lg:gap-8 pb-4 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4"
          >
            {MOVIES.map((movie) => (
              <div
                key={movie.id}
                className="w-[78vw] max-w-[280px] shrink-0 snap-center sm:w-auto sm:max-w-none group bg-[#121217] border border-white/10 hover:border-[#E1252C]/60 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col hover:-translate-y-2"
              >
                {/* Poster Container */}
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#1A1A22]">
                  <Image
                    src={movie.poster}
                    alt={movie.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121217] via-transparent to-transparent opacity-90"></div>

                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/20 text-white font-mono font-bold text-xs shadow-lg">
                    {movie.rating}
                  </div>

                  {/* Format pill */}
                  <div className="absolute top-4 left-4 px-2.5 py-1 rounded-lg bg-[#E1252C]/80 backdrop-blur-md text-white font-mono font-semibold text-[10px] uppercase tracking-wider">
                    {movie.language}
                  </div>

                  {/* Booking CTA button - easily tappable on mobile & desktop */}
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end">
                    <Link
                      href={`/book/${movie.id}`}
                      className="w-full py-3 rounded-xl bg-[#E1252C] hover:bg-[#FF5259] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#E1252C]/40 transition-colors"
                    >
                      <Ticket className="w-4 h-4" />
                      <span>Book Tickets</span>
                    </Link>
                  </div>
                </div>

                {/* Movie Info */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#FF5259] transition-colors line-clamp-1 mb-1">
                      {movie.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mb-3">{movie.genre}</p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-zinc-500" />
                      {movie.duration}
                    </span>
                    <Link
                      href={`/book/${movie.id}`}
                      className="text-[#FF5259] hover:underline flex items-center gap-0.5 font-sans font-bold"
                    >
                      <span>Showtimes</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Upcoming Releases Carousel (Swipeable on mobile, grid on desktop) */}
        {movieTab === "UPCOMING" && (
          <div
            ref={upcomingRef}
            className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar gap-4 sm:gap-6 lg:gap-8 pb-4 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 animate-in fade-in duration-300"
          >
            {UPCOMING_MOVIES.map((movie) => (
              <div
                key={movie.id}
                className="w-[78vw] max-w-[280px] shrink-0 snap-center sm:w-auto sm:max-w-none group bg-[#121217] border border-white/10 hover:border-amber-400/50 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col hover:-translate-y-2"
              >
                {/* Poster Container */}
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#1A1A22]">
                  <Image
                    src={movie.poster}
                    alt={movie.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121217] via-transparent to-transparent opacity-90"></div>

                  {/* Release Date Badge */}
                  <div className="absolute top-4 right-4 px-2.5 py-1 rounded-lg bg-amber-500/90 text-black font-mono font-bold text-xs shadow-lg">
                    {movie.releaseDate}
                  </div>

                  {/* Format pill */}
                  <div className="absolute top-4 left-4 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white font-mono font-semibold text-[10px] uppercase tracking-wider">
                    Coming Soon
                  </div>
                </div>

                {/* Movie Info */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1 mb-1">
                      {movie.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mb-3">{movie.genre}</p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-zinc-400">
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{movie.releaseDate}</span>
                    </span>
                    <span className="text-[11px] text-zinc-500">Advance Soon</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Customer-Friendly Food & Concessions Showcase */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#17171E] via-[#1A1A22] to-[#121217] border border-white/10 shadow-2xl p-8 sm:p-12 lg:p-16">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#E1252C]/15 rounded-full filter blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E1252C]/20 border border-[#E1252C]/40 text-[#FF5259] text-xs font-mono uppercase tracking-wider">
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span>Gourmet Cinema Dining</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Skip the Interval Lines. <br />
                <span className="text-[#FF5259]">Food Delivered to Your Recliner.</span>
              </h2>

              <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-xl">
                Enjoy hot, fresh cinematic treats without missing a moment of the film. Order our
                signature butter caramel popcorn, loaded cheese nachos, oven-fresh pizzas, crispy
                samosas, and chilled beverages delivered straight to your seat.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3.5 rounded-xl bg-[#121217] border border-white/10">
                  <div className="font-mono text-[#38B884] font-bold text-xs uppercase mb-1">
                    Flexible Delivery
                  </div>
                  <div className="text-white text-sm font-semibold">Now or At Interval</div>
                  <div className="text-[11px] text-zinc-400">Prepped fresh when you want it</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#121217] border border-white/10">
                  <div className="font-mono text-[#FF5259] font-bold text-xs uppercase mb-1">
                    Instant UPI
                  </div>
                  <div className="text-white text-sm font-semibold">GPay / PhonePe / Paytm</div>
                  <div className="text-[11px] text-zinc-400">Fast 1-tap cashless checkout</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#121217] border border-white/10">
                  <div className="font-mono text-amber-400 font-bold text-xs uppercase mb-1">
                    Special Offers
                  </div>
                  <div className="text-white text-sm font-semibold">Code: S3TUE50</div>
                  <div className="text-[11px] text-zinc-400">₹50 OFF on cinema snacks</div>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  href="/order"
                  className="px-8 py-4 rounded-xl bg-[#E1252C] hover:bg-[#FF5259] text-white font-bold text-base shadow-lg shadow-[#E1252C]/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <span>Explore Menu &amp; Order Food</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Food Imagery Grid */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1585647347384-2593bc35786b?auto=format&fit=crop&q=80&w=500"
                    alt="Caramel Popcorn"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3 text-xs font-bold text-white">
                    Caramel Popcorn (L) • ₹160
                  </div>
                </div>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=500"
                    alt="Margherita Pizza"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3 text-xs font-bold text-white">
                    8&quot; Margherita Pizza • ₹299
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1601050690294-397f3c324515?auto=format&fit=crop&q=80&w=500"
                    alt="Crispy Samosa"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3 text-xs font-bold text-white">
                    Crispy Samosas • ₹80
                  </div>
                </div>
                <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&q=80&w=500"
                    alt="Cold Coffee"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3 text-xs font-bold text-white">
                    Cold Coffee Blast • ₹130
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Special Cinema Services Cards */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-mono uppercase tracking-wider mb-3">
            <span>Special Experiences</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            More at S3 Cineplex
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-2">
            From private birthday screenings to big-screen brand promotions in Manendragarh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Private Shows */}
          <div className="group relative bg-[#121217] border border-white/10 hover:border-amber-400/60 rounded-3xl p-8 sm:p-10 transition-all duration-300 flex flex-col justify-between shadow-xl hover:-translate-y-1">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-zinc-300 font-semibold uppercase">
                  VIP Celebrations
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                Private Screenings &amp; Birthdays
              </h3>
              <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                Book our luxury auditorium for private birthday parties, anniversaries, school/college
                groups, or corporate meets. Includes customized on-screen video tribute.
              </p>

              <div className="space-y-2 mb-8 text-xs font-mono text-zinc-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#38B884]" />
                  <span>Up to 30, 75, or 150+ guests with custom snack packages</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#38B884]" />
                  <span>Packages start at ₹4,999 with popcorn and drinks included</span>
                </div>
              </div>
            </div>

            <Link
              href="/private-shows"
              className="w-full py-4 rounded-xl bg-white/10 hover:bg-amber-500 text-white font-bold text-sm text-center transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-amber-500/30"
            >
              <span>Book a Private Screening</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Card 2: On-Screen Advertising */}
          <div className="group relative bg-[#121217] border border-white/10 hover:border-[#FF5259]/60 rounded-3xl p-8 sm:p-10 transition-all duration-300 flex flex-col justify-between shadow-xl hover:-translate-y-1">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#E1252C]/15 border border-[#E1252C]/30 flex items-center justify-center text-[#FF5259]">
                  <Tv className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-zinc-300 font-semibold uppercase">
                  Local Brand Reach
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                Advertise on Our Big Screen
              </h3>
              <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                Showcase your business to 4,500+ local customers every month with 15-second or
                30-second pre-show and interval slides. 100% captive cinema attention.
              </p>

              <div className="space-y-2 mb-8 text-xs font-mono text-zinc-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#38B884]" />
                  <span>Trusted by local coaching institutes, jewellers, clinics &amp; showrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#38B884]" />
                  <span>Packages start at just ₹3,500/month (~₹38 per show)</span>
                </div>
              </div>
            </div>

            <Link
              href="/advertise"
              className="w-full py-4 rounded-xl bg-white/10 hover:bg-[#E1252C] text-white font-bold text-sm text-center transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-[#E1252C]/30"
            >
              <span>Explore Advertising Packages</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. About S3 Cineplex Gallery & Regional Leadership */}
      <section className="py-20 bg-[#040406] border-t border-white/10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#FF5259] mb-3">
                <span>Manendragarh (Chhattisgarh)</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
                Manendragarh&apos;s Leading Cinema Destination
              </h2>
              <p className="text-zinc-300 text-base leading-relaxed mb-6">
                Centrally located near Tehsil Office on Civil Lines Road, Moharpara, S3 Cineplex
                leads the region with 4.2★ customer satisfaction ratings. We combine metro-quality
                multiplex luxury with warm hospitality and hygienic dining.
              </p>

              <div className="grid grid-cols-2 gap-4 text-xs font-mono text-zinc-300">
                <div className="p-4 rounded-xl bg-[#121217] border border-white/10">
                  <div className="text-2xl font-bold text-white mb-0.5">4K</div>
                  <div className="text-zinc-400">High-Brilliance Laser</div>
                </div>
                <div className="p-4 rounded-xl bg-[#121217] border border-white/10">
                  <div className="text-2xl font-bold text-[#FF5259] mb-0.5">7.1</div>
                  <div className="text-zinc-400">Dolby Atmos Surround</div>
                </div>
                <div className="p-4 rounded-xl bg-[#121217] border border-white/10">
                  <div className="text-2xl font-bold text-[#38B884] mb-0.5">100%</div>
                  <div className="text-zinc-400">Fresh In-Seat Dining</div>
                </div>
                <div className="p-4 rounded-xl bg-[#121217] border border-white/10">
                  <div className="text-2xl font-bold text-amber-400 mb-0.5">160°</div>
                  <div className="text-zinc-400">Motorized Recliner Angle</div>
                </div>
              </div>
            </div>

            {/* Gallery Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=600"
                    alt="S3 Cineplex Auditorium"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3 text-xs font-bold text-white">
                    Plush Recliner Hall
                  </div>
                </div>
                <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1585647347384-2593bc35786b?auto=format&fit=crop&q=80&w=600"
                    alt="Gourmet Caramel Popcorn"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3 text-xs font-bold text-white">
                    Gourmet Caramel Popcorn
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1574267432553-4b462808152f?auto=format&fit=crop&q=80&w=600"
                    alt="Cinema Snack Counter"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3 text-xs font-bold text-white">
                    Modern Concession Foyer
                  </div>
                </div>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=600"
                    alt="4K Laser Screen"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3 text-xs font-bold text-white">
                    Curved Panoramic Screen
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
