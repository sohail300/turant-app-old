/*
  Warnings:

  - You are about to drop the column `visible` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "visible",
ADD COLUMN     "lastBan" TEXT;
