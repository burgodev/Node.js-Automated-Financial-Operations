/*
  Warnings:

  - The primary key for the `countries` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `countries` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[iso_code]` on the table `countries` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `iso_code` to the `countries` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_country_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_location_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_nationality_id_fkey";

-- AlterTable
ALTER TABLE "addresses" ALTER COLUMN "country_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "countries" DROP CONSTRAINT "countries_pkey",
DROP COLUMN "id",
ADD COLUMN     "iso_code" TEXT NOT NULL,
ADD CONSTRAINT "countries_pkey" PRIMARY KEY ("iso_code");

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "nationality_id" SET DATA TYPE TEXT,
ALTER COLUMN "location_id" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "countries_iso_code_key" ON "countries"("iso_code");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "countries"("iso_code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_nationality_id_fkey" FOREIGN KEY ("nationality_id") REFERENCES "countries"("iso_code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("iso_code") ON DELETE RESTRICT ON UPDATE CASCADE;
