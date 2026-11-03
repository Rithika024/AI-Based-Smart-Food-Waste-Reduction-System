
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      select: {
        id: true,
        rollNumber: true,
        name: true,
        createdAt: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    console.error("Failed to fetch students:", error);

    return NextResponse.json(
      { success: false, message: "Unable to fetch students." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";

    const rollNumber =
      typeof body.rollNumber === "string"
        ? body.rollNumber.trim()
        : "";

    if (!name || !rollNumber) {
      return NextResponse.json(
        {
          success: false,
          message: "Name and roll number are required.",
        },
        { status: 400 }
      );
    }

    const existingStudent = await prisma.student.findUnique({
      where: { rollNumber },
    });

    if (existingStudent) {
      return NextResponse.json(
        {
          success: false,
          message: "A student with this roll number already exists.",
        },
        { status: 409 }
      );
    }

    const student = await prisma.student.create({
      data: {
        name,
        rollNumber,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Student registered successfully.",
        data: student,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to register student:", error);

    return NextResponse.json(
      { success: false, message: "Unable to register student." },
      { status: 500 }
    );
  }
}
