import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const records = await prisma.wasteRecord.findMany({
      include: {
        sessionMenu: {
          include: {
            menuItem: true,
            session: true,
          },
        },
      },
      orderBy: { recordedAt: "desc" },
    });

    return NextResponse.json({ success: true, data: records });
  } catch (error) {
    console.error("Waste GET error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to fetch waste records." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionMenuId, preparedKg, servedKg, discardedKg } = body;

    if (
      !Number.isInteger(sessionMenuId) ||
      ![preparedKg, servedKg, discardedKg].every(
        (value) => typeof value === "number" && Number.isFinite(value) && value >= 0
      )
    ) {
      return NextResponse.json(
        { success: false, message: "Enter a valid menu ID and non-negative quantities." },
        { status: 400 }
      );
    }

    if (servedKg > preparedKg || discardedKg > preparedKg - servedKg) {
      return NextResponse.json(
        { success: false, message: "Served and discarded quantities cannot exceed prepared quantity." },
        { status: 400 }
      );
    }

    const menu = await prisma.sessionMenu.findUnique({
      where: { id: sessionMenuId },
    });

    if (!menu) {
      return NextResponse.json(
        { success: false, message: "Menu item not found for this meal session." },
        { status: 404 }
      );
    }

    const leftoverKg = Number((preparedKg - servedKg - discardedKg).toFixed(3));

    const record = await prisma.wasteRecord.upsert({
      where: { sessionMenuId },
      update: { preparedKg, servedKg, leftoverKg, discardedKg },
      create: { sessionMenuId, preparedKg, servedKg, leftoverKg, discardedKg },
    });

    return NextResponse.json(
      { success: true, message: "Food waste record saved successfully.", data: record },
      { status: 201 }
    );
  } catch (error) {
    console.error("Waste POST error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to save waste record." },
      { status: 500 }
    );
  }
}
