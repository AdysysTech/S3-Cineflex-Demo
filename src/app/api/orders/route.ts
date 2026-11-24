import { NextResponse } from "next/server";
import { getOrders, saveOrder, resetOrders, saveCRMContact } from "@/lib/storage";
import { FoodOrder } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const orders = await getOrders();
    return NextResponse.json(
      { success: true, orders },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          "CDN-Cache-Control": "no-store",
          "Vercel-CDN-Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Generate readable order ID e.g. #1043
    const existingOrders = await getOrders();
    let nextNum = 1043;
    if (existingOrders.length > 0) {
      const highestExisting = existingOrders.reduce((max, o) => {
        const num = parseInt(o.id.replace("#", ""), 10);
        return isNaN(num) ? max : Math.max(max, num);
      }, 1040);
      nextNum = highestExisting + 1;
    }

    const orderId = body.id || `#${nextNum}`;

    const newOrder: FoodOrder = {
      id: orderId,
      seatNumber: body.seatNumber || "E-12",
      customerName: body.customerName || "Cinema Guest",
      whatsappNumber: body.whatsappNumber || "8718982504",
      items: body.items || [],
      subtotal: Number(body.subtotal) || 0,
      discount: Number(body.discount) || 0,
      couponApplied: body.couponApplied || undefined,
      total: Number(body.total) || 0,
      paymentMethod: body.paymentMethod || "PhonePe",
      paymentStatus: "PAID",
      deliveryTiming: body.deliveryTiming || "NOW",
      intervalShowtime: body.intervalShowtime || undefined,
      status: "NEW",
      createdAt: new Date().toISOString(),
      notes: body.notes || undefined,
    };

    const saved = await saveOrder(newOrder);

    // If customer details were provided, capture to CRM automatically
    if (newOrder.whatsappNumber && newOrder.whatsappNumber.length >= 10) {
      try {
        await saveCRMContact({
          name: newOrder.customerName,
          whatsappNumber: newOrder.whatsappNumber,
          optInMarketing: body.optInMarketing ?? true,
          source: "IN_SEAT_QR",
          orderCount: 1,
          totalSpent: newOrder.total,
          lastSeat: newOrder.seatNumber,
        });
      } catch (crmErr) {
        console.warn("Auto-CRM capture notice:", crmErr);
      }
    }

    return NextResponse.json(
      { success: true, order: saved, orderId: saved.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await resetOrders();
    return NextResponse.json(
      { success: true, message: "Demo orders have been reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/orders error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reset orders" },
      { status: 500 }
    );
  }
}
