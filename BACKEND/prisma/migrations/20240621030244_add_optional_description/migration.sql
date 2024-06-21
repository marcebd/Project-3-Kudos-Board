/*
  Warnings:

  - Added the required column `boardId` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_title_fkey";

-- DropIndex
DROP INDEX "Board_id_key";

-- AlterTable
ALTER TABLE "Board" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "boardId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
