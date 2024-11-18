/*
  Warnings:

  - The `imageUrl` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `imageUrl` column on the `Prompt` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "imageUrl",
ADD COLUMN     "imageUrl" TEXT[];

-- AlterTable
ALTER TABLE "Prompt" DROP COLUMN "imageUrl",
ADD COLUMN     "imageUrl" TEXT[];
