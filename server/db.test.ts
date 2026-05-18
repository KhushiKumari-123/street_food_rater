import { describe, it, expect } from "vitest";

/**
 * Safety Score Calculation Tests
 * 
 * Formula: (Hygiene * 0.35 + FoodHandling * 0.30 + WaterSource * 0.20 + WasteDisposal * 0.15) * 20
 * 
 * Grade Mapping:
 * A: >= 80
 * B: >= 60 and < 80
 * C: >= 40 and < 60
 * D: < 40
 */

function calculateSafetyScore(
  hygiene: number,
  foodHandling: number,
  waterSource: number,
  wasteDisposal: number
): { score: number; grade: string } {
  const score = (hygiene * 0.35 + foodHandling * 0.30 + waterSource * 0.20 + wasteDisposal * 0.15) * 20;
  
  let grade: string;
  if (score >= 80) grade = "A";
  else if (score >= 60) grade = "B";
  else if (score >= 40) grade = "C";
  else grade = "D";

  return { score: Math.round(score * 10) / 10, grade };
}

describe("Safety Score Calculation", () => {
  it("should calculate Grade A for excellent ratings (all 5s)", () => {
    const result = calculateSafetyScore(5, 5, 5, 5);
    expect(result.score).toBe(100);
    expect(result.grade).toBe("A");
  });

  it("should calculate Grade A for good ratings (average 4.1)", () => {
    const result = calculateSafetyScore(4.1, 4.1, 4.1, 4.1);
    expect(result.score).toBeGreaterThan(80);
    expect(result.grade).toBe("A");
  });

  it("should calculate Grade B for above-average ratings (average 3.5)", () => {
    const result = calculateSafetyScore(3.5, 3.5, 3.5, 3.5);
    expect(result.score).toBeCloseTo(70, 0);
    expect(result.grade).toBe("B");
  });

  it("should calculate Grade B for mixed good ratings", () => {
    const result = calculateSafetyScore(4, 3, 3, 3);
    expect(result.score).toBeGreaterThanOrEqual(60);
    expect(result.score).toBeLessThan(80);
    expect(result.grade).toBe("B");
  });

  it("should calculate Grade C for average ratings (average 2.5)", () => {
    const result = calculateSafetyScore(2.5, 2.5, 2.5, 2.5);
    expect(result.score).toBe(50);
    expect(result.grade).toBe("C");
  });

  it("should calculate Grade D for poor ratings (all 1s)", () => {
    const result = calculateSafetyScore(1, 1, 1, 1);
    expect(result.score).toBe(20);
    expect(result.grade).toBe("D");
  });

  it("should calculate Grade C for ratings at boundary", () => {
    const result = calculateSafetyScore(2.1, 2.1, 2.1, 2.1);
    // Score should be around 42, which is Grade C
    expect(result.score).toBeGreaterThanOrEqual(40);
    expect(result.grade).toBe("C");
  });

  it("should show that other factors matter when hygiene is low", () => {
    // High hygiene, low others
    const result1 = calculateSafetyScore(5, 1, 1, 1);
    // Low hygiene, high others
    const result2 = calculateSafetyScore(1, 5, 5, 5);
    
    // Both should have different scores
    expect(result1.score).not.toEqual(result2.score);
  });

  it("should handle mixed ratings correctly", () => {
    // Hygiene: 5, FoodHandling: 4, WaterSource: 3, WasteDisposal: 2
    const result = calculateSafetyScore(5, 4, 3, 2);
    // (5 * 0.35 + 4 * 0.30 + 3 * 0.20 + 2 * 0.15) * 20
    // (1.75 + 1.2 + 0.6 + 0.3) * 20 = 3.85 * 20 = 77
    expect(result.score).toBeCloseTo(77, 0);
    expect(result.grade).toBe("B");
  });

  it("should round scores to one decimal place", () => {
    const result = calculateSafetyScore(3, 3, 3, 3);
    expect(result.score).toBe(60);
    expect(Number.isInteger(result.score * 10)).toBe(true);
  });
});
