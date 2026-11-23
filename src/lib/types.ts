export type OrderStatus = "NEW" | "PREPARING" | "DELIVERED";
export type DeliveryTiming = "NOW" | "INTERVAL";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
  isVeg?: boolean;
}

export interface FoodOrder {
  id: string; // e.g. "#1042"
  seatNumber: string; // e.g. "E-12"
  customerName: string;
  whatsappNumber: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponApplied?: string;
  total: number;
  paymentMethod: "PhonePe" | "GPay" | "Paytm" | "Card";
  paymentStatus: "PAID";
  deliveryTiming: DeliveryTiming;
  intervalShowtime?: string;
  status: OrderStatus;
  createdAt: string; // ISO string or formatted
  notes?: string;
}

export interface CRMContact {
  id: string;
  name: string;
  whatsappNumber: string;
  optInMarketing: boolean;
  source: "IN_SEAT_QR" | "TICKET_BOOKING" | "AD_INQUIRY" | "PRIVATE_SHOW_INQUIRY";
  orderCount: number;
  totalSpent: number;
  lastSeat?: string;
  lastInteraction: string;
}

export interface Movie {
  id: string;
  title: string;
  genre: string;
  duration: string;
  rating: "UA" | "A" | "U";
  language: string;
  format: string; // e.g. "2D Hindi Dolby Atmos"
  poster: string;
  bannerImage: string;
  description: string;
  director: string;
  cast: string[];
  showtimes: string[];
  releaseDate?: string;
  isUpcoming?: boolean;
}

export type SeatTier = "REGULAR" | "EXECUTIVE" | "RECLINER";

export interface SeatInfo {
  id: string; // "E12"
  row: string; // "E"
  number: number; // 12
  tier: SeatTier;
  price: number;
  isOccupied: boolean;
}

export interface FoodMenuItem {
  id: string;
  name: string;
  category: "Combos" | "Popcorn" | "Hot Snacks" | "Beverages";
  price: number;
  originalPrice?: number;
  isVeg: boolean;
  description: string;
  image: string;
  badge?: string;
}

export interface Coupon {
  code: string;
  title: string;
  description: string;
  discountType: "FIXED" | "PERCENTAGE";
  discountValue: number;
  freebie?: string;
  minOrderValue?: number;
}
