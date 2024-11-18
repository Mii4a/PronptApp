/*
  Warnings:

  - You are about to drop the column `output` on the `Prompt` table. All the data in the column will be lost.
  - You are about to drop the column `prompt` on the `Prompt` table. All the data in the column will be lost.
  - Added the required column `outputs` to the `Prompt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prompts` to the `Prompt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Prompt" DROP COLUMN "output",
DROP COLUMN "prompt",
ADD COLUMN     "outputs" TEXT NOT NULL,
ADD COLUMN     "prompts" TEXT NOT NULL,
ALTER COLUMN "imageUrls" SET NOT NULL,
ALTER COLUMN "imageUrls" SET DATA TYPE TEXT;
