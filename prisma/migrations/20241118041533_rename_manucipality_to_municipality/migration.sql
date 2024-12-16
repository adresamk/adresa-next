/*
  Warnings:

  - You are about to drop the column `contactPerson` on the `Agency` table. All the data in the column will be lost.
  - You are about to drop the column `manucipality` on the `Listing` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Agency` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Agency` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[externalRef]` on the table `Listing` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- AlterTable
ALTER TABLE "Agency" DROP COLUMN "contactPerson",
ADD COLUMN     "contactPersonEmail" TEXT,
ADD COLUMN     "contactPersonFullName" TEXT,
ADD COLUMN     "contactPersonPhone" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "website" TEXT,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "slug" DROP NOT NULL,
ALTER COLUMN "logo" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "gpsLocation" DROP NOT NULL,
ALTER COLUMN "workHours" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "shortDescription" DROP NOT NULL,
ALTER COLUMN "branding" DROP NOT NULL,
ALTER COLUMN "branding" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "manucipality",
ADD COLUMN     "externalRef" TEXT,
ADD COLUMN     "isVisible" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "municipality" TEXT,
ADD COLUMN     "title" TEXT DEFAULT '';

-- CreateTable
CREATE TABLE "SavedSearch" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "img" TEXT,
    "isNotificationOn" BOOLEAN NOT NULL DEFAULT false,
    "notificationInterval" TEXT NOT NULL,
    "searchParams" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "lastOpenedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedSearch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Agency_name_key" ON "Agency"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Agency_slug_key" ON "Agency"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Listing_externalRef_key" ON "Listing"("externalRef");

-- AddForeignKey
ALTER TABLE "SavedSearch" ADD CONSTRAINT "SavedSearch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
