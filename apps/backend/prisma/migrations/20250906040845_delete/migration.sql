/*
  Warnings:

  - Changed the type of `type` on the `Media` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Media" DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL;

-- DropEnum
DROP TYPE "public"."MediaType";

-- CreateIndex
CREATE INDEX "Media_type_year_idx" ON "public"."Media"("type", "year");
