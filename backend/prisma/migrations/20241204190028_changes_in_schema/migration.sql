/*
  Warnings:

  - You are about to drop the column `description` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "description",
ADD COLUMN     "content" TEXT,
ADD COLUMN     "snippet" TEXT,
ADD COLUMN     "thumbnail" TEXT,
ADD COLUMN     "type" "MediaType";
