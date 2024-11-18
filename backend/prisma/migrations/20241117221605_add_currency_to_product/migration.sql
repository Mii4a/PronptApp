/*
  Warnings:

  - You are about to drop the column `imageUrls` on the `Prompt` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('JPY', 'USD');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'JPY';

-- AlterTable
ALTER TABLE "Prompt" DROP COLUMN "imageUrls",
ADD COLUMN     "imageUrl" TEXT;
