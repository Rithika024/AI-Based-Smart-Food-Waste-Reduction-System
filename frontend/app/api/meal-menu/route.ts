import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const mealSessionId = Number(body.mealSessionId);
    const items: unknown = body.items;

    if (!Number.isInteger(mealSessionId) || mealSessionId <= 0) {
      return NextResponse.json(
        { success: false, message: "A valid meal session ID is required." },
        { status: 400 }
      );
    }

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { success: false, message: "Menu items must be an array." },
        { status: 400 }
      );
    }

    const cleanItems: string[] = Array.from(
      new Set(
        items
          .filter((item): item is string => typeof item === "string")
          .map((item) => item.trim())
          .filter((item) => item.length > 0)
      )
    );

    if (cleanItems.length === 0) {
      return NextResponse.json(
        { success: false, message: "Please provide at least one menu item." },
        { status: 400 }
      );
    }

    const session = await prisma.mealSession.findUnique({
      where: { id: mealSessionId },
    });

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Meal session not found." },
        { status: 404 }
      );
    }

    const createdItems = await prisma.$transaction(async (tx) => {
      const results = [];

      for (const name of cleanItems) {
        const menuItem = await tx.menuItem.upsert({
          where: { name },
          update: {},
          create: { name },
        });

        const sessionMenu = await tx.sessionMenu.upsert({
          where: {
            mealSessionId_menuItemId: {
              mealSessionId,
              menuItemId: menuItem.id,
            },
          },
          update: {},
          create: {
            mealSessionId,
            menuItemId: menuItem.id,
          },
          include: {
            menuItem: true,
          },
        });

        results.push(sessionMenu);
      }

      return results;
    });

    return NextResponse.json(
      {
        success: true,
        message: "Menu items added to the meal session.",
        count: createdItems.length,
        data: createdItems,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to add menu items:", error);

    return NextResponse.json(
      { success: false, message: "Unable to add menu items." },
      { status: 500 }
    );
  }
}
