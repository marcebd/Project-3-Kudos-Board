/*
  Warnings:

  - You are about to drop the column `author` on the `Card` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Card" DROP COLUMN "author",
ADD COLUMN     "comment" TEXT;
