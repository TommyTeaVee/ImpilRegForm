/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Registration` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Registration` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "public"."Subscriber" (
    "id" SERIAL NOT NULL,
    "fullname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subscriber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_email_key" ON "public"."Subscriber"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Registration_email_key" ON "public"."Registration"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Registration_phone_key" ON "public"."Registration"("phone");
