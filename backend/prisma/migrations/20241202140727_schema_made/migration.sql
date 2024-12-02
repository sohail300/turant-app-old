-- CreateEnum
CREATE TYPE "Status" AS ENUM ('active', 'ban');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'reporter', 'user');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('none', 'image', 'video');

-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "phone" VARCHAR(15),
    "display_name" VARCHAR(50),
    "username" VARCHAR(50) NOT NULL,
    "username_last_edit" TIMESTAMP(3),
    "profile_url" TEXT,
    "app_language" VARCHAR(10),
    "password" TEXT NOT NULL,
    "state" VARCHAR(50),
    "city" VARCHAR(50),
    "verified" BOOLEAN NOT NULL,
    "status" "Status" NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Otp" (
    "otp_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "related" TEXT NOT NULL,
    "otp" INTEGER NOT NULL,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("otp_id")
);

-- CreateTable
CREATE TABLE "Follower" (
    "follower_id" INTEGER NOT NULL,
    "following_id" INTEGER NOT NULL,

    CONSTRAINT "Follower_pkey" PRIMARY KEY ("follower_id","following_id")
);

-- CreateTable
CREATE TABLE "Post" (
    "post_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "language" VARCHAR(10),
    "title" VARCHAR(255) NOT NULL,
    "photo" TEXT,
    "video" TEXT,
    "description" TEXT,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "shares" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "video_views" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("post_id")
);

-- CreateTable
CREATE TABLE "SavedPost" (
    "saved_post_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "post_id" INTEGER NOT NULL,

    CONSTRAINT "SavedPost_pkey" PRIMARY KEY ("saved_post_id")
);

-- CreateTable
CREATE TABLE "PostLike" (
    "like_id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "PostLike_pkey" PRIMARY KEY ("like_id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "comment_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "post_id" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("comment_id")
);

-- CreateTable
CREATE TABLE "Ad" (
    "ad_id" SERIAL NOT NULL,
    "company_name" VARCHAR(255) NOT NULL,
    "media_type" "MediaType" NOT NULL,
    "media_link" TEXT,
    "target_url" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "target_state" VARCHAR(50),
    "target_city" VARCHAR(50),
    "cost" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "Ad_pkey" PRIMARY KEY ("ad_id")
);

-- CreateTable
CREATE TABLE "AdView" (
    "view_id" SERIAL NOT NULL,
    "ad_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "AdView_pkey" PRIMARY KEY ("view_id")
);

-- CreateTable
CREATE TABLE "AdClick" (
    "click_id" SERIAL NOT NULL,
    "ad_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "AdClick_pkey" PRIMARY KEY ("click_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Otp" ADD CONSTRAINT "Otp_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follower" ADD CONSTRAINT "Follower_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follower" ADD CONSTRAINT "Follower_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedPost" ADD CONSTRAINT "SavedPost_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedPost" ADD CONSTRAINT "SavedPost_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("post_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostLike" ADD CONSTRAINT "PostLike_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("post_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostLike" ADD CONSTRAINT "PostLike_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("post_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdView" ADD CONSTRAINT "AdView_ad_id_fkey" FOREIGN KEY ("ad_id") REFERENCES "Ad"("ad_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdView" ADD CONSTRAINT "AdView_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdClick" ADD CONSTRAINT "AdClick_ad_id_fkey" FOREIGN KEY ("ad_id") REFERENCES "Ad"("ad_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdClick" ADD CONSTRAINT "AdClick_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
