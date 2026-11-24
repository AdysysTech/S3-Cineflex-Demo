"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ChefHat,
  Volume2,
  VolumeX,
  RotateCcw,
  Users,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  UtensilsCrossed,
  Phone,
  ChevronRight,
  X,
  RefreshCw,
  Search,
  Download,
} from "lucide-react";
import { FoodOrder, CRMContact, OrderStatus } from "@/lib/types";
import { playOrderChime, unlockAudio } from "@/lib/audio";
import { formatINR, formatTime, formatRelativeTime } from "@/lib/utils";

export default function KitchenKDSPage() {
  const [orders, setOrders] = useState<FoodOrder[]>([]);
  const [crmContacts, setCrmContacts] = useState<CRMContact[]>([]);
  const [filterTab, setFilterTab] = useState<"ACTIVE" | "NOW" | "INTERVAL" | "DELIVERED">("ACTIVE");
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isCrmModalOpen, setIsCrmModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState("");

  const prevOrderCountRef = useRef<number>(0);
  const prevOrderIdsRef = useRef<Set<string>>(new Set());
  const isInitialLoadRef = useRef<boolean>(true);

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        const newOrders: FoodOrder[] = data.orders;

        // Check if there are brand-new orders to chime
        const currentIds = new Set(newOrders.map((o) => o.id));
        const hasNewOrder = newOrders.some(
          (o) => !prevOrderIdsRef.current.has(o.id) && o.status === "NEW"
        );

        // Chime if not initial page load and new order arrived
        if (!isInitialLoadRef.current && hasNewOrder && isAudioEnabled) {
          playOrderChime();
        }

        if (isInitialLoadRef.current) {
          isInitialLoadRef.current = false;
        }

        prevOrderIdsRef.current = currentIds;
        prevOrderCountRef.current = newOrders.length;
        setOrders(newOrders);
        setLastRefreshed(new Date());
      }
    } catch (err) {
      console.warn("KDS poll error:", err);
    }
  };

  // Fetch CRM contacts from API
  const fetchCRM = async () => {
    try {
      const res = await fetch("/api/crm", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.contacts)) {
        setCrmContacts(data.contacts);
      }
    } catch (err) {
      console.warn("CRM fetch error:", err);
    }
  };

  // Initial load + ultra-fast 1s poll for live demo responsiveness
  useEffect(() => {
    fetchOrders();
    fetchCRM();

    const interval = setInterval(() => {
      fetchOrders();
    }, 1000);

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchOrders();
        fetchCRM();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("focus", fetchOrders);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("focus", fetchOrders);
    };
  }, [isAudioEnabled]);

  // Audio Toggle
  const toggleAudio = () => {
    unlockAudio();
    setIsAudioEnabled((prev) => !prev);
  };

  // Status Update handler
  const handleUpdateStatus = async (orderId: string, nextStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? data.order : o))
        );
      }
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  // Reset Demo Orders
  const handleResetOrders = async () => {
    if (!confirm("Reset demo orders back to default pitch state?")) return;
    setIsResetting(true);
    try {
      const res = await fetch("/api/orders", { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        await fetchOrders();
        await fetchCRM();
      }
    } catch (err) {
      console.error("Reset error:", err);
    } finally {
      setIsResetting(false);
    }
  };

  // Stats
  const activeOrdersCount = orders.filter((o) => o.status !== "DELIVERED").length;
  const intervalQueueCount = orders.filter(
    (o) => o.deliveryTiming === "INTERVAL" && o.status !== "DELIVERED"
  ).length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchSeat = order.seatNumber.toLowerCase().includes(q);
      const matchId = order.id.toLowerCase().includes(q);
      const matchName = order.customerName.toLowerCase().includes(q);
      if (!matchSeat && !matchId && !matchName) return false;
    }

    if (filterTab === "ACTIVE") return order.status !== "DELIVERED";
    if (filterTab === "NOW")
      return order.deliveryTiming === "NOW" && order.status !== "DELIVERED";
    if (filterTab === "INTERVAL")
      return order.deliveryTiming === "INTERVAL" && order.status !== "DELIVERED";
    if (filterTab === "DELIVERED") return order.status === "DELIVERED";
    return true;
  });

  return (
    <div className="w-full min-h-screen bg-[#070709] text-white p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top KDS Control Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#121217] border border-white/10 rounded-3xl p-4 sm:p-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E1252C] flex items-center justify-center text-white shadow-lg shadow-[#E1252C]/30 border border-white/20">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                  S3 Kitchen Display System
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#38B884]/20 border border-[#38B884]/40 text-[#38B884] font-mono text-[10px] font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38B884] animate-ping"></span>
                  <span>SYNCED (2S)</span>
                </span>
              </div>
              <p className="text-xs font-mono text-zinc-400 mt-0.5">
                Counter Tablet &amp; Runner Dispatch Hub • Refreshed at {formatTime(lastRefreshed.toISOString())}
              </p>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Audio Toggle */}
            <button
              onClick={toggleAudio}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all border ${
                isAudioEnabled
                  ? "bg-[#38B884]/20 border-[#38B884] text-[#38B884] shadow-emerald-glow"
                  : "bg-[#1A1A22] border-white/10 text-zinc-400"
              }`}
              title="Toggle audio notification chime on new order arrival"
            >
              {isAudioEnabled ? (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>Chime On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>Chime Muted</span>
                </>
              )}
            </button>

            {/* View CRM Contacts */}
            <button
              onClick={() => {
                fetchCRM();
                setIsCrmModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-[#1A1A22] hover:bg-[#23232D] border border-white/15 text-xs font-mono font-bold text-zinc-200 hover:text-white transition-all flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-[#FF5259]" />
              <span>CRM Contacts ({crmContacts.length})</span>
            </button>

            {/* Reset Demo Button */}
            <button
              onClick={handleResetOrders}
              disabled={isResetting}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-[#E1252C]/20 border border-white/10 hover:border-[#E1252C]/40 text-xs font-mono text-zinc-400 hover:text-[#FF5259] transition-all flex items-center gap-1.5"
              title="Reset orders to pristine state for fresh pitch"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? "animate-spin" : ""}`} />
              <span>Reset Demo</span>
            </button>
          </div>
        </div>

        {/* Live Stats Top Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#121217] border border-white/10">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
              Active Pending Orders
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#FF5259] font-mono mt-1">
              {activeOrdersCount}
            </div>
            <span className="text-[11px] text-zinc-500 font-mono">Needs preparation / delivery</span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#121217] border border-white/10">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
              Interval Queue
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono mt-1">
              {intervalQueueCount}
            </div>
            <span className="text-[11px] text-zinc-500 font-mono">Auto-scheduled for break</span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#121217] border border-white/10">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
              Today&apos;s QR Revenue
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#38B884] font-mono mt-1">
              {formatINR(totalRevenue)}
            </div>
            <span className="text-[11px] text-zinc-500 font-mono">100% direct prepaid UPI</span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#121217] border border-white/10">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
              Captured CRM Audience
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono mt-1">
              {crmContacts.length}
            </div>
            <span className="text-[11px] text-[#38B884] font-mono">
              Direct WhatsApp contacts owned
            </span>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-hide">
            {(
              [
                { id: "ACTIVE", label: `All Active (${activeOrdersCount})` },
                { id: "NOW", label: "Deliver Now" },
                { id: "INTERVAL", label: "Interval Queue" },
                { id: "DELIVERED", label: "Delivered History" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all ${
                  filterTab === tab.id
                    ? "bg-[#E1252C] text-white shadow-md shadow-[#E1252C]/30"
                    : "bg-[#121217] text-zinc-400 hover:text-white border border-white/10 hover:border-white/20"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search seat or order #..."
              className="w-full bg-[#121217] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-[#E1252C]"
            />
          </div>
        </div>

        {/* Order Cards Grid */}
        {filteredOrders.length === 0 ? (
          <div className="p-16 text-center bg-[#121217] border border-white/10 rounded-3xl space-y-3">
            <CheckCircle2 className="w-12 h-12 mx-auto text-[#38B884]" />
            <h3 className="text-lg font-bold text-white">All Clear! No Orders In This View</h3>
            <p className="text-xs font-mono text-zinc-400 max-w-sm mx-auto">
              Scan a seat QR on your phone or use <Link href="/order?seat=E12" className="text-[#FF5259] underline">/order?seat=E12</Link> to send a test order right now.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => {
              const isDelivered = order.status === "DELIVERED";
              const isPreparing = order.status === "PREPARING";
              const isNew = order.status === "NEW";
              const isInterval = order.deliveryTiming === "INTERVAL";

              return (
                <div
                  key={order.id}
                  className={`bg-[#121217] rounded-3xl p-6 flex flex-col justify-between transition-all duration-200 border-2 shadow-xl ${
                    isDelivered
                      ? "border-white/10 opacity-70"
                      : isNew
                      ? "border-[#E1252C] shadow-red-glow"
                      : "border-amber-500/70"
                  }`}
                >
                  {/* Card Header */}
                  <div>
                    <div className="flex items-start justify-between gap-2 pb-4 border-b border-white/10">
                      <div>
                        {/* Huge Seat Number Tag */}
                        <div className="text-2xl font-extrabold text-white font-mono tracking-wide flex items-center gap-2">
                          <span>SEAT {order.seatNumber}</span>
                        </div>
                        <div className="text-xs font-mono text-zinc-400 mt-0.5">
                          Order {order.id} • {formatRelativeTime(order.createdAt)}
                        </div>
                      </div>

                      {/* Payment Pill */}
                      <div className="flex flex-col items-end gap-1">
                        <span className="px-2.5 py-1 rounded-full bg-[#38B884]/20 border border-[#38B884]/40 text-[#38B884] font-mono text-xs font-bold">
                          PAID UPI {formatINR(order.total)}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500">
                          via {order.paymentMethod}
                        </span>
                      </div>
                    </div>

                    {/* Delivery Timing Pill */}
                    <div className="py-3 flex items-center justify-between">
                      {isInterval ? (
                        <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>DELIVER AT INTERVAL</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg bg-[#E1252C]/20 border border-[#E1252C]/40 text-[#FF5259] font-mono text-xs font-bold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#E1252C] animate-ping"></span>
                          <span>DELIVER NOW</span>
                        </span>
                      )}

                      <span className="text-xs font-mono text-zinc-400">
                        {order.customerName}
                      </span>
                    </div>

                    {/* Itemized Order List */}
                    <div className="py-3 space-y-2 font-mono text-sm border-t border-white/10">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded bg-white/10 text-white font-bold text-xs flex items-center justify-center">
                              {item.quantity}
                            </span>
                            <span className="text-zinc-200">{item.name}</span>
                          </div>
                          <span className="text-zinc-400 text-xs">
                            {formatINR(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {order.couponApplied && (
                      <div className="text-[11px] font-mono text-[#38B884] pt-1">
                        Promo Applied: {order.couponApplied} (Saved {formatINR(order.discount)})
                      </div>
                    )}
                  </div>

                  {/* Card Action Controls */}
                  <div className="pt-5 border-t border-white/10 mt-4 space-y-2">
                    {isNew && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, "PREPARING")}
                        className="w-full py-3 rounded-xl bg-[#E1252C] hover:bg-[#FF5259] text-white font-mono font-bold text-xs transition-all shadow-md shadow-[#E1252C]/30 flex items-center justify-center gap-2"
                      >
                        <ChefHat className="w-4 h-4" />
                        <span>Start Preparing</span>
                      </button>
                    )}

                    {isPreparing && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, "DELIVERED")}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#38B884] to-[#249164] hover:from-[#4ade80] hover:to-[#38B884] text-white font-mono font-bold text-xs transition-all shadow-emerald-glow flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Mark Delivered to Seat {order.seatNumber}</span>
                      </button>
                    )}

                    {isDelivered && (
                      <div className="flex items-center justify-between text-xs font-mono text-[#38B884] py-1">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Order Delivered</span>
                        </span>
                        <button
                          onClick={() => handleUpdateStatus(order.id, "PREPARING")}
                          className="text-[10px] text-zinc-500 hover:text-zinc-300 underline"
                        >
                          Reopen
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CRM Audience Captured Modal */}
        {isCrmModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-2xl bg-[#121217] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto relative">
              <button
                onClick={() => setIsCrmModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close CRM modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#38B884]/20 border border-[#38B884]/40 flex items-center justify-center text-[#38B884]">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">S3 Cineplex Customer Database</h3>
                  <p className="text-xs font-mono text-zinc-400">
                    Direct opt-in guest contacts captured via In-Seat QR orders
                  </p>
                </div>
              </div>

              {/* Pitch Context Banner */}
              <div className="p-4 rounded-2xl bg-[#1A1A22] border border-[#38B884]/30 text-xs leading-relaxed space-y-1">
                <div className="font-bold text-[#38B884] font-mono uppercase">
                  Data Ownership vs BookMyShow
                </div>
                <p className="text-zinc-300">
                  Aggregators withhold guest contact details for single-screen cinemas. With S3&apos;s
                  in-seat QR ordering, every snack order legally builds your private WhatsApp
                  marketing list to push Friday new-release alerts &amp; Tuesday offers!
                </p>
              </div>

              {/* Contacts Table */}
              <div className="border border-white/10 rounded-2xl overflow-hidden font-mono text-xs">
                <table className="w-full text-left">
                  <thead className="bg-[#1A1A22] text-zinc-400 border-b border-white/10">
                    <tr>
                      <th className="p-3">Guest Name</th>
                      <th className="p-3">WhatsApp</th>
                      <th className="p-3">Orders</th>
                      <th className="p-3">Spent</th>
                      <th className="p-3">Last Seat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {crmContacts.map((contact) => (
                      <tr key={contact.id} className="hover:bg-white/5">
                        <td className="p-3 font-bold text-white">{contact.name}</td>
                        <td className="p-3 text-[#38B884]">
                          <a
                            href={`https://wa.me/91${contact.whatsappNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline flex items-center gap-1"
                          >
                            <span>+91 {contact.whatsappNumber}</span>
                          </a>
                        </td>
                        <td className="p-3 text-zinc-300">{contact.orderCount}</td>
                        <td className="p-3 text-white font-bold">{formatINR(contact.totalSpent)}</td>
                        <td className="p-3 text-[#FF5259]">{contact.lastSeat || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center text-xs font-mono text-zinc-400 pt-2">
                <span>{crmContacts.length} verified guests captured</span>
                <button
                  onClick={() => alert("CSV export simulated: Contacts exported to s3_cineplex_crm.csv")}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
