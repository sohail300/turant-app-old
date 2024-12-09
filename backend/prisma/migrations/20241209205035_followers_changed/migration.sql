/*
  Warnings:

  - The primary key for the `Follower` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Follower" DROP CONSTRAINT "Follower_pkey",
ADD COLUMN     "follower_following_id" SERIAL NOT NULL,
ADD CONSTRAINT "Follower_pkey" PRIMARY KEY ("follower_following_id");

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "verifiedByFollowersCount" BOOLEAN NOT NULL DEFAULT false;
