"use client";

import React, { Suspense, useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  UtensilsCrossed,
  ShoppingBag,
  Plus,
  Minus,
  CheckCircle2,
  Clock,
  Tag,
  X,
  CreditCard,
  Sparkles,
  Phone,
  ChefHat,
  ArrowRight,
  AlertCircle,
  QrCode,
  Loader2,
  Bell,
  Star,
  ExternalLink,
} from "lucide-react";
import confetti from "canvas-confetti";
import { FOOD_MENU, COUPONS, CINEMA_INFO } from "@/lib/data";
import { FoodMenuItem, Coupon, FoodOrder, DeliveryTiming, OrderStatus } from "@/lib/types";
import { formatINR, formatTime } from "@/lib/utils";

function OrderContent() {
  const searchParams = useSearchParams();
  const seatFromUrl = searchParams.get("seat");

  // Seat state
  const [seatNumber, setSeatNumber] = useState<string>("E-12");
  const [isChangingSeat, setIsChangingSeat] = useState<boolean>(false);
  const [tempSeatInput, setTempSeatInput] = useState<string>("E-12");

  useEffect(() => {
    if (seatFromUrl) {
      // Normalize e.g. "e12" -> "E-12" or "E12"
      const formatted = seatFromUrl.includes("-")
        ? seatFromUrl.toUpperCase()
        : `${seatFromUrl.slice(0, 1).toUpperCase()}-${seatFromUrl.slice(1)}`;
      setSeatNumber(formatted);
      setTempSeatInput(formatted);
    }
  }, [seatFromUrl]);

  // Cart state: empty by default (no pre-selected items)
  const [cart, setCart] = useState<Record<string, number>>({});

  // Category filter
  const categories = ["All", "Combos", "Popcorn", "Hot Snacks", "Beverages"] as const;
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // Checkout & Timing
  const [deliveryTiming, setDeliveryTiming] = useState<DeliveryTiming>("NOW");
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [couponError, setCouponError] = useState("");

  // CRM Guest Capture (empty by default for user entry)
  const [customerName, setCustomerName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [optInMarketing, setOptInMarketing] = useState(true);

  // Payment & Live Tracking State
  const [selectedUPI, setSelectedUPI] = useState<"PhonePe" | "GPay" | "Paytm">("PhonePe");
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [activeOrder, setActiveOrder] = useState<FoodOrder | null>(null);

  // Filtered menu
  const filteredMenu = useMemo(() => {
    if (activeCategory === "All") return FOOD_MENU;
    return FOOD_MENU.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  // Cart calculations
  const cartItemsList = useMemo(() => {
    return Object.entries(cart)
      .map(([id, qty]) => {
        const item = FOOD_MENU.find((f) => f.id === id);
        if (!item || qty <= 0) return null;
        return { ...item, qty };
      })
      .filter(Boolean) as (FoodMenuItem & { qty: number })[];
  }, [cart]);

  const totalItemCount = useMemo(() => {
    return cartItemsList.reduce((sum, item) => sum + item.qty, 0);
  }, [cartItemsList]);

  const subtotal = useMemo(() => {
    return cartItemsList.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [cartItemsList]);

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.minOrderValue && subtotal < appliedCoupon.minOrderValue) {
      return 0;
    }
    if (appliedCoupon.discountType === "FIXED") {
      return appliedCoupon.discountValue;
    }
    if (appliedCoupon.discountType === "PERCENTAGE") {
      return Math.round((subtotal * appliedCoupon.discountValue) / 100);
    }
    return 0;
  }, [appliedCoupon, subtotal]);

  const grandTotal = Math.max(0, subtotal - discountAmount);

  // Add / remove quantity
  const addToCart = (id: string) => {
    setCart((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const current = prev[id] || 0;
      if (current <= 1) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: current - 1 };
    });
  };

  // Coupon handling
  const applyCouponCode = (code: string) => {
    setCouponError("");
    const cleanCode = code.trim().toUpperCase();
    const found = COUPONS.find((c) => c.code.toUpperCase() === cleanCode);
    if (!found) {
      setCouponError("Invalid promo code. Try S3TUE50 or POP20");
      return;
    }
    if (found.minOrderValue && subtotal < found.minOrderValue) {
      setCouponError(`Min order value of ₹${found.minOrderValue} required for ${found.code}`);
      return;
    }
    setAppliedCoupon(found);
    setCouponCodeInput("");
  };

  // Handle Order Submit (POST /api/orders)
  const handlePlaceOrder = async () => {
    if (cartItemsList.length === 0) {
      alert("Please add at least 1 item to your cart first.");
      return;
    }

    const finalPhone = whatsappNumber.replace(/\D/g, "").slice(0, 10) || "8718982504";
    const finalName = customerName.trim() || "Cinema Guest";

    setIsSubmittingOrder(true);

    try {
      const payload = {
        seatNumber: seatNumber,
        customerName: finalName,
        whatsappNumber: finalPhone,
        optInMarketing: optInMarketing,
        items: cartItemsList.map((i) => ({
          id: i.id,
          name: i.name,
          price: i.price,
          quantity: i.qty,
          isVeg: i.isVeg,
          category: i.category,
        })),
        subtotal: subtotal,
        discount: discountAmount,
        couponApplied: appliedCoupon ? appliedCoupon.code : undefined,
        total: grandTotal,
        paymentMethod: selectedUPI,
        deliveryTiming: deliveryTiming,
        intervalShowtime: deliveryTiming === "INTERVAL" ? "Next Interval" : undefined,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setActiveOrder(data.order);
        setIsCartDrawerOpen(false);
        setCart({}); // clear cart

        // Scroll immediately to top so the celebratory confirmation & live status tracker are front-and-center!
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "instant" });
        }

        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.25 },
            colors: ["#E1252C", "#FF5259", "#38B884", "#FFFFFF", "#FFD700"],
          });
          setTimeout(() => {
            confetti({
              particleCount: 60,
              spread: 100,
              origin: { y: 0.35 },
              colors: ["#38B884", "#FF5259", "#FFFFFF"],
            });
          }, 350);
        } catch {
          // ignore confetti error
        }
      } else {
        alert("Could not place order: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Order error:", err);
      alert("Network error placing order. Please try again.");
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  // Live polling for the active order status every 1.2s for low-latency live demo sync
  useEffect(() => {
    if (!activeOrder) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${encodeURIComponent(activeOrder.id)}`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (data.success && data.order) {
          setActiveOrder(data.order);
        }
      } catch (err) {
        console.warn("Order poll error:", err);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [activeOrder]);

  return (
    <div className="w-full min-h-screen bg-[#09090C] pb-32">
      {/* 1. Brushed Metal Plaque Banner (Seat Detection) */}
      <div className="bg-[#121217] border-b border-white/10 px-4 py-3 sticky top-20 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="metal-brushed border border-[#E1252C]/60 rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-md">
              <span className="w-2 h-2 rounded-full bg-[#38B884] animate-ping"></span>
              <span className="text-white font-mono font-extrabold text-sm tracking-wide">
                SEAT {seatNumber}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <span>In-Seat Delivery Active</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#38B884]/20 text-[#38B884] font-mono">
                  LIVE
                </span>
              </span>
              <span className="text-[11px] text-zinc-400 font-mono">
                Order will be delivered to your armrest
              </span>
            </div>
          </div>

          {/* Change seat toggle */}
          <div className="flex items-center gap-2">
            {isChangingSeat ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={tempSeatInput}
                  onChange={(e) => setTempSeatInput(e.target.value.toUpperCase())}
                  placeholder="e.g. E-12"
                  className="w-24 px-2 py-1 rounded bg-[#1A1A22] border border-white/20 text-xs font-mono text-white text-center focus:outline-none focus:border-[#E1252C]"
                />
                <button
                  onClick={() => {
                    setSeatNumber(tempSeatInput.trim() || "E-12");
                    setIsChangingSeat(false);
                  }}
                  className="px-2.5 py-1 rounded bg-[#E1252C] text-white text-xs font-mono font-bold"
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsChangingSeat(true)}
                className="text-xs font-mono text-zinc-400 hover:text-white underline decoration-dotted"
              >
                Change Seat
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* If Customer has an Active Live Order: Show the Live Tracker */}
        {activeOrder ? (
          <div className="max-w-2xl mx-auto py-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#121217] border-2 border-[#E1252C]/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#9E1117] via-[#E1252C] to-[#38B884]"></div>

              {/* Status Header with Celebratory Visual */}
              <div className="text-center pb-6 border-b border-white/10 space-y-2">
                <div className="relative mx-auto w-16 h-16 mb-3 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-[#38B884]/20 animate-ping"></div>
                  <div className="relative w-14 h-14 rounded-full bg-[#38B884]/20 border-2 border-[#38B884] flex items-center justify-center text-[#38B884] shadow-lg shadow-emerald-500/30">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#38B884]/20 border border-[#38B884]/40 text-[#38B884] text-xs font-mono font-bold uppercase tracking-wider mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#38B884] animate-ping"></span>
                  <span>
                    {activeOrder.status === "NEW" && "Order Sent to Kitchen Counter!"}
                    {activeOrder.status === "PREPARING" && "Kitchen Preparing Your Snacks"}
                    {activeOrder.status === "DELIVERED" && "Delivered to Seat!"}
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                  {activeOrder.id} — Seat {activeOrder.seatNumber}
                </h2>

                <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-[#38B884] bg-[#38B884]/10 py-1 px-3 rounded-full border border-[#38B884]/30 w-fit mx-auto mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38B884] animate-pulse"></span>
                  <span>Live Sync Active • Instant Counter Reflection</span>
                </div>

                <p className="text-xs font-mono text-zinc-400 pt-1">
                  Guest: <strong className="text-white">{activeOrder.customerName}</strong> • {formatTime(activeOrder.createdAt)}
                </p>
              </div>

              {/* Live Status Progress Bar */}
              <div className="py-8 border-b border-white/10">
                <div className="grid grid-cols-3 gap-2 relative">
                  {/* Step 1: Received */}
                  <div className="flex flex-col items-center text-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all ${
                        activeOrder.status === "NEW" ||
                        activeOrder.status === "PREPARING" ||
                        activeOrder.status === "DELIVERED"
                          ? "bg-[#38B884] text-black shadow-emerald-glow"
                          : "bg-zinc-800 text-zinc-500"
                      }`}
                    >
                      ✓
                    </div>
                    <span className="text-xs font-bold text-white">Received</span>
                    <span className="text-[10px] text-zinc-400 font-mono">Kitchen Notified</span>
                  </div>

                  {/* Step 2: Preparing */}
                  <div className="flex flex-col items-center text-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all ${
                        activeOrder.status === "PREPARING"
                          ? "bg-[#FF5259] text-white animate-pulse shadow-red-glow"
                          : activeOrder.status === "DELIVERED"
                          ? "bg-[#38B884] text-black"
                          : "bg-zinc-800 text-zinc-500"
                      }`}
                    >
                      <ChefHat className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-white">Preparing</span>
                    <span className="text-[10px] text-zinc-400 font-mono">Fresh &amp; Hot</span>
                  </div>

                  {/* Step 3: Delivered */}
                  <div className="flex flex-col items-center text-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all ${
                        activeOrder.status === "DELIVERED"
                          ? "bg-[#38B884] text-black shadow-emerald-glow"
                          : "bg-zinc-800 text-zinc-500"
                      }`}
                    >
                      <UtensilsCrossed className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-white">Delivered</span>
                    <span className="text-[10px] text-zinc-400 font-mono">To Your Seat</span>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-[#1A1A22] border border-white/5 text-center text-xs font-mono text-zinc-300">
                  {activeOrder.deliveryTiming === "INTERVAL" ? (
                    <span className="text-amber-400">
                      ⏱ Scheduled for delivery at Intermission. Sit back and enjoy the first half!
                    </span>
                  ) : (
                    <span>
                      🚀 Runner will deliver to <strong className="text-white">Seat {activeOrder.seatNumber}</strong> in ~5-7 minutes.
                    </span>
                  )}
                </div>
              </div>

              {/* Itemized Order List */}
              <div className="py-6 border-b border-white/10 space-y-3 font-mono">
                <span className="text-[11px] uppercase tracking-wider text-zinc-400 block font-bold">
                  Items Ordered
                </span>
                {activeOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-[#FF5259] font-bold">{item.quantity}x</span>
                      <span className="text-zinc-200">{item.name}</span>
                    </div>
                    <span className="text-white font-bold">{formatINR(item.price * item.quantity)}</span>
                  </div>
                ))}

                <div className="pt-3 border-t border-white/10 flex justify-between items-baseline text-base">
                  <span className="font-sans text-zinc-300 font-bold">Total Paid (UPI)</span>
                  <span className="text-[#38B884] font-extrabold text-xl">
                    {formatINR(activeOrder.total)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 space-y-3">
                {activeOrder.status === "DELIVERED" && (
                  <a
                    href="https://maps.google.com/?cid=8116102637060065234"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <Star className="w-4 h-4 fill-black" />
                    <span>Rate S3 Cineplex 5★ on Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                <button
                  onClick={() => setActiveOrder(null)}
                  className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold transition-colors"
                >
                  Order More Snacks / Back to Menu
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Normal Menu & Cart View */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Menu Section */}
            <div className="lg:col-span-8 space-y-6">
              {/* Promo Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#E1252C]/20 via-[#1A1A22] to-[#121217] border border-[#E1252C]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#FF5259] font-bold uppercase">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>In-Seat Cinema Exclusive</span>
                  </div>
                  <h3 className="text-white font-extrabold text-base sm:text-lg">
                    Use code S3TUE50 for ₹50 OFF + Free Popcorn
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Pre-order now or pick &quot;Deliver at Interval&quot; to skip all queues.
                  </p>
                </div>
                <button
                  onClick={() => applyCouponCode("S3TUE50")}
                  className="px-4 py-2 rounded-xl bg-[#E1252C] hover:bg-[#FF5259] text-white text-xs font-mono font-bold transition-all shadow-md shrink-0"
                >
                  Apply Code
                </button>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                      activeCategory === cat
                        ? "bg-[#E1252C] text-white shadow-md shadow-[#E1252C]/30 scale-105"
                        : "bg-[#121217] text-zinc-400 hover:text-white border border-white/10 hover:border-white/20"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Food Items Grid (Swiggy / Zomato UX) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {filteredMenu.map((item) => {
                  const qty = cart[item.id] || 0;
                  return (
                    <div
                      key={item.id}
                      className="bg-[#121217] border border-white/10 hover:border-white/25 rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-xl group"
                    >
                      <div className="flex gap-4">
                        {/* Food Info */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            {/* Veg / Non-Veg Indicator */}
                            <div
                              className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                item.isVeg ? "border-green-500" : "border-red-500"
                              }`}
                              title={item.isVeg ? "100% Vegetarian" : "Non-Vegetarian"}
                            >
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  item.isVeg ? "bg-green-500" : "bg-red-500"
                                }`}
                              ></div>
                            </div>

                            {item.badge && (
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#E1252C]/20 text-[#FF5259] uppercase tracking-wide">
                                {item.badge}
                              </span>
                            )}
                          </div>

                          <h4 className="font-bold text-white text-base leading-snug group-hover:text-[#FF5259] transition-colors">
                            {item.name}
                          </h4>

                          <div className="flex items-baseline gap-2 font-mono">
                            <span className="text-white font-extrabold text-base">
                              {formatINR(item.price)}
                            </span>
                            {item.originalPrice && (
                              <span className="text-xs text-zinc-500 line-through">
                                {formatINR(item.originalPrice)}
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        {/* Image & Quantity Stepper */}
                        <div className="flex flex-col items-center gap-2 shrink-0">
                          <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-[#1A1A22] border border-white/10">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>

                          {/* Stepper Button */}
                          {qty > 0 ? (
                            <div className="w-24 h-8 rounded-xl bg-[#E1252C] text-white font-mono font-bold text-xs flex items-center justify-between px-2 shadow-md shadow-[#E1252C]/40">
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="p-1 hover:text-black transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span>{qty}</span>
                              <button
                                onClick={() => addToCart(item.id)}
                                className="p-1 hover:text-black transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => addToCart(item.id)}
                              className="w-24 h-8 rounded-xl bg-[#1A1A22] hover:bg-[#E1252C] border border-white/15 hover:border-transparent text-white font-mono font-bold text-xs transition-all flex items-center justify-center gap-1 shadow-sm"
                            >
                              <Plus className="w-3 h-3 text-[#FF5259] group-hover:text-white" />
                              <span>ADD</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Desktop Cart Sidebar (Sticky) */}
            <div className="hidden lg:block lg:col-span-4 bg-[#121217] border border-white/10 rounded-3xl p-6 shadow-2xl sticky top-36 space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-5 h-5 text-[#FF5259]" />
                  <h3 className="font-bold text-white text-base">Your Cinema Cart</h3>
                </div>
                <span className="text-xs font-mono text-[#38B884] font-bold">
                  SEAT {seatNumber}
                </span>
              </div>

              {cartItemsList.length === 0 ? (
                <div className="py-12 text-center text-zinc-500 space-y-3">
                  <UtensilsCrossed className="w-12 h-12 mx-auto text-zinc-700" />
                  <p className="text-sm font-medium">Your cart is empty</p>
                  <p className="text-xs text-zinc-500">
                    Add popcorn, cold coffee, or snacks to order to your seat!
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Item List */}
                  <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                    {cartItemsList.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-xs font-mono bg-[#1A1A22] p-2.5 rounded-xl border border-white/5"
                      >
                        <div className="flex-1 pr-2 truncate">
                          <div className="font-bold text-white truncate">{item.name}</div>
                          <div className="text-zinc-400">
                            {formatINR(item.price)} × {item.qty}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-[#121217] px-2 py-1 rounded-lg border border-white/10">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-zinc-400 hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-white font-bold">{item.qty}</span>
                          <button
                            onClick={() => addToCart(item.id)}
                            className="text-zinc-400 hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Timing Toggle */}
                  <div className="pt-2 border-t border-white/10">
                    <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-2 font-bold">
                      Delivery Timing
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDeliveryTiming("NOW")}
                        className={`p-2.5 rounded-xl border text-xs font-mono font-bold flex flex-col items-center gap-1 transition-all ${
                          deliveryTiming === "NOW"
                            ? "bg-[#E1252C]/20 border-[#E1252C] text-white shadow-md shadow-[#E1252C]/20"
                            : "bg-[#1A1A22] border-white/10 text-zinc-400 hover:text-white"
                        }`}
                      >
                        <span>Deliver Now</span>
                        <span className="text-[10px] text-zinc-400 font-normal">~5-7 mins</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeliveryTiming("INTERVAL")}
                        className={`p-2.5 rounded-xl border text-xs font-mono font-bold flex flex-col items-center gap-1 transition-all ${
                          deliveryTiming === "INTERVAL"
                            ? "bg-amber-500/20 border-amber-500 text-amber-300 shadow-md shadow-amber-500/20"
                            : "bg-[#1A1A22] border-white/10 text-zinc-400 hover:text-white"
                        }`}
                      >
                        <span>At Interval</span>
                        <span className="text-[10px] text-zinc-400 font-normal">Intermission</span>
                      </button>
                    </div>
                  </div>

                  {/* Coupon Box */}
                  <div className="pt-2 border-t border-white/10">
                    {appliedCoupon ? (
                      <div className="p-2.5 rounded-xl bg-[#38B884]/15 border border-[#38B884]/40 flex items-center justify-between text-xs font-mono">
                        <div>
                          <span className="font-bold text-[#38B884]">{appliedCoupon.code}</span>
                          <span className="text-[11px] text-zinc-300 block">
                            Saved {formatINR(discountAmount)}
                          </span>
                        </div>
                        <button
                          onClick={() => setAppliedCoupon(null)}
                          className="text-zinc-400 hover:text-white p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            value={couponCodeInput}
                            onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                            placeholder="Coupon code"
                            className="flex-1 bg-[#1A1A22] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-[#E1252C]"
                          />
                          <button
                            onClick={() => applyCouponCode(couponCodeInput)}
                            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold"
                          >
                            Apply
                          </button>
                        </div>
                        {couponError && (
                          <div className="text-[10px] text-[#FF5259] font-mono">{couponError}</div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-1.5 pt-2 border-t border-white/10 text-xs font-mono">
                    <div className="flex justify-between text-zinc-400">
                      <span>Item Total</span>
                      <span>{formatINR(subtotal)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-[#38B884] font-bold">
                        <span>Discount ({appliedCoupon?.code})</span>
                        <span>-{formatINR(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-baseline text-sm pt-2 border-t border-white/10 text-white font-bold">
                      <span className="font-sans">To Pay</span>
                      <span className="text-xl font-mono text-[#38B884]">
                        {formatINR(grandTotal)}
                      </span>
                    </div>
                  </div>

                  {/* Checkout Drawer Opener */}
                  <button
                    onClick={() => setIsCartDrawerOpen(true)}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#E1252C] to-[#B8181E] hover:from-[#FF5259] hover:to-[#E1252C] text-white font-bold text-sm shadow-lg shadow-[#E1252C]/30 hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Checkout • {formatINR(grandTotal)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Cart Bar for Mobile View */}
      {cartItemsList.length > 0 && !activeOrder && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#121217]/95 border-t border-white/10 p-4 backdrop-blur-lg">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[11px] font-mono text-zinc-400">
                {totalItemCount} {totalItemCount === 1 ? "Item" : "Items"} • Seat {seatNumber}
              </div>
              <div className="text-lg font-extrabold text-white font-mono">
                {formatINR(grandTotal)}
              </div>
            </div>

            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="px-6 py-3 rounded-xl bg-[#E1252C] hover:bg-[#FF5259] text-white font-bold text-sm shadow-lg shadow-[#E1252C]/30 flex items-center gap-2"
            >
              <span>View Cart &amp; Pay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Full Checkout & WhatsApp CRM Drawer Modal */}
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#121217] border border-white/15 rounded-t-3xl sm:rounded-3xl p-6 max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl relative">
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E1252C]/20 border border-[#E1252C]/40 flex items-center justify-center text-[#FF5259]">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">In-Seat Order Checkout</h3>
                <p className="text-xs font-mono text-[#38B884]">
                  Delivering to Seat {seatNumber}
                </p>
              </div>
            </div>

            {/* Delivery Timing Selector */}
            <div>
              <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-2 font-bold">
                1. Delivery Preference
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryTiming("NOW")}
                  className={`p-3 rounded-xl border text-xs font-mono font-bold flex flex-col items-center gap-1 transition-all ${
                    deliveryTiming === "NOW"
                      ? "bg-[#E1252C]/20 border-[#E1252C] text-white shadow-md shadow-[#E1252C]/20"
                      : "bg-[#1A1A22] border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  <span>Deliver Now</span>
                  <span className="text-[10px] text-zinc-400 font-normal">Prepared right away (~5-7m)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryTiming("INTERVAL")}
                  className={`p-3 rounded-xl border text-xs font-mono font-bold flex flex-col items-center gap-1 transition-all ${
                    deliveryTiming === "INTERVAL"
                      ? "bg-amber-500/20 border-amber-500 text-amber-300 shadow-md shadow-amber-500/20"
                      : "bg-[#1A1A22] border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  <span>Deliver at Interval</span>
                  <span className="text-[10px] text-zinc-400 font-normal">Queued for Intermission</span>
                </button>
              </div>
            </div>

            {/* WhatsApp CRM Capture Form */}
            <div className="space-y-3">
              <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block font-bold">
                2. Guest Details (WhatsApp Updates)
              </label>

              <div className="space-y-2.5">
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Your Name (e.g. Rahul Sharma)"
                  className="w-full bg-[#1A1A22] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#E1252C]"
                />

                <div className="relative">
                  <div className="absolute left-3.5 top-2.5 text-xs font-mono text-zinc-400">
                    +91
                  </div>
                  <input
                    type="tel"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="10-digit WhatsApp Number"
                    className="w-full bg-[#1A1A22] border border-white/10 rounded-xl pl-12 pr-3.5 py-2.5 text-xs sm:text-sm font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-[#E1252C]"
                  />
                </div>

                <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={optInMarketing}
                    onChange={(e) => setOptInMarketing(e.target.checked)}
                    className="mt-0.5 rounded border-zinc-700 bg-[#1A1A22] text-[#E1252C] focus:ring-0"
                  />
                  <span className="text-xs text-zinc-300 leading-tight">
                    Send order delivery alerts &amp; Friday movie coupons on WhatsApp.
                  </span>
                </label>
              </div>
            </div>

            {/* 1-Tap UPI Selector */}
            <div>
              <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-2 font-bold">
                3. Instant UPI Checkout
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {(["PhonePe", "GPay", "Paytm"] as const).map((app) => (
                  <button
                    key={app}
                    type="button"
                    onClick={() => setSelectedUPI(app)}
                    className={`p-3 rounded-xl border text-xs font-mono font-bold flex flex-col items-center gap-1.5 transition-all ${
                      selectedUPI === app
                        ? "bg-[#38B884]/20 border-[#38B884] text-white shadow-md shadow-emerald-glow"
                        : "bg-[#1A1A22] border-white/10 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-current"></span>
                    <span>{app}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={isSubmittingOrder}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#E1252C] to-[#B8181E] hover:from-[#FF5259] hover:to-[#E1252C] text-white font-bold text-base shadow-lg shadow-[#E1252C]/30 transition-all flex items-center justify-center gap-2"
            >
              {isSubmittingOrder ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Submitting to Counter Tablet...</span>
                </>
              ) : (
                <>
                  <span>Pay {formatINR(grandTotal)} via {selectedUPI}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <p className="text-center text-[10px] font-mono text-zinc-500">
              ⚡ Demonstrates real cross-device sync directly to /kitchen display
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen bg-[#09090C] flex items-center justify-center text-zinc-400 font-mono text-sm">
          <Loader2 className="w-6 h-6 animate-spin text-[#E1252C] mr-2" />
          <span>Loading In-Seat Menu for S3 Cineplex...</span>
        </div>
      }
    >
      <OrderContent />
    </Suspense>
  );
}
