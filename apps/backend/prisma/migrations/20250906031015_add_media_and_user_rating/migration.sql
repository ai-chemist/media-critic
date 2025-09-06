-- CreateEnum
CREATE TYPE "public"."MediaType" AS ENUM ('MOVIE', 'GAME', 'BOOK', 'MUSIC');

-- CreateTable
CREATE TABLE "public"."Media" (
    "id" SERIAL NOT NULL,
    "type" "public"."MediaType" NOT NULL,
    "title" TEXT NOT NULL,
    "year" INTEGER,
    "externalId" TEXT,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserRating" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "mediaId" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserRating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Media_title_idx" ON "public"."Media"("title");

-- CreateIndex
CREATE INDEX "Media_type_year_idx" ON "public"."Media"("type", "year");

-- CreateIndex
CREATE UNIQUE INDEX "Media_source_externalId_key" ON "public"."Media"("source", "externalId");

-- CreateIndex
CREATE INDEX "UserRating_userId_idx" ON "public"."UserRating"("userId");

-- CreateIndex
CREATE INDEX "UserRating_mediaId_idx" ON "public"."UserRating"("mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRating_userId_mediaId_key" ON "public"."UserRating"("userId", "mediaId");

-- AddForeignKey
ALTER TABLE "public"."UserRating" ADD CONSTRAINT "UserRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserRating" ADD CONSTRAINT "UserRating_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "public"."Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;
