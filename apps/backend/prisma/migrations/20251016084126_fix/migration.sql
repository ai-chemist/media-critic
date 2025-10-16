-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "public"."MediaType" AS ENUM ('MOVIE', 'GAME', 'BOOK');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "name" VARCHAR(16) NOT NULL,
    "nameNormalized" VARCHAR(16) NOT NULL,
    "tag" CHAR(4) NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'USER',
    "imageUrl" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Media" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(32) NOT NULL,
    "type" "public"."MediaType" NOT NULL,
    "description" VARCHAR(128) NOT NULL,
    "genre" VARCHAR(255) NOT NULL,
    "year" CHAR(4) NOT NULL,
    "image_url" VARCHAR(255),
    "meta" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Rating" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "mediaId" INTEGER NOT NULL,
    "score" SMALLINT NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RatingAggregation" (
    "mediaId" INTEGER NOT NULL,
    "sumScore" INTEGER NOT NULL DEFAULT 0,
    "ratingCount" INTEGER NOT NULL DEFAULT 0,
    "avgScore" SMALLINT,
    "lastCalculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RatingAggregation_pkey" PRIMARY KEY ("mediaId")
);

-- CreateTable
CREATE TABLE "public"."RefreshToken" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "tokenHash" VARCHAR(45) NOT NULL,
    "ip" VARCHAR(45),
    "userAgent" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_updatedAt_createdAt_idx" ON "public"."User"("updatedAt", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "User_nameNormalized_tag_key" ON "public"."User"("nameNormalized", "tag");

-- CreateIndex
CREATE INDEX "Media_title_description_idx" ON "public"."Media"("title", "description");

-- CreateIndex
CREATE INDEX "Media_type_idx" ON "public"."Media"("type");

-- CreateIndex
CREATE INDEX "Media_updatedAt_createdAt_idx" ON "public"."Media"("updatedAt", "createdAt");

-- CreateIndex
CREATE INDEX "Rating_mediaId_createdAt_idx" ON "public"."Rating"("mediaId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_userId_mediaId_key" ON "public"."Rating"("userId", "mediaId");

-- CreateIndex
CREATE INDEX "RatingAggregation_avgScore_ratingCount_idx" ON "public"."RatingAggregation"("avgScore", "ratingCount");

-- CreateIndex
CREATE INDEX "RatingAggregation_ratingCount_idx" ON "public"."RatingAggregation"("ratingCount");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "public"."RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "RefreshToken_revoked_expiresAt_idx" ON "public"."RefreshToken"("revoked", "expiresAt");

-- CreateIndex
CREATE INDEX "RefreshToken_expiresAt_idx" ON "public"."RefreshToken"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_tokenHash_key" ON "public"."RefreshToken"("tokenHash");

-- AddForeignKey
ALTER TABLE "public"."Rating" ADD CONSTRAINT "Rating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Rating" ADD CONSTRAINT "Rating_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "public"."Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RatingAggregation" ADD CONSTRAINT "RatingAggregation_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "public"."Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
