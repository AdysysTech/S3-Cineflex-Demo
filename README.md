# 🎬 S3 Cineplex, Manendragarh — Digital Revenue & Guest Experience Web App

A production-ready, full-stack **Next.js (App Router, TypeScript)** web application built for **S3 Cineplex, Manendragarh (Chhattisgarh)**. Engineered for high-conversion ticket sales, luxury in-seat QR dining, automated WhatsApp CRM capture, and live cross-device kitchen synchronization.

Designed and developed by **Adysys Tech**.

---

## 🌟 Key Capabilities & Features

### 1. In-Seat QR Food Ordering (`/order?seat=E12`) — *The Demo Star*
- **Automatic Seat Detection**: Reads `?seat=...` from the QR code query parameters and renders a brushed-metal seat plaque header (`SEAT E-12 DETECTED • IN-SEAT DELIVERY`).
- **Swiggy / Zomato UX**: Filter by `Combos`, `Popcorn`, `Hot Snacks`, `Beverages` with Veg/Non-Veg indicators and tactile quantity steppers.
- **Timing Toggle**: Choose between **"Deliver Now"** (~5-7 mins) or **"Deliver at Interval"** (automatically queued for intermission).
- **Working Coupons**: Supports `S3TUE50` (₹50 OFF + Free Popcorn) and `POP20` (Flat ₹20 OFF).
- **WhatsApp CRM Capture**: Captures guest name + 10-digit WhatsApp phone number with opt-in checkbox for Friday release alerts.
- **Live Order Tracking**: Polls `/api/orders` every 3 seconds so the guest's phone updates live when the kitchen marks the order **Preparing** or **Delivered**!

### 2. Live Kitchen Counter Display / KDS (`/kitchen`)
- **Real-Time Cross-Device Sync**: Polls `/api/orders` every 2 seconds.
- **Pleasant Web Audio Chime**: Synthesizes a clean cinema notification chime whenever a new order arrives (with sound toggle button to cleanly unlock browser audio policies).
- **Stats Top Bar**: Live counters for *Pending Orders*, *Interval Queue*, *Today's QR Revenue*, and *Captured CRM Contacts*.
- **1-Tap Workflow**: Action button shifts order from `NEW` ➔ `PREPARING` ➔ `DELIVERED`.
- **CRM Database Modal**: Inspect captured WhatsApp audience data with CSV export option.
- **Reset Demo Orders**: Top-right reset button to return orders to initial presentation state between pitches.

### 3. Interactive Cinema Ticketing (`/book/[movieId]`)
- **Curved 4K Laser Screen Indicator**: Realistic cinema glow and visual perspective.
- **3 Price Tiers**: Regular Classic (Rows A–C, ₹150), Executive Prime (Rows D–G, ₹220), VIP Motorized Recliners (Rows H–I, ₹350).
- **Pre-Seeded & Clickable Seats**: Interactive selection (up to 10 seats) with live pricing breakdown.
- **1-Tap Fast Checkout**: PhonePe / GPay / Paytm mock payment with realistic processing animation.
- **Confirmed E-Ticket Pass**: Scannable QR pass + **"Pre-Order Snacks to Seat [Selected Seat]"** button that carries the seat number directly into the food ordering flow!

### 4. Printable Brushed Metal Seat Plaque Generator (`/demo-qr`)
- Built specifically for in-person client presentations.
- Auto-detects the website's live URL (e.g., `https://your-domain.vercel.app/order?seat=E12`).
- Renders a realistic brushed aluminum seat plaque with screw rivets, S3 Cineplex branding, and a high-resolution QR code.
- Includes a **"Print QR Card"** button styled with clean `@media print` CSS for physical card printing.

### 5. High-Margin B2B Revenue Funnels
- **`/advertise`**: On-screen 15-sec & 30-sec local advertising packages (coaching institutes, jewellers, clinics, auto dealerships) with an inquiry form routing directly to the manager's WhatsApp (`+91 97702 66262`).
- **`/private-shows`**: Off-time private screening booking funnel (birthdays, anniversaries, school/college groups) with date/time slot selection and WhatsApp routing.

### 6. Interactive Pitch Deck (`/pitch`)
- Integrated 12-slide presentation deck matching the S3 Cineplex red & black cinema design system. Presentable directly from any browser with arrow key navigation.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: Next.js 15 (App Router, React 19, TypeScript)
- **Styling**: Tailwind CSS with custom cinema tokens (`#09090C`, `#121217`, `#1A1A22`, `#E1252C`, `#38B884`)
- **Icons**: Lucide React
- **Animations**: Framer Motion & CSS keyframe transitions
- **QR Codes**: `qrcode.react` (SVG)
- **Confetti**: `canvas-confetti`
- **Audio Chime**: Web Audio API (zero external audio file dependencies)
- **Data Persistence**: Upstash Redis with automatic in-memory fallback

---

## 🚀 Getting Started

### Local Development (Zero Setup Required)

The application features an **automatic in-memory fallback**. You do not need any API keys or Redis setup to run locally:

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📱 How to Run the 2-Device Live Demo

1. **Laptop / Counter Tablet**: Open [http://localhost:3000/kitchen](http://localhost:3000/kitchen) (or your Vercel deployment link).
   - Ensure the audio chime toggle is set to **"Chime On"** (click once to unlock browser audio).
2. **Presenter's / Client's Smartphone**: Open `/order?seat=E12` (or scan the QR code from `/demo-qr`).
3. Add a **Large Caramel Popcorn** and a **Cold Coffee**, choose **"Deliver Now"**, and tap **"Pay via PhonePe"**.
4. **Watch the Magic**:
   - The laptop on `/kitchen` will chime immediately and display the new order for `SEAT E-12`.
   - When you click **"Start Preparing"** or **"Mark Delivered"** on the laptop, the phone's live tracking screen updates automatically in real-time!

---

## ☁️ Deploying to Vercel with Upstash Redis

### Step 1: Deploy to Vercel
Push this repository to GitHub and import it into [Vercel](https://vercel.com). Vercel will automatically detect Next.js and build with zero errors.

### Step 2: Add Upstash Redis Integration
For persistent cross-device syncing across serverless instances:

1. In your Vercel Project Dashboard, navigate to the **Storage** tab.
2. Click **Connect Database** and select **Upstash Redis**.
3. Choose **Create New** (or connect an existing Upstash Redis database).
4. Vercel will automatically inject the following environment variables:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
5. Redeploy your project. The application will automatically detect the Redis credentials and switch from in-memory mode to cloud-synchronized Upstash Redis!

---

## 📍 Cinema Details

- **Name**: S3 Cineplex (Manendragarh)
- **Address**: Tahseel Office Road, Civil Lines, Moharpara, Manendragarh, Chhattisgarh 497442
- **Phone / WhatsApp**: +91 97702 66262
- **Hours**: 11:00 AM – 12:00 AM
- **Google Maps**: [https://maps.google.com/?cid=8116102637060065234](https://maps.google.com/?cid=8116102637060065234)

---

## 💼 Credits & Proposal Notice

*Digital Experience Prototype built by **Adysys Tech** for S3 Cineplex, Manendragarh.*  
Contact: [adysys.tech@outlook.com](mailto:adysys.tech@outlook.com)
