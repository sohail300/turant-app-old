-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "visible" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "visible" BOOLEAN NOT NULL DEFAULT true;
