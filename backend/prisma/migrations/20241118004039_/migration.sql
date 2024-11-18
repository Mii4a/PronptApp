/*
  Warnings:

  - You are about to drop the column `outputs` on the `Prompt` table. All the data in the column will be lost.
  - You are about to drop the column `prompts` on the `Prompt` table. All the data in the column will be lost.
  - Added the required column `input` to the `Prompt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `output` to the `Prompt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Prompt" DROP COLUMN "outputs",
DROP COLUMN "prompts",
ADD COLUMN     "input" TEXT NOT NULL,
ADD COLUMN     "output" TEXT NOT NULL;
