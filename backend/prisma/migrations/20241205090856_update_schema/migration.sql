/*
  Warnings:

  - The values [register] on the enum `OtpType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OtpType_new" AS ENUM ('register_mail', 'register_phone', 'forgot_password');
ALTER TABLE "Otp" ALTER COLUMN "related" TYPE "OtpType_new" USING ("related"::text::"OtpType_new");
ALTER TYPE "OtpType" RENAME TO "OtpType_old";
ALTER TYPE "OtpType_new" RENAME TO "OtpType";
DROP TYPE "OtpType_old";
COMMIT;
