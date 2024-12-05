/*
  Warnings:

  - The values [reporter] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expires_at` to the `Otp` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `related` on the `Otp` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `phone` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `display_name` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `username_last_edit` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `profile_url` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `app_language` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `state` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `city` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "OtpType" AS ENUM ('register', 'forgot_password');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('admin', 'user');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- AlterTable
ALTER TABLE "Otp" ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL,
DROP COLUMN "related",
ADD COLUMN     "related" "OtpType" NOT NULL,
ALTER COLUMN "otp" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "display_name" SET NOT NULL,
ALTER COLUMN "username_last_edit" SET NOT NULL,
ALTER COLUMN "profile_url" SET NOT NULL,
ALTER COLUMN "app_language" SET NOT NULL,
ALTER COLUMN "state" SET NOT NULL,
ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "verified" SET DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
