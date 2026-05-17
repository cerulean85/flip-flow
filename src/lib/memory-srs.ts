export type Grade = "AGAIN" | "HARD" | "GOOD" | "EASY"

export interface ReviewState {
  difficulty: number
  reviewCount: number
}

export interface ReviewResult {
  nextReviewAt: Date
  nextDifficulty: number
}

const baseHours: Record<Grade, number> = {
  AGAIN: 10 / 60,
  HARD: 24,
  GOOD: 72,
  EASY: 168,
}

const difficultyDeltas: Record<Grade, number> = {
  AGAIN: 1,
  HARD: 0.5,
  GOOD: 0,
  EASY: -0.5,
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function roundToOneDecimal(value: number): number {
  return Math.round(value * 10) / 10
}

export function computeNextReview(
  current: ReviewState,
  grade: Grade,
  now?: Date
): ReviewResult {
  const difficulty = Number.isFinite(current.difficulty) ? current.difficulty : 3
  const reviewCount =
    Number.isFinite(current.reviewCount) && current.reviewCount >= 0
      ? current.reviewCount
      : 0
  const currentTime = now ?? new Date()
  const difficultyFactor = grade === "AGAIN" ? 1 : 1 + (3 - difficulty) * 0.1
  const repetitionFactor = 1 + Math.log(reviewCount + 1) * 0.1
  const hours = baseHours[grade] * difficultyFactor * repetitionFactor
  const nextDifficulty = roundToOneDecimal(
    clamp(difficulty + difficultyDeltas[grade], 1, 5)
  )

  return {
    nextReviewAt: new Date(currentTime.getTime() + hours * 60 * 60 * 1000),
    nextDifficulty,
  }
}
