import type { Place, Budget } from '@/types';
import { budgetScore } from './format';

export interface RecommendationResult {
  place: Place;
  score: number;
  reasons: string[];
}

export interface RecommendCriteria {
  maxBudget?: Budget;
  preferredCategory?: string;
  requireAccessibility?: boolean;
  minRating?: number;
}

export function recommendPlaces(
  places: Place[],
  criteria: RecommendCriteria
): RecommendationResult[] {
  const results: RecommendationResult[] = places.map((place) => {
    let score = 0;
    const reasons: string[] = [];

    // Budget alignment
    if (criteria.maxBudget) {
      const placeBudgetScore = budgetScore(place.budget);
      const maxBudgetScore = budgetScore(criteria.maxBudget);
      if (placeBudgetScore >= maxBudgetScore) {
        score += 30;
        reasons.push(`Fits ${place.budget === 'Free' ? 'free' : place.budget.toLowerCase()} budget`);
      } else {
        score -= 10;
      }
    }

    // Category match
    if (criteria.preferredCategory && criteria.preferredCategory !== 'All') {
      if (place.category === criteria.preferredCategory) {
        score += 25;
        reasons.push(`Matches "${place.category}" category`);
      } else {
        score -= 5;
      }
    }

    // Accessibility
    if (criteria.requireAccessibility) {
      if (place.accessibility >= 4) {
        score += 20;
        reasons.push('Good accessibility rating');
      } else {
        score -= 10;
      }
    }

    // Rating
    if (criteria.minRating && place.rating >= criteria.minRating) {
      score += 15;
      reasons.push(`High community rating (${place.rating.toFixed(1)}★)`);
    } else if (!criteria.minRating && place.rating >= 4.5) {
      score += 10;
      reasons.push(`Well-rated (${place.rating.toFixed(1)}★)`);
    }

    // Cleanliness bonus
    if (place.cleanliness >= 4) {
      score += 10;
      reasons.push('Clean and well-maintained');
    }

    return { place, score, reasons };
  });

  return results
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
}
