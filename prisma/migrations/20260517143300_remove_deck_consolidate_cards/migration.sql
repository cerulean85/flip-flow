-- Remove Deck model, consolidate Cards under User, preserve deck title as Card.category.

-- 1. Add nullable userId / category columns to Card so we can backfill safely.
ALTER TABLE "Card" ADD COLUMN "userId" TEXT;
ALTER TABLE "Card" ADD COLUMN "category" TEXT;

-- 2. Backfill from Deck.
UPDATE "Card"
   SET "userId"   = "Deck"."userId",
       "category" = "Deck"."title"
  FROM "Deck"
 WHERE "Card"."deckId" = "Deck"."id";

-- 3. Drop any orphan cards that had no matching deck (should be none in practice).
DELETE FROM "Card" WHERE "userId" IS NULL;

-- 4. Enforce NOT NULL on userId now that backfill is done.
ALTER TABLE "Card" ALTER COLUMN "userId" SET NOT NULL;

-- 5. Drop old deckId FK + indexes + column on Card.
ALTER TABLE "Card" DROP CONSTRAINT IF EXISTS "Card_deckId_fkey";
DROP INDEX IF EXISTS "Card_deckId_idx";
DROP INDEX IF EXISTS "Card_deckId_isBookmark_idx";
ALTER TABLE "Card" DROP COLUMN "deckId";

-- 6. Add new FK + indexes for Card.userId / category.
ALTER TABLE "Card"
  ADD CONSTRAINT "Card_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
CREATE INDEX "Card_userId_idx" ON "Card"("userId");
CREATE INDEX "Card_userId_isBookmark_idx" ON "Card"("userId", "isBookmark");
CREATE INDEX "Card_userId_category_idx" ON "Card"("userId", "category");

-- 7. Drop MemoryItem.deckId FK + index + column.
ALTER TABLE "MemoryItem" DROP CONSTRAINT IF EXISTS "MemoryItem_deckId_fkey";
DROP INDEX IF EXISTS "MemoryItem_deckId_idx";
ALTER TABLE "MemoryItem" DROP COLUMN "deckId";

-- 8. Drop Deck table.
DROP TABLE "Deck";
