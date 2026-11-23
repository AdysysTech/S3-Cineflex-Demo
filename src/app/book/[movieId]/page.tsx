"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Ticket,
  Armchair,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  UtensilsCrossed,
  Tag,
  X,
  CreditCard,
  QrCode,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import confetti from "canvas-confetti";
import { MOVIES, UPCOMING_MOVIES, SEAT_TIERS, COUPONS, CINEMA_INFO } from "@/lib/data";
import { SeatTier, Coupon } from "@/lib/types";
import { formatINR } from "@/lib/utils";

const ROWS_CONFIG = [
  { row: "I", tier: "RECLINER" as SeatTier, price: 350 },
  { row: "H", tier: "RECLINER" as SeatTier, price: 350 },
  { row: "G", tier: "EXECUTIVE" as SeatTier, price: 220 },
  { row: "F", tier: "EXECUTIVE" as SeatTier, price: 220 },
  { row: "E", tier: "EXECUTIVE" as SeatTier, price: 220 },
  { row: "D", tier: "EXECUTIVE" as SeatTier, price: 220 },
  { row: "C", tier: "REGULAR" as SeatTier, price: 150 },
  { row: "B", tier: "REGULAR" as SeatTier, price: 150 },
  { row: "A", tier: "REGULAR" as SeatTier, price: 150 },
];

const SEATS_PER_ROW = 14;

export default function BookMoviePage() {
  const params = useParams();
  const router = useRouter();
  const movieId = params.movieId as string;

  const movie = useMemo(() => {
    const allMovies = [...MOVIES, ...UPCOMING_MOVIES];
    return allMovies.find((m) => m.id === movieId) || MOVIES[0];
  }, [movieId]);

  const [selectedShowtime, setSelectedShowtime] = useState<string>(movie.showtimes[0]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>(["E12"]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  // Payment modal state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPaymentApp, setSelectedPaymentApp] = useState<"PhonePe" | "GPay" | "Paytm">("PhonePe");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState("");

  // Pre-seeded occupied seats generator (stable for the session)
  const occupiedSeats = useMemo(() => {
    const occupied = new Set<string>();
    // Pre-seed realistic realistic occupied seats
    const defaultOccupied = [
      "A3", "A4", "B7", "B8", "C1", "C2", "D5", "D6", "D7",
      "E5", "E6", "F9", "F10", "F11", "G3", "G4", "H6", "H7", "I8", "I9"
    ];
    defaultOccupied.forEach((s) => occupied.add(s));
    return occupied;
  }, []);

  // Calculate pricing breakdown
  const seatDetails = useMemo(() => {
    return selectedSeats.map((seatId) => {
      const rowChar = seatId[0];
      const rowConf = ROWS_CONFIG.find((r) => r.row === rowChar);
      return {
        id: seatId,
        tier: rowConf?.tier || "REGULAR",
        price: rowConf?.price || 150,
      };
    });
  }, [selectedSeats]);

  const subtotal = useMemo(() => {
    return seatDetails.reduce((sum, item) => sum + item.price, 0);
  }, [seatDetails]);

  const convenienceFee = selectedSeats.length > 0 ? 30 : 0;

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discountType === "FIXED") {
      return appliedCoupon.discountValue;
    }
    if (appliedCoupon.discountType === "PERCENTAGE") {
      return Math.round((subtotal * appliedCoupon.discountValue) / 100);
    }
    return 0;
  }, [appliedCoupon, subtotal]);

  const grandTotal = Math.max(0, subtotal + convenienceFee - discountAmount);

  const toggleSeat = (seatId: string) => {
    if (occupiedSeats.has(seatId)) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      if (selectedSeats.length >= 10) {
        alert("Maximum 10 seats allowed per booking.");
        return;
      }
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply || couponCode).trim().toUpperCase();
    setCouponError("");

    if (!code) {
      setCouponError("Please enter a promo code.");
      return;
    }

    const found = COUPONS.find((c) => c.code.toUpperCase() === code);
    if (!found) {
      setCouponError("Invalid promo code. Try S3TUE50 or S3WELCOME.");
      return;
    }

    if (found.minOrderValue && subtotal < found.minOrderValue) {
      setCouponError(`Min ticket value of ₹${found.minOrderValue} required for ${found.code}.`);
      return;
    }

    setAppliedCoupon(found);
    setCouponCode(found.code);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }
    setIsCheckoutOpen(true);
  };

  const handlePay = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setIsCheckoutOpen(false);
      const generatedId = `S3-${Math.floor(100000 + Math.random() * 900000)}`;
      setBookingId(generatedId);
      setBookingConfirmed(true);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#E1252C", "#FF5259", "#38B884", "#FFFFFF"],
        });
      } catch (err) {
        console.warn("Confetti error:", err);
      }
    }, 1500);
  };

  // The primary seat to carry over to In-Seat food ordering
  const primarySeat = selectedSeats[0] || "E12";

  return (
    <div className="w-full min-h-screen bg-[#09090C] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Breadcrumb & Movie Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/#movies"
              className="p-2.5 rounded-xl bg-[#121217] border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white transition-all flex items-center gap-2 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Movies</span>
            </Link>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                {movie.title}
              </h1>
              <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono mt-1">
                <span className="text-[#FF5259] font-bold">{movie.rating}</span>
                <span>•</span>
                <span>{movie.duration}</span>
                <span>•</span>
                <span>{movie.format}</span>
              </div>
            </div>
          </div>

          {/* Showtime Selector */}
          <div className="flex items-center gap-2 bg-[#121217] p-1.5 rounded-2xl border border-white/10">
            <span className="text-xs font-mono text-zinc-400 px-3 hidden sm:inline">
              Today&apos;s Shows:
            </span>
            {movie.showtimes.map((slot) => (
              <button
                key={slot}
                onClick={() => setSelectedShowtime(slot)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all ${
                  selectedShowtime === slot
                    ? "bg-[#E1252C] text-white shadow-md shadow-[#E1252C]/30 scale-105"
                    : "text-zinc-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* If Booking is Confirmed: Show Confirmed E-Ticket View */}
        {bookingConfirmed ? (
          <div className="max-w-2xl mx-auto py-8 space-y-8 animate-in fade-in zoom-in-95 duration-300">
            {/* Success Alert Header */}
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#38B884]/20 border-2 border-[#38B884] flex items-center justify-center text-[#38B884] mx-auto shadow-emerald-glow">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Booking Confirmed!
              </h2>
              <p className="text-sm text-zinc-400 font-mono">
                Booking Reference: <strong className="text-white">{bookingId}</strong>
              </p>
            </div>

            {/* Realistic Digital E-Ticket Card */}
            <div className="bg-gradient-to-b from-[#1A1A22] via-[#121217] to-[#121217] border-2 border-[#E1252C]/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#9E1117] via-[#E1252C] to-[#FF5259]"></div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-white/10 gap-4">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#FF5259] uppercase block font-bold">
                    Official S3 E-Ticket
                  </span>
                  <h3 className="text-2xl font-extrabold text-white">{movie.title}</h3>
                  <p className="text-xs text-zinc-400 font-mono mt-0.5">
                    {movie.language} • {movie.format}
                  </p>
                </div>
                <div className="text-right sm:text-right">
                  <div className="text-xs font-mono text-zinc-400">Total Paid</div>
                  <div className="text-2xl font-extrabold text-[#38B884] font-mono">
                    {formatINR(grandTotal)}
                  </div>
                  <div className="text-[10px] font-mono text-zinc-500">PAID VIA UPI</div>
                </div>
              </div>

              {/* Ticket Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-white/10 font-mono">
                <div>
                  <span className="text-[11px] text-zinc-500 uppercase block">Showtime</span>
                  <span className="text-white font-bold text-sm">{selectedShowtime}</span>
                  <span className="text-[10px] text-[#FF5259] block">Today</span>
                </div>
                <div>
                  <span className="text-[11px] text-zinc-500 uppercase block">Cinema</span>
                  <span className="text-white font-bold text-sm">S3 Cineplex</span>
                  <span className="text-[10px] text-zinc-400 block">Screen 1 (Laser)</span>
                </div>
                <div>
                  <span className="text-[11px] text-zinc-500 uppercase block">Seats ({selectedSeats.length})</span>
                  <span className="text-[#FF5259] font-bold text-base">
                    {selectedSeats.join(", ")}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-zinc-500 uppercase block">Ticket ID</span>
                  <span className="text-white font-bold text-sm">{bookingId}</span>
                </div>
              </div>

              {/* Scannable QR & Pre-order Banner */}
              <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-2xl shadow-lg shrink-0">
                    <QRCodeSVG
                      value={`S3-TICKET:${bookingId}:SEATS:${selectedSeats.join("-")}:${selectedShowtime}`}
                      size={90}
                      level="M"
                    />
                  </div>
                  <div className="text-xs text-zinc-300 space-y-1">
                    <p className="font-bold text-white uppercase tracking-wider text-[11px]">
                      Gate Verification QR
                    </p>
                    <p className="text-zinc-400 text-[11px] max-w-[200px]">
                      Show this scannable digital pass at the entrance of S3 Cineplex.
                    </p>
                  </div>
                </div>

                {/* THE DEMO HIGHLIGHT CTA: Carry seat directly into In-Seat Food Ordering */}
                <Link
                  href={`/order?seat=${primarySeat}`}
                  className="w-full sm:w-auto px-6 py-4 rounded-xl bg-gradient-to-r from-[#E1252C] to-[#B8181E] hover:from-[#FF5259] hover:to-[#E1252C] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#E1252C]/30 hover:scale-105 active:scale-95 transition-all text-center"
                >
                  <UtensilsCrossed className="w-4 h-4 text-white" />
                  <span>Pre-Order Snacks to Seat {primarySeat} →</span>
                </Link>
              </div>
            </div>

            {/* Back to Home CTA */}
            <div className="text-center pt-2">
              <Link
                href="/"
                className="text-xs font-mono text-zinc-400 hover:text-white hover:underline"
              >
                Return to Home Page
              </Link>
            </div>
          </div>
        ) : (
          /* Normal Interactive Seat Map + Summary Flow */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Seat Map Container */}
            <div className="lg:col-span-8 bg-[#121217] border border-white/10 rounded-3xl p-4 sm:p-8 shadow-2xl relative overflow-hidden">
              {/* Curved Cinema Screen */}
              <div className="mb-14 relative flex flex-col items-center">
                <div className="w-4/5 h-8 sm:h-12 border-t-[6px] sm:border-t-[8px] border-[#E1252C] cinema-screen-glow rounded-[50%/15px]"></div>
                <div className="text-[11px] font-mono tracking-[0.4em] uppercase text-zinc-500 mt-2 font-bold">
                  All Eyes This Way • 4K Laser Screen
                </div>
              </div>

              {/* Seat Matrix */}
              <div className="overflow-x-auto pb-6 scrollbar-hide">
                <div className="min-w-[620px] max-w-2xl mx-auto flex flex-col gap-2.5 items-center">
                  {ROWS_CONFIG.map((rowConf, rIdx) => {
                    const isReclinerRow = rowConf.tier === "RECLINER";
                    const isTierDivider = rIdx === 1 || rIdx === 5;

                    return (
                      <React.Fragment key={rowConf.row}>
                        <div className="flex items-center gap-3 w-full justify-center">
                          {/* Left Row Label */}
                          <span className="w-5 text-center font-mono font-bold text-xs text-zinc-500">
                            {rowConf.row}
                          </span>

                          {/* Seats In Row */}
                          <div className="flex gap-1.5 sm:gap-2">
                            {Array.from({ length: SEATS_PER_ROW }, (_, i) => {
                              const seatNum = i + 1;
                              const seatId = `${rowConf.row}${seatNum}`;
                              const isOccupied = occupiedSeats.has(seatId);
                              const isSelected = selectedSeats.includes(seatId);
                              const isAisleGap = seatNum === 7;

                              return (
                                <button
                                  key={seatId}
                                  onClick={() => toggleSeat(seatId)}
                                  disabled={isOccupied}
                                  title={`${seatId} - ${rowConf.tier} (₹${rowConf.price})`}
                                  className={`h-8 rounded-t-lg rounded-b flex items-center justify-center font-mono text-[10px] font-bold transition-all ${
                                    isReclinerRow ? "w-9 sm:w-10 border-t-2 border-amber-500/50" : "w-7 sm:w-8"
                                  } ${
                                    isAisleGap ? "mr-4 sm:mr-8" : ""
                                  } ${
                                    isOccupied
                                      ? "bg-[#1A1A22] text-zinc-700 cursor-not-allowed border border-white/5 opacity-50"
                                      : isSelected
                                      ? "bg-[#E1252C] text-white shadow-lg shadow-[#E1252C]/50 scale-110 border border-white/30"
                                      : "bg-[#1A1A22] hover:bg-zinc-700 text-zinc-300 hover:text-white border border-white/10"
                                  }`}
                                >
                                  {isOccupied ? "✕" : seatNum}
                                </button>
                              );
                            })}
                          </div>

                          {/* Right Row Label */}
                          <span className="w-5 text-center font-mono font-bold text-xs text-zinc-500">
                            {rowConf.row}
                          </span>
                        </div>

                        {/* Tier Divider Banner */}
                        {isTierDivider && (
                          <div className="w-full my-2 border-b border-white/10 flex justify-center">
                            <span className="px-3 py-0.5 rounded-full bg-[#1A1A22] text-[10px] font-mono text-zinc-400 uppercase tracking-widest relative -bottom-2.5">
                              {rIdx === 1 ? "Executive Prime (₹220)" : "Regular Classic (₹150)"}
                            </span>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Recliner Top Tier Banner */}
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-xs font-mono text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Rows H &amp; I: VIP Plush Motorized Recliners (₹350) with swivel food table</span>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-6 border-t border-white/10 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[#1A1A22] border border-white/20"></div>
                  <span className="text-zinc-400">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[#E1252C] shadow-md shadow-[#E1252C]/40"></div>
                  <span className="text-white font-bold">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[#1A1A22] text-zinc-600 flex items-center justify-center text-[10px] opacity-60">
                    ✕
                  </div>
                  <span className="text-zinc-600">Occupied</span>
                </div>
              </div>
            </div>

            {/* Right Booking Summary & Checkout Panel */}
            <div className="lg:col-span-4 bg-[#121217] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl sticky top-28 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-[#FF5259]" />
                  <span>Booking Summary</span>
                </h3>
                <span className="text-xs font-mono text-zinc-400">{selectedShowtime}</span>
              </div>

              {selectedSeats.length === 0 ? (
                <div className="py-12 text-center text-zinc-500 space-y-3">
                  <Armchair className="w-12 h-12 mx-auto text-zinc-700" />
                  <p className="text-sm font-medium">Click on seats to add them to your booking</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Selected Seats Badges */}
                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-2 font-bold">
                      Selected Seats ({selectedSeats.length})
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {seatDetails.map((seat) => (
                        <span
                          key={seat.id}
                          className="px-2.5 py-1 rounded-lg bg-[#E1252C]/20 border border-[#E1252C]/40 text-white font-mono text-xs font-bold flex items-center gap-1.5"
                        >
                          <span>{seat.id}</span>
                          <span className="text-[10px] text-zinc-400">({seat.tier.slice(0, 3)})</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Coupon Code Section */}
                  <div className="pt-2 border-t border-white/10">
                    <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-2 font-bold">
                      Offers &amp; Promo Codes
                    </label>

                    {appliedCoupon ? (
                      <div className="p-3 rounded-xl bg-[#38B884]/15 border border-[#38B884]/40 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-mono font-bold text-[#38B884] flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5" />
                            <span>{appliedCoupon.code} APPLIED</span>
                          </div>
                          <div className="text-[11px] text-zinc-300 mt-0.5">
                            {appliedCoupon.title}
                          </div>
                        </div>
                        <button
                          onClick={removeCoupon}
                          className="text-xs text-zinc-400 hover:text-white p-1"
                          aria-label="Remove coupon"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            placeholder="Try S3TUE50 or S3WELCOME"
                            className="flex-1 bg-[#1A1A22] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-[#E1252C]"
                          />
                          <button
                            onClick={() => handleApplyCoupon()}
                            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold transition-colors"
                          >
                            Apply
                          </button>
                        </div>
                        {couponError && (
                          <div className="text-[11px] font-mono text-[#FF5259] flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{couponError}</span>
                          </div>
                        )}

                        {/* Coupon suggestion chips */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          <button
                            onClick={() => handleApplyCoupon("S3TUE50")}
                            className="text-[10px] font-mono px-2 py-1 rounded bg-[#23232D] text-zinc-300 hover:text-white hover:bg-[#E1252C]/20 border border-white/5 transition-colors"
                          >
                            ⚡ S3TUE50 (₹50 OFF + Popcorn)
                          </button>
                          <button
                            onClick={() => handleApplyCoupon("S3WELCOME")}
                            className="text-[10px] font-mono px-2 py-1 rounded bg-[#23232D] text-zinc-300 hover:text-white hover:bg-[#E1252C]/20 border border-white/5 transition-colors"
                          >
                            🎟️ S3WELCOME (15% OFF)
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-2 pt-4 border-t border-white/10 text-xs font-mono">
                    <div className="flex justify-between text-zinc-300">
                      <span>Ticket Subtotal</span>
                      <span>{formatINR(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Cinema Tech Fee</span>
                      <span>{formatINR(convenienceFee)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-[#38B884] font-bold">
                        <span>Promo Discount ({appliedCoupon?.code})</span>
                        <span>-{formatINR(discountAmount)}</span>
                      </div>
                    )}
                    <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
                      <span className="text-sm font-bold text-white font-sans">Total Amount</span>
                      <span className="text-2xl font-extrabold text-white font-mono">
                        {formatINR(grandTotal)}
                      </span>
                    </div>
                  </div>

                  {/* Proceed to Checkout CTA */}
                  <button
                    onClick={handleProceedToPayment}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#E1252C] to-[#B8181E] hover:from-[#FF5259] hover:to-[#E1252C] text-white font-bold text-base shadow-lg shadow-[#E1252C]/30 hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Pay {formatINR(grandTotal)}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <div className="text-center text-[11px] font-mono text-zinc-500 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#38B884]" />
                    <span>Instant UPI confirmation &amp; scannable pass</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mock UPI Checkout Modal */}
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-[#121217] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative">
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close checkout"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#38B884]/20 border border-[#38B884]/40 flex items-center justify-center text-[#38B884]">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">1-Tap Fast Checkout</h3>
                  <p className="text-xs font-mono text-zinc-400">
                    S3 Cineplex • Manendragarh
                  </p>
                </div>
              </div>

              {/* Order Brief */}
              <div className="p-3.5 rounded-2xl bg-[#1A1A22] border border-white/10 text-xs font-mono space-y-1.5">
                <div className="flex justify-between text-zinc-300">
                  <span>Movie</span>
                  <span className="font-bold text-white">{movie.title}</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>Seats</span>
                  <span className="text-[#FF5259] font-bold">{selectedSeats.join(", ")}</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>Showtime</span>
                  <span>{selectedShowtime} Today</span>
                </div>
                <div className="flex justify-between text-white font-bold pt-2 border-t border-white/10 text-sm">
                  <span>Total Payable</span>
                  <span className="text-[#38B884]">{formatINR(grandTotal)}</span>
                </div>
              </div>

              {/* UPI Selector */}
              <div>
                <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-2 font-bold">
                  Select Demo UPI App
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {(["PhonePe", "GPay", "Paytm"] as const).map((app) => (
                    <button
                      key={app}
                      type="button"
                      onClick={() => setSelectedPaymentApp(app)}
                      className={`p-3 rounded-xl border text-xs font-mono font-bold flex flex-col items-center gap-1.5 transition-all ${
                        selectedPaymentApp === app
                          ? "bg-[#E1252C]/15 border-[#E1252C] text-white shadow-md shadow-[#E1252C]/20"
                          : "bg-[#1A1A22] border-white/10 text-zinc-400 hover:text-white"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-current"></span>
                      <span>{app}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handlePay}
                disabled={isProcessingPayment}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#38B884] to-[#249164] hover:from-[#4ade80] hover:to-[#38B884] text-white font-bold text-base shadow-lg shadow-emerald-glow transition-all flex items-center justify-center gap-2"
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing UPI Payment...</span>
                  </>
                ) : (
                  <>
                    <span>Pay {formatINR(grandTotal)} via {selectedPaymentApp}</span>
                  </>
                )}
              </button>

              <p className="text-center text-[10px] font-mono text-zinc-500">
                ⚡ Safe 256-bit encrypted demonstration gateway
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
