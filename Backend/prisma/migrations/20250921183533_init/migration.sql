-- CreateTable
CREATE TABLE "public"."Registration" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "modelType" TEXT NOT NULL,
    "bio" TEXT,
    "allergiesOrSkin" TEXT,
    "height" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "bust" DOUBLE PRECISION,
    "waist" DOUBLE PRECISION,
    "hips" DOUBLE PRECISION,
    "shoe" TEXT,
    "hairColor" TEXT,
    "eyeColor" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "tiktok" TEXT,
    "portfolio" TEXT,
    "agency" TEXT,
    "visualArts" TEXT[],
    "status" TEXT,
    "profileImage" TEXT,
    "fullBodyImage" TEXT,
    "fullDress" TEXT,
    "fullShorts" TEXT,
    "fullJeans" TEXT,
    "closeForward" TEXT,
    "closeLeft" TEXT,
    "closeRight" TEXT,
    "sportswear" TEXT,
    "summerwear" TEXT,
    "swimwear" TEXT,
    "extraImages" TEXT[],

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Admin" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "public"."Admin"("email");
