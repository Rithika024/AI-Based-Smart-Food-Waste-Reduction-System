-- CreateTable
CREATE TABLE "Student" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rollNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "MealSession" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "mealType" TEXT NOT NULL,
    "registrationDeadline" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "MenuItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SessionMenu" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mealSessionId" INTEGER NOT NULL,
    "menuItemId" INTEGER NOT NULL,
    CONSTRAINT "SessionMenu_mealSessionId_fkey" FOREIGN KEY ("mealSessionId") REFERENCES "MealSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SessionMenu_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MealRegistration" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "studentId" INTEGER NOT NULL,
    "mealSessionId" INTEGER NOT NULL,
    "registeredAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MealRegistration_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MealRegistration_mealSessionId_fkey" FOREIGN KEY ("mealSessionId") REFERENCES "MealSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RegistrationItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "registrationId" INTEGER NOT NULL,
    "sessionMenuId" INTEGER NOT NULL,
    CONSTRAINT "RegistrationItem_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "MealRegistration" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RegistrationItem_sessionMenuId_fkey" FOREIGN KEY ("sessionMenuId") REFERENCES "SessionMenu" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WasteRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sessionMenuId" INTEGER NOT NULL,
    "preparedKg" REAL NOT NULL DEFAULT 0,
    "servedKg" REAL NOT NULL DEFAULT 0,
    "leftoverKg" REAL NOT NULL DEFAULT 0,
    "discardedKg" REAL NOT NULL DEFAULT 0,
    "recordedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WasteRecord_sessionMenuId_fkey" FOREIGN KEY ("sessionMenuId") REFERENCES "SessionMenu" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
