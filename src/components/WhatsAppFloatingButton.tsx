"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import { CINEMA_INFO } from "@/lib/data";

export default function WhatsAppFloatingButton() {
  const whatsappUrl = `https://wa.me/${CINEMA_INFO.phoneRaw}?text=${encodeURIComponent(
    "Hi S3 Cineplex! I would like to inquire about movie tickets and in-seat dining."
  )}`;

  return (
    <div id="whatsapp-floating-btn" className="fixed bottom-6 right-6 z-50">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-13 h-13 p-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] hover:scale-110 active:scale-95 text-white shadow-xl shadow-green-600/30 border border-white/20 flex items-center justify-center transition-all cursor-pointer group"
        title="Chat on WhatsApp (+91 8718982504)"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-white text-white group-hover:rotate-6 transition-transform" />
      </a>
    </div>
  );
}
