/*
  Warnings:

  - A unique constraint covering the columns `[rcNumber]` on the table `HostProfile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tin]` on the table `HostProfile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ownerNIN]` on the table `HostProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "TicketCategory" AS ENUM ('payment', 'technical', 'dispute', 'general');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('open', 'in_progress', 'resolved', 'closed');

-- AlterTable
ALTER TABLE "HostProfile" ADD COLUMN     "businessAddress" TEXT,
ADD COLUMN     "businessCity" TEXT,
ADD COLUMN     "businessEmail" TEXT,
ADD COLUMN     "businessPhone" TEXT,
ADD COLUMN     "businessState" TEXT,
ADD COLUMN     "businessType" TEXT,
ADD COLUMN     "cacCertificateUrl" TEXT,
ADD COLUMN     "cacStatusReportUrl" TEXT,
ADD COLUMN     "dateOfIncorporation" TIMESTAMP(3),
ADD COLUMN     "frscFleetStatus" TEXT,
ADD COLUMN     "legalBusinessName" TEXT,
ADD COLUMN     "ownerDOB" TIMESTAMP(3),
ADD COLUMN     "ownerEmail" TEXT,
ADD COLUMN     "ownerNIN" TEXT,
ADD COLUMN     "ownerName" TEXT,
ADD COLUMN     "ownerPhone" TEXT,
ADD COLUMN     "ownershipPercentage" INTEGER,
ADD COLUMN     "rcNumber" TEXT,
ADD COLUMN     "stateTransportPermit" TEXT,
ADD COLUMN     "taxClearanceCertificateUrl" TEXT,
ADD COLUMN     "tin" TEXT,
ADD COLUMN     "tradingName" TEXT,
ADD COLUMN     "utilityBillUrl" TEXT,
ADD COLUMN     "vatStatus" TEXT;

-- CreateTable
CREATE TABLE "SupportTicket" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "category" "TicketCategory" NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportMessage" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "attachmentUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupportMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HostProfile_rcNumber_key" ON "HostProfile"("rcNumber");

-- CreateIndex
CREATE UNIQUE INDEX "HostProfile_tin_key" ON "HostProfile"("tin");

-- CreateIndex
CREATE UNIQUE INDEX "HostProfile_ownerNIN_key" ON "HostProfile"("ownerNIN");

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportMessage" ADD CONSTRAINT "SupportMessage_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "SupportTicket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportMessage" ADD CONSTRAINT "SupportMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
