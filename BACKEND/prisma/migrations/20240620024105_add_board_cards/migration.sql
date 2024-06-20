-- CreateEnum
CREATE TYPE "Category" AS ENUM ('celebration', 'thankyou', 'inspiration', 'jokes', 'AITA');

-- CreateTable
CREATE TABLE "Board" (
    "id" SERIAL NOT NULL,
    "imgUrl" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "Category" NOT NULL,

    CONSTRAINT "Board_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "id" SERIAL NOT NULL,
    "creator" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "GIFUrl" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "upvotes" INTEGER NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Board_id_key" ON "Board"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Board_title_key" ON "Board"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Card_id_key" ON "Card"("id");

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_title_fkey" FOREIGN KEY ("title") REFERENCES "Board"("title") ON DELETE RESTRICT ON UPDATE CASCADE;
