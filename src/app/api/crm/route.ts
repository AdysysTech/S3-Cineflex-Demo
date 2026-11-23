import { NextResponse } from "next/server";
import { getCRMContacts, saveCRMContact } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const contacts = await getCRMContacts();
    return NextResponse.json({ success: true, contacts }, { status: 200 });
  } catch (error) {
    console.error("GET /api/crm error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve CRM contacts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.whatsappNumber) {
      return NextResponse.json(
        { success: false, error: "WhatsApp number is required" },
        { status: 400 }
      );
    }

    const saved = await saveCRMContact({
      name: body.name || "Guest",
      whatsappNumber: body.whatsappNumber,
      optInMarketing: body.optInMarketing ?? true,
      source: body.source || "IN_SEAT_QR",
      orderCount: body.orderCount || 1,
      totalSpent: Number(body.totalSpent) || 0,
      lastSeat: body.lastSeat || undefined,
    });

    return NextResponse.json({ success: true, contact: saved }, { status: 201 });
  } catch (error) {
    console.error("POST /api/crm error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save CRM contact" },
      { status: 500 }
    );
  }
}
