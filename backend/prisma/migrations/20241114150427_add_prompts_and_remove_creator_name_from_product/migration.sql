/*
  Warnings:

  - The values [APP] on the enum `ProductType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `content` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `creatorName` on the `Product` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProductType_new" AS ENUM ('WEBAPP', 'PROMPT');
ALTER TABLE "Product" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Product" ALTER COLUMN "type" TYPE "ProductType_new" USING ("type"::text::"ProductType_new");
ALTER TYPE "ProductType" RENAME TO "ProductType_old";
ALTER TYPE "ProductType_new" RENAME TO "ProductType";
DROP TYPE "ProductType_old";
ALTER TABLE "Product" ALTER COLUMN "type" SET DEFAULT 'PROMPT';
COMMIT;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "content",
DROP COLUMN "creatorName",
ADD COLUMN     "demoUrl" TEXT,
ADD COLUMN     "features" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "promptCount" INTEGER;

-- CreateTable
CREATE TABLE "Prompt" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "prompt" TEXT NOT NULL,
    "output" TEXT NOT NULL,

    CONSTRAINT "Prompt_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Prompt" ADD CONSTRAINT "Prompt_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
