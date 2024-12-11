-- CreateTable
CREATE TABLE "AdminOtp" (
    "admin_otp_id" SERIAL NOT NULL,
    "admin_id" INTEGER NOT NULL,
    "related" "OtpType" NOT NULL,
    "otp" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminOtp_pkey" PRIMARY KEY ("admin_otp_id")
);

-- AddForeignKey
ALTER TABLE "AdminOtp" ADD CONSTRAINT "AdminOtp_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Admin"("admin_id") ON DELETE RESTRICT ON UPDATE CASCADE;
