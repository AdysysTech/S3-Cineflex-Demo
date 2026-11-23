"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Sparkles, MapPin, Film, Ticket, Utensils } from "lucide-react";
import { CINEMA_INFO, MOVIES, SEAT_TIERS } from "@/lib/data";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  quickActions?: { label: string; action: string }[];
}

export default function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: "Namaste! 🙏 Welcome to S3 Cineplex, Manendragarh. I'm your digital cinema concierge. How can I assist you today?",
      timestamp: "Just now",
      quickActions: [
        { label: "🎬 Today's Showtimes", action: "showtimes" },
        { label: "🎟️ Ticket Prices", action: "prices" },
        { label: "🍿 In-Seat QR Food", action: "food" },
        { label: "📍 Location & Timing", action: "location" },
      ],
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleQuickAction = (action: string) => {
    let userText = "";
    let botReply = "";

    switch (action) {
      case "showtimes":
        userText = "What are today's movie showtimes?";
        botReply = `🎬 **Today's Movies at S3 Cineplex:**\n\n${MOVIES.map(
          (m) => `• **${m.title}** (${m.format})\n  Shows: ${m.showtimes.join(" • ")}`
        ).join("\n\n")}\n\nTip: You can click "Book Tickets" on any movie above to select your preferred seats!`;
        break;

      case "prices":
        userText = "What are the ticket prices and seat tiers?";
        botReply = `🎟️ **S3 Cineplex Seat Tiers & Pricing:**\n\n• **Regular Classic (Rows A–C):** ₹${SEAT_TIERS.REGULAR.price}\n• **Executive Prime (Rows D–G):** ₹${SEAT_TIERS.EXECUTIVE.price} (Extra legroom & rocker back)\n• **VIP Plush Recliners (Rows H–I):** ₹${SEAT_TIERS.RECLINER.price} (Motorized 160° recline + swivel tables)\n\n🎁 *Pro Tip:* Use promo code **S3TUE50** for ₹50 off + free popcorn or **S3WELCOME** for 15% off!`;
        break;

      case "food":
        userText = "How does In-Seat Food Ordering work?";
        botReply = `🍿 **In-Seat QR Dining (Zero Interval Queue!):**\n\n1. Simply scan the **metal QR plaque** fixed on your armrest with your phone camera.\n2. Choose gourmet snacks (Caramel Popcorn, Chicken Burgers, Samosas, Pizzas, Cold Coffee).\n3. Pay instantly via PhonePe / GPay / Paytm.\n4. Select **"Deliver Now"** or **"Deliver at Interval"** — our runners bring it straight to your seat!`;
        break;

      case "location":
        userText = "Where is S3 Cineplex located?";
        botReply = `📍 **S3 Cineplex Location:**\n\n${CINEMA_INFO.address}\n\n⏰ **Operating Hours:** ${CINEMA_INFO.hours}\n📞 **Phone / WhatsApp:** ${CINEMA_INFO.phone}\n\n[Click here to open Google Maps](${CINEMA_INFO.googleMapsUrl})`;
        break;

      default:
        userText = action;
        botReply = "I am here to help you with movie bookings, gourmet snack delivery, private screenings, or on-screen advertising!";
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: userText,
      timestamp: "Just now",
    };

    const botMsg: ChatMessage = {
      id: `bot-${Date.now() + 1}`,
      sender: "bot",
      text: botReply,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const query = inputValue.trim().toLowerCase();
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: inputValue.trim(),
      timestamp: "Just now",
    };

    let replyText = "";
    if (query.includes("time") || query.includes("show") || query.includes("movie")) {
      replyText = `We are currently screening:\n${MOVIES.map(
        (m) => `• ${m.title} at ${m.showtimes.join(", ")}`
      ).join("\n")}`;
    } else if (query.includes("price") || query.includes("ticket") || query.includes("cost")) {
      replyText = `Tickets start at ₹150 for Regular, ₹220 for Executive, and ₹350 for VIP Recliners.`;
    } else if (query.includes("food") || query.includes("popcorn") || query.includes("snack")) {
      replyText = `You can order directly to your seat using our In-Seat QR Dining! Popcorn, cold coffee, burgers, and pizzas delivered hot.`;
    } else if (query.includes("ad") || query.includes("advertise")) {
      replyText = `Local screen ads start at just ₹3,500/month for 15-second pre-show slides reaching 4,500+ locals! Visit our /advertise page for packages.`;
    } else if (query.includes("private") || query.includes("birthday")) {
      replyText = `We host private birthday celebrations and family screenings starting at ₹4,999! Check out /private-shows to book.`;
    } else if (query.includes("phone") || query.includes("contact") || query.includes("manager")) {
      replyText = `You can call or WhatsApp our manager directly at ${CINEMA_INFO.phone}.`;
    } else {
      replyText = `Thank you for your message! S3 Cineplex is open daily 11:00 AM - 12:00 AM in Manendragarh. For immediate seat booking, you can browse movies on this site or WhatsApp our manager at ${CINEMA_INFO.phone}.`;
    }

    const botMsg: ChatMessage = {
      id: `bot-${Date.now() + 1}`,
      sender: "bot",
      text: replyText,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInputValue("");
  };

  return (
    <div id="s3-assistant-widget" className="fixed bottom-6 right-20 sm:right-24 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[350px] sm:w-[380px] max-w-[calc(100vw-2rem)] h-[500px] bg-[#121217] border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1A1A22] via-[#23232D] to-[#1A1A22] p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#E1252C] flex items-center justify-center text-white font-bold text-sm shadow-md shadow-[#E1252C]/30">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white text-sm flex items-center gap-1.5">
                  <span>S3 Concierge AI</span>
                  <span className="w-2 h-2 rounded-full bg-[#38B884]"></span>
                </div>
                <div className="text-[10px] font-mono text-zinc-400">
                  Instant Cineplex Support
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm bg-[#09090C]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "bot" && (
                  <div className="w-7 h-7 rounded-full bg-[#E1252C]/20 border border-[#E1252C]/40 flex items-center justify-center text-[#FF5259] shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div className="max-w-[85%] space-y-2">
                  <div
                    className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                      msg.sender === "user"
                        ? "bg-[#E1252C] text-white rounded-tr-none font-medium"
                        : "bg-[#1A1A22] text-zinc-200 border border-white/10 rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Quick Action Chips */}
                  {msg.quickActions && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.quickActions.map((qa) => (
                        <button
                          key={qa.action}
                          onClick={() => handleQuickAction(qa.action)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#23232D] hover:bg-[#E1252C]/20 hover:border-[#E1252C]/40 border border-white/10 text-[11px] font-medium text-zinc-300 hover:text-white transition-all text-left"
                        >
                          {qa.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {msg.sender === "user" && (
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-zinc-300 shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-[#121217] border-t border-white/10 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about showtimes, prices, food..."
              className="flex-1 bg-[#09090C] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#E1252C] transition-colors"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="w-9 h-9 rounded-xl bg-[#E1252C] hover:bg-[#FF5259] disabled:opacity-40 text-white flex items-center justify-center transition-all shrink-0 shadow-md shadow-[#E1252C]/30"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-13 h-13 p-3 rounded-full bg-gradient-to-tr from-[#1E293B] to-[#3B82F6] hover:scale-105 active:scale-95 text-white shadow-xl shadow-blue-500/20 border border-blue-400/30 flex items-center justify-center transition-all cursor-pointer group"
        title="Chat with S3 Assistant"
        aria-label="Toggle S3 Concierge AI"
      >
        <Sparkles className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
      </button>
    </div>
  );
}
