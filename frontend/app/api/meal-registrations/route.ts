import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const rollNumber =
      typeof body.rollNumber === "string"
        ? body.rollNumber.trim()
        : "";

    const mealSessionId = Number(body.mealSessionId);

    if (
      !rollNumber ||
      !Number.isInteger(mealSessionId) ||
      mealSessionId <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "A valid roll number and meal session ID are required.",
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.selectedMenuIds)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please select at least one menu item.",
        },
        { status: 400 }
      );
    }

    const selectedMenuIds = Array.from(
      new Set<number>(
        body.selectedMenuIds
          .map((item: unknown) => Number(item))
          .filter((id: number) => Number.isInteger(id) && id > 0)
      )
    );

    if (selectedMenuIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Please select at least one valid menu item.",
        },
        { status: 400 }
      );
    }

    const student = await prisma.student.findUnique({
      where: { rollNumber },
    });

    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found. Register first." },
        { status: 404 }
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

    if (session.status !== "OPEN") {
      return NextResponse.json(
        { success: false, message: "This meal session is closed." },
        { status: 400 }
      );
    }

    const menuItems = await prisma.sessionMenu.findMany({
      where: {
        id: { in: selectedMenuIds },
        mealSessionId,
      },
    });

    if (menuItems.length !== selectedMenuIds.length) {
      return NextResponse.json(
        {
          success: false,
          message: "One or more selected dishes do not belong to this meal.",
        },
        { status: 400 }
      );
    }

    const existing = await prisma.mealRegistration.findUnique({
      where: {
        studentId_mealSessionId: {
          studentId: student.id,
          mealSessionId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "This student is already registered for this meal.",
        },
        { status: 409 }
      );
    }

    const registration = await prisma.mealRegistration.create({
      data: {
        studentId: student.id,
        mealSessionId,
        selectedItems: {
          create: selectedMenuIds.map((sessionMenuId) => ({
            sessionMenuId,
          })),
        },
      },
      include: {
        student: true,
        mealSession: true,
        selectedItems: {
          include: {
            sessionMenu: {
              include: {
                menuItem: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Student registered for the meal successfully.",
        data: registration,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Meal registration failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to register for this meal.",
      },
      { status: 500 }
    );
  }
}
