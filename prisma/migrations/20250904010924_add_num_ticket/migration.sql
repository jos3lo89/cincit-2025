/*
  Warnings:

  - A unique constraint covering the columns `[numTicket]` on the table `Voucher` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Voucher" ADD COLUMN     "numTicket" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Voucher_numTicket_key" ON "public"."Voucher"("numTicket");
