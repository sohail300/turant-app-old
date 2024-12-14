-- CreateTable
CREATE TABLE "PhoneOtp" (
    "phone_otp_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "phone" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PhoneOtp_pkey" PRIMARY KEY ("phone_otp_id")
);

-- AddForeignKey
ALTER TABLE "PhoneOtp" ADD CONSTRAINT "PhoneOtp_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
