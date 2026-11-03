-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "rollNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealSession" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "mealType" TEXT NOT NULL,
    "registrationDeadline" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MealSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuItem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MenuItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionMenu" (
    "id" SERIAL NOT NULL,
    "mealSessionId" INTEGER NOT NULL,
    "menuItemId" INTEGER NOT NULL,

    CONSTRAINT "SessionMenu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealRegistration" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "mealSessionId" INTEGER NOT NULL,
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MealRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegistrationItem" (
    "id" SERIAL NOT NULL,
    "registrationId" INTEGER NOT NULL,
    "sessionMenuId" INTEGER NOT NULL,

    CONSTRAINT "RegistrationItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WasteRecord" (
    "id" SERIAL NOT NULL,
    "sessionMenuId" INTEGER NOT NULL,
    "preparedKg" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "servedKg" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "leftoverKg" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discardedKg" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WasteRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_rollNumber_key" ON "Student"("rollNumber");

-- CreateIndex
CREATE UNIQUE INDEX "MealSession_date_mealType_key" ON "MealSession"("date", "mealType");

-- CreateIndex
CREATE UNIQUE INDEX "MenuItem_name_key" ON "MenuItem"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SessionMenu_mealSessionId_menuItemId_key" ON "SessionMenu"("mealSessionId", "menuItemId");

-- CreateIndex
CREATE UNIQUE INDEX "MealRegistration_studentId_mealSessionId_key" ON "MealRegistration"("studentId", "mealSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "RegistrationItem_registrationId_sessionMenuId_key" ON "RegistrationItem"("registrationId", "sessionMenuId");

-- CreateIndex
CREATE UNIQUE INDEX "WasteRecord_sessionMenuId_key" ON "WasteRecord"("sessionMenuId");

-- AddForeignKey
ALTER TABLE "SessionMenu" ADD CONSTRAINT "SessionMenu_mealSessionId_fkey" FOREIGN KEY ("mealSessionId") REFERENCES "MealSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionMenu" ADD CONSTRAINT "SessionMenu_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealRegistration" ADD CONSTRAINT "MealRegistration_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealRegistration" ADD CONSTRAINT "MealRegistration_mealSessionId_fkey" FOREIGN KEY ("mealSessionId") REFERENCES "MealSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistrationItem" ADD CONSTRAINT "RegistrationItem_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "MealRegistration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistrationItem" ADD CONSTRAINT "RegistrationItem_sessionMenuId_fkey" FOREIGN KEY ("sessionMenuId") REFERENCES "SessionMenu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WasteRecord" ADD CONSTRAINT "WasteRecord_sessionMenuId_fkey" FOREIGN KEY ("sessionMenuId") REFERENCES "SessionMenu"("id") ON DELETE CASCADE ON UPDATE CASCADE;
