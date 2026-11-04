import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

const VALID_MEALS = ["Breakfast", "Lunch", "Dinner"];

export async function GET() {
  try {
    const meals = await prisma.mealSession.findMany({
      include: {
        sessionMenu: {
          include: {
            menuItem: true,
          },
        },
        _count: {
          select: {
            registrations: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      count: meals.length,
      data: meals,
    });
  } catch (error) {
    console.error("Failed to fetch meal sessions:", error);

    return NextResponse.json(
      { success: false, message: "Unable to fetch meal sessions." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const mealType =
      typeof body.mealType === "string" ? body.mealType.trim() : "";

    const date =
      typeof body.date === "string" ? new Date(body.date) : new Date("");

    if (!VALID_MEALS.includes(mealType) || Number.isNaN(date.getTime())) {
      return NextResponse.json(
        {
          success: false,
          message: "A valid date and meal type are required.",
        },
        { status: 400 }
      );
    }

    const existingMeal = await prisma.mealSession.findFirst({
      where: {
        date,
        mealType,
      },
    });

    if (existingMeal) {
      return NextResponse.json(
        {
          success: false,
          message: "This meal session already exists for that date.",
        },
        { status: 409 }
      );
    }

    const meal = await prisma.mealSession.create({
      data: {
        date,
        mealType,
        status: "OPEN",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Meal session created successfully.",
        data: meal,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create meal session:", error);

    return NextResponse.json(
      { success: false, message: "Unable to create meal session." },
      { status: 500 }
    );
  }
}
