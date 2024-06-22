/*
  Warnings:

  - Made the column `upvotes` on table `Card` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "author" TEXT,
ALTER COLUMN "upvotes" SET NOT NULL,
ALTER COLUMN "upvotes" SET DEFAULT 0;
