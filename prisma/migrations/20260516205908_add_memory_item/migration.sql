-- CreateEnum
CREATE TYPE "MemoryItemType" AS ENUM ('WORD', 'PHRASE', 'SENTENCE', 'GRAMMAR_PATTERN');

-- CreateTable
CREATE TABLE "MemoryItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "MemoryItemType" NOT NULL DEFAULT 'WORD',
    "title" TEXT NOT NULL,
    "meaning" TEXT,
    "explanation" TEXT,
    "example" TEXT,
    "contextText" TEXT,
    "deckId" TEXT,
    "cardId" TEXT,
    "essayId" TEXT,
    "difficulty" INTEGER NOT NULL DEFAULT 3,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "nextReviewAt" TIMESTAMP(3),
    "lastReviewedAt" TIMESTAMP(3),
    "isBookmarked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MemoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MemoryItem_userId_idx" ON "MemoryItem"("userId");

-- CreateIndex
CREATE INDEX "MemoryItem_userId_nextReviewAt_idx" ON "MemoryItem"("userId", "nextReviewAt");

-- CreateIndex
CREATE INDEX "MemoryItem_userId_isBookmarked_idx" ON "MemoryItem"("userId", "isBookmarked");

-- CreateIndex
CREATE INDEX "MemoryItem_deckId_idx" ON "MemoryItem"("deckId");

-- CreateIndex
CREATE INDEX "MemoryItem_cardId_idx" ON "MemoryItem"("cardId");

-- CreateIndex
CREATE INDEX "MemoryItem_essayId_idx" ON "MemoryItem"("essayId");

-- AddForeignKey
ALTER TABLE "MemoryItem" ADD CONSTRAINT "MemoryItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemoryItem" ADD CONSTRAINT "MemoryItem_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemoryItem" ADD CONSTRAINT "MemoryItem_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemoryItem" ADD CONSTRAINT "MemoryItem_essayId_fkey" FOREIGN KEY ("essayId") REFERENCES "Essay"("id") ON DELETE SET NULL ON UPDATE CASCADE;
