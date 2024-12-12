/*
  Warnings:

  - You are about to drop the column `photo` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "photo";

-- CreateTable
CREATE TABLE "Photo" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("post_id") ON DELETE RESTRICT ON UPDATE CASCADE;
