import type { QuestionnaireInputs, NutritionPlan, MacroTargets } from '@/types';
import { SUPPLEMENT_RECOMMENDATIONS } from '@/lib/constants';

function calcBMR(inputs: QuestionnaireInputs): number {
  const { weight, height, age, gender } = inputs;
  if (gender === 'male') {
    return 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
  }
  return 447.593 + 9.247 * weight + 3.098 * height - 4.330 * age;
}

function activityMultiplier(inputs: QuestionnaireInputs): number {
  const base: Record<string, number> = {
    sedentary: 1.4,
    moderate: 1.6,
    active: 1.725,
  };
  const mult = base[inputs.activityLevel] ?? 1.55;
  const trainingBonus = inputs.trainingDays >= 5 ? 200 : inputs.trainingDays >= 3 ? 150 : 100;
  return mult + trainingBonus / (calcBMR(inputs) || 1);
}

function targetCalories(tdee: number, inputs: QuestionnaireInputs): number {
  switch (inputs.goal) {
    case 'strength':    return Math.round(tdee + 200);
    case 'hypertrophy': return Math.round(tdee + 300);
    case 'definition':  return Math.round(tdee - 350);
    case 'recomp':      return Math.round(tdee);
    default:            return Math.round(tdee);
  }
}

function calcMacros(calories: number, inputs: QuestionnaireInputs): MacroTargets {
  const proteinPerKg = inputs.experienceLevel === 'advanced' ? 2.2 : 2.0;
  const protein = Math.round(inputs.weight * proteinPerKg);

  const carbPct = inputs.goal === 'definition' ? 0.35
    : inputs.goal === 'strength' ? 0.40
    : 0.42;

  const carbs = Math.round((calories * carbPct) / 4);
  const fat = Math.round((calories * 0.25) / 9);

  return { calories, protein, carbs, fat };
}

function preworkoutAdvice(inputs: QuestionnaireInputs): string {
  return `Consume 30–60 min before training: ${Math.round(inputs.weight * 0.3)}g carbs + ${Math.round(inputs.weight * 0.2)}g protein. Example: banana + whey shake or rice + chicken.`;
}

function postworkoutAdvice(inputs: QuestionnaireInputs): string {
  return `Within 30–60 min post-training: ${Math.round(inputs.weight * 0.4)}g carbs + ${Math.round(inputs.weight * 0.3)}g protein. Example: white rice + whey or Greek yogurt + fruit.`;
}

function mealTimingAdvice(inputs: QuestionnaireInputs): string[] {
  const meals = inputs.mealsPerDay;
  const advice: string[] = [
    `Split your ${Math.round(inputs.weight * (inputs.experienceLevel === 'advanced' ? 2.2 : 2.0))}g protein target across all ${meals} meals (~${Math.round((inputs.weight * (inputs.experienceLevel === 'advanced' ? 2.2 : 2.0)) / meals)}g per meal).`,
  ];
  if (meals >= 4) advice.push('Include a pre-sleep protein meal (casein or cottage cheese) for overnight muscle protein synthesis.');
  advice.push('Do not go more than 4–5 hours without a protein-containing meal during waking hours.');
  if (inputs.goal === 'definition') {
    advice.push('Consider placing your largest carb meals around training (pre + post workout).');
  }
  return advice;
}

export function buildNutritionPlan(inputs: QuestionnaireInputs): NutritionPlan {
  const bmr = Math.round(calcBMR(inputs));
  const tdee = Math.round(bmr * activityMultiplier(inputs));
  const targetCals = targetCalories(tdee, inputs);
  const macros = calcMacros(targetCals, inputs);

  return {
    bmr,
    tdee,
    targetCalories: targetCals,
    macros,
    preworkout: preworkoutAdvice(inputs),
    postworkout: postworkoutAdvice(inputs),
    mealTiming: mealTimingAdvice(inputs),
    hydration: `Drink at least ${(inputs.weight * 0.035).toFixed(1)}L of water daily. Add an extra 500–750ml on training days.`,
    supplements: SUPPLEMENT_RECOMMENDATIONS[inputs.experienceLevel] ?? SUPPLEMENT_RECOMMENDATIONS.beginner,
  };
}
