import { describe, expect, it } from "vitest"
import { computeNextReview, type Grade } from "./memory-srs"

const FIXED_NOW = new Date("2026-05-17T00:00:00Z")
const HOUR_MS = 60 * 60 * 1000

function hoursFromNow(date: Date, base: Date = FIXED_NOW): number {
  return (date.getTime() - base.getTime()) / HOUR_MS
}

describe("computeNextReview", () => {
  it("schedules AGAIN around 10 minutes ahead for a fresh item", () => {
    const result = computeNextReview(
      { difficulty: 3, reviewCount: 0 },
      "AGAIN",
      FIXED_NOW
    )
    // baseHours["AGAIN"] is 10/60 hours; difficulty 3 makes difficultyFactor = 1 (only AGAIN uses 1).
    // repetitionFactor for reviewCount 0 = 1.
    expect(hoursFromNow(result.nextReviewAt)).toBeCloseTo(10 / 60, 5)
    // AGAIN bumps difficulty by +1.
    expect(result.nextDifficulty).toBe(4)
  })

  it("schedules GOOD ~72 hours ahead for a default item", () => {
    const result = computeNextReview(
      { difficulty: 3, reviewCount: 0 },
      "GOOD",
      FIXED_NOW
    )
    expect(hoursFromNow(result.nextReviewAt)).toBeCloseTo(72, 1)
    expect(result.nextDifficulty).toBe(3)
  })

  it("schedules EASY ~168 hours ahead and lowers difficulty", () => {
    const result = computeNextReview(
      { difficulty: 3, reviewCount: 0 },
      "EASY",
      FIXED_NOW
    )
    expect(hoursFromNow(result.nextReviewAt)).toBeCloseTo(168, 1)
    expect(result.nextDifficulty).toBe(2.5)
  })

  it("increases interval when reviewCount grows (repetition factor)", () => {
    const first = computeNextReview(
      { difficulty: 3, reviewCount: 0 },
      "GOOD",
      FIXED_NOW
    )
    const later = computeNextReview(
      { difficulty: 3, reviewCount: 10 },
      "GOOD",
      FIXED_NOW
    )
    expect(hoursFromNow(later.nextReviewAt)).toBeGreaterThan(
      hoursFromNow(first.nextReviewAt)
    )
  })

  it("lengthens interval for easier items (lower difficulty -> larger factor)", () => {
    const easierItem = computeNextReview(
      { difficulty: 1, reviewCount: 0 },
      "GOOD",
      FIXED_NOW
    )
    const harderItem = computeNextReview(
      { difficulty: 5, reviewCount: 0 },
      "GOOD",
      FIXED_NOW
    )
    expect(hoursFromNow(easierItem.nextReviewAt)).toBeGreaterThan(
      hoursFromNow(harderItem.nextReviewAt)
    )
  })

  it("clamps difficulty between 1 and 5", () => {
    const minClamped = computeNextReview(
      { difficulty: 1, reviewCount: 0 },
      "EASY",
      FIXED_NOW
    )
    expect(minClamped.nextDifficulty).toBe(1)

    const maxClamped = computeNextReview(
      { difficulty: 5, reviewCount: 0 },
      "AGAIN",
      FIXED_NOW
    )
    expect(maxClamped.nextDifficulty).toBe(5)
  })

  it("handles non-finite difficulty by defaulting to 3", () => {
    const result = computeNextReview(
      { difficulty: Number.NaN, reviewCount: 0 },
      "GOOD",
      FIXED_NOW
    )
    expect(result.nextDifficulty).toBe(3)
  })

  it("treats negative reviewCount as zero", () => {
    const negative = computeNextReview(
      { difficulty: 3, reviewCount: -5 },
      "GOOD",
      FIXED_NOW
    )
    const zero = computeNextReview(
      { difficulty: 3, reviewCount: 0 },
      "GOOD",
      FIXED_NOW
    )
    expect(hoursFromNow(negative.nextReviewAt)).toBeCloseTo(
      hoursFromNow(zero.nextReviewAt),
      5
    )
  })

  it("uses current time when now is omitted (smoke check)", () => {
    const before = Date.now()
    const result = computeNextReview(
      { difficulty: 3, reviewCount: 0 },
      "AGAIN"
    )
    const after = Date.now()
    // AGAIN schedules ~10 minutes ahead from "now"
    const expectedMs = (10 / 60) * 60 * 60 * 1000
    expect(result.nextReviewAt.getTime()).toBeGreaterThanOrEqual(before + expectedMs - 1000)
    expect(result.nextReviewAt.getTime()).toBeLessThanOrEqual(after + expectedMs + 1000)
  })

  it("produces a valid date for every grade", () => {
    const grades: Grade[] = ["AGAIN", "HARD", "GOOD", "EASY"]
    for (const grade of grades) {
      const result = computeNextReview(
        { difficulty: 3, reviewCount: 1 },
        grade,
        FIXED_NOW
      )
      expect(Number.isFinite(result.nextReviewAt.getTime())).toBe(true)
      expect(result.nextDifficulty).toBeGreaterThanOrEqual(1)
      expect(result.nextDifficulty).toBeLessThanOrEqual(5)
    }
  })
})
