import { FoodOrder, CRMContact, OrderStatus } from "./types";
import { Redis } from "@upstash/redis";

// Check if Upstash Redis credentials exist in environment
const hasUpstash = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);

let redisClient: Redis | null = null;
if (hasUpstash) {
  try {
    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  } catch (err) {
    console.warn("Failed to initialize Upstash Redis, falling back to in-memory:", err);
    redisClient = null;
  }
}

// Initial demo seed data
const INITIAL_DEMO_ORDERS: FoodOrder[] = [
  {
    id: "#1041",
    seatNumber: "F-08",
    customerName: "Rahul Sharma",
    whatsappNumber: "9826190012",
    items: [
      { id: "pop-butter", name: "Classic Salted Butter Popcorn (L)", price: 130, quantity: 1, isVeg: true },
      { id: "bev-coke", name: "Coca-Cola Large (750ml)", price: 90, quantity: 2, isVeg: true },
    ],
    subtotal: 310,
    discount: 20,
    couponApplied: "POP20",
    total: 290,
    paymentMethod: "PhonePe",
    paymentStatus: "PAID",
    deliveryTiming: "NOW",
    status: "DELIVERED",
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
  },
  {
    id: "#1042",
    seatNumber: "E-12",
    customerName: "Pooja Verma",
    whatsappNumber: "8718982504",
    items: [
      { id: "pop-caramel", name: "Large Caramel Popcorn", price: 160, quantity: 1, isVeg: true },
      { id: "bev-coffee", name: "Chilled Cold Coffee Blast", price: 130, quantity: 1, isVeg: true },
      { id: "snack-nachos", name: "Loaded Cheese Nachos", price: 180, quantity: 1, isVeg: true },
    ],
    subtotal: 470,
    discount: 50,
    couponApplied: "S3TUE50",
    total: 420,
    paymentMethod: "GPay",
    paymentStatus: "PAID",
    deliveryTiming: "INTERVAL",
    intervalShowtime: "05:15 PM Interval",
    status: "PREPARING",
    createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
  },
];

const INITIAL_CRM_CONTACTS: CRMContact[] = [
  {
    id: "crm-1",
    name: "Rahul Sharma",
    whatsappNumber: "9826190012",
    optInMarketing: true,
    source: "IN_SEAT_QR",
    orderCount: 3,
    totalSpent: 890,
    lastSeat: "F-08",
    lastInteraction: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
  },
  {
    id: "crm-2",
    name: "Pooja Verma",
    whatsappNumber: "8718982504",
    optInMarketing: true,
    source: "IN_SEAT_QR",
    orderCount: 1,
    totalSpent: 420,
    lastSeat: "E-12",
    lastInteraction: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
  },
  {
    id: "crm-3",
    name: "Vikram Agrawal",
    whatsappNumber: "9425234190",
    optInMarketing: true,
    source: "TICKET_BOOKING",
    orderCount: 2,
    totalSpent: 960,
    lastSeat: "H-04",
    lastInteraction: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
];

// Global in-memory storage fallback for Node.js / Serverless runtimes
const globalStore = globalThis as unknown as {
  __S3_ORDERS_STORE__?: FoodOrder[];
  __S3_CRM_STORE__?: CRMContact[];
};

if (!globalStore.__S3_ORDERS_STORE__) {
  globalStore.__S3_ORDERS_STORE__ = [...INITIAL_DEMO_ORDERS];
}
if (!globalStore.__S3_CRM_STORE__) {
  globalStore.__S3_CRM_STORE__ = [...INITIAL_CRM_CONTACTS];
}

const REDIS_ORDERS_KEY = "s3_cineplex:orders:v1";
const REDIS_CRM_KEY = "s3_cineplex:crm:v1";

export async function getOrders(): Promise<FoodOrder[]> {
  if (redisClient) {
    try {
      const data = await redisClient.get<FoodOrder[]>(REDIS_ORDERS_KEY);
      if (data && Array.isArray(data)) {
        return data;
      }
      // If empty in redis, initialize with seed
      await redisClient.set(REDIS_ORDERS_KEY, INITIAL_DEMO_ORDERS);
      return INITIAL_DEMO_ORDERS;
    } catch (e) {
      console.error("Redis getOrders error, using memory:", e);
    }
  }
  return globalStore.__S3_ORDERS_STORE__ || [];
}

export async function getOrderById(id: string): Promise<FoodOrder | null> {
  const orders = await getOrders();
  const cleanId = id.startsWith("#") ? id : `#${id}`;
  return orders.find((o) => o.id === id || o.id === cleanId) || null;
}

export async function saveOrder(order: FoodOrder): Promise<FoodOrder> {
  if (redisClient) {
    try {
      const orders = await getOrders();
      // Prepend order so newest orders are first
      const updated = [order, ...orders.filter((o) => o.id !== order.id)];
      await redisClient.set(REDIS_ORDERS_KEY, updated);
      return order;
    } catch (e) {
      console.error("Redis saveOrder error, falling back to memory:", e);
    }
  }

  const orders = globalStore.__S3_ORDERS_STORE__ || [];
  globalStore.__S3_ORDERS_STORE__ = [order, ...orders.filter((o) => o.id !== order.id)];
  return order;
}

export async function updateOrderStatus(
  id: string,
  newStatus: OrderStatus
): Promise<FoodOrder | null> {
  const cleanId = id.startsWith("#") ? id : `#${id}`;

  if (redisClient) {
    try {
      const orders = await getOrders();
      let found: FoodOrder | null = null;
      const updated = orders.map((o) => {
        if (o.id === id || o.id === cleanId) {
          found = { ...o, status: newStatus };
          return found;
        }
        return o;
      });
      if (found) {
        await redisClient.set(REDIS_ORDERS_KEY, updated);
        return found;
      }
      return null;
    } catch (e) {
      console.error("Redis updateOrderStatus error, falling back to memory:", e);
    }
  }

  const orders = globalStore.__S3_ORDERS_STORE__ || [];
  let found: FoodOrder | null = null;
  globalStore.__S3_ORDERS_STORE__ = orders.map((o) => {
    if (o.id === id || o.id === cleanId) {
      found = { ...o, status: newStatus };
      return found;
    }
    return o;
  });
  return found;
}

export async function resetOrders(): Promise<void> {
  if (redisClient) {
    try {
      await redisClient.set(REDIS_ORDERS_KEY, INITIAL_DEMO_ORDERS);
    } catch (e) {
      console.error("Redis reset error:", e);
    }
  }
  globalStore.__S3_ORDERS_STORE__ = [...INITIAL_DEMO_ORDERS];
}

export async function getCRMContacts(): Promise<CRMContact[]> {
  if (redisClient) {
    try {
      const data = await redisClient.get<CRMContact[]>(REDIS_CRM_KEY);
      if (data && Array.isArray(data)) {
        return data;
      }
      await redisClient.set(REDIS_CRM_KEY, INITIAL_CRM_CONTACTS);
      return INITIAL_CRM_CONTACTS;
    } catch (e) {
      console.error("Redis getCRMContacts error, using memory:", e);
    }
  }
  return globalStore.__S3_CRM_STORE__ || [];
}

export async function saveCRMContact(
  contactData: Omit<CRMContact, "id" | "lastInteraction">
): Promise<CRMContact> {
  const contacts = await getCRMContacts();
  const existingIndex = contacts.findIndex(
    (c) => c.whatsappNumber === contactData.whatsappNumber
  );

  let updatedContact: CRMContact;

  if (existingIndex > -1) {
    const existing = contacts[existingIndex];
    updatedContact = {
      ...existing,
      name: contactData.name || existing.name,
      orderCount: existing.orderCount + 1,
      totalSpent: existing.totalSpent + (contactData.totalSpent || 0),
      lastSeat: contactData.lastSeat || existing.lastSeat,
      optInMarketing: contactData.optInMarketing ?? existing.optInMarketing,
      lastInteraction: new Date().toISOString(),
    };
    contacts[existingIndex] = updatedContact;
  } else {
    updatedContact = {
      ...contactData,
      id: `crm-${Date.now()}`,
      orderCount: contactData.orderCount || 1,
      totalSpent: contactData.totalSpent || 0,
      lastInteraction: new Date().toISOString(),
    };
    contacts.unshift(updatedContact);
  }

  if (redisClient) {
    try {
      await redisClient.set(REDIS_CRM_KEY, contacts);
      return updatedContact;
    } catch (e) {
      console.error("Redis saveCRM error:", e);
    }
  }

  globalStore.__S3_CRM_STORE__ = contacts;
  return updatedContact;
}
