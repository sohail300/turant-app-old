-- CreateTable
CREATE TABLE "Reporter" (
    "reporter_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "block" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "Reporter_pkey" PRIMARY KEY ("reporter_id")
);
