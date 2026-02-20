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
  return `30–60 Min. vor dem Training: ${Math.round(inputs.weight * 0.3)}g Kohlenhydrate + ${Math.round(inputs.weight * 0.2)}g Protein. Beispiel: Banane + Whey-Shake oder Reis + Hähnchen.`;
}

function postworkoutAdvice(inputs: QuestionnaireInputs): string {
  return `Innerhalb von 30–60 Min. nach dem Training: ${Math.round(inputs.weight * 0.4)}g Kohlenhydrate + ${Math.round(inputs.weight * 0.3)}g Protein. Beispiel: Weißer Reis + Whey oder griechischer Joghurt + Früchte.`;
}

function mealTimingAdvice(inputs: QuestionnaireInputs): string[] {
  const meals = inputs.mealsPerDay;
  const advice: string[] = [
    `Verteile dein Proteinziel von ${Math.round(inputs.weight * (inputs.experienceLevel === 'advanced' ? 2.2 : 2.0))}g auf ${meals} Mahlzeiten (~${Math.round((inputs.weight * (inputs.experienceLevel === 'advanced' ? 2.2 : 2.0)) / meals)}g pro Mahlzeit).`,
  ];
  if (meals >= 4) advice.push('Nimm eine proteinreiche Mahlzeit vor dem Schlafen (Kasein oder Hüttenkäse) für nächtliche Muskelsynthese.');
  advice.push('Gehe tagsüber nicht mehr als 4–5 Stunden ohne eine proteinhaltige Mahlzeit.');
  if (inputs.goal === 'definition') {
    advice.push('Platziere deine kohlenhydratreichsten Mahlzeiten rund ums Training (vor + nach dem Training).');
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
    hydration: `Trinke täglich mindestens ${(inputs.weight * 0.035).toFixed(1)}L Wasser. Füge an Trainingstagen extra 500–750 ml hinzu.`,
    supplements: SUPPLEMENT_RECOMMENDATIONS[inputs.experienceLevel] ?? SUPPLEMENT_RECOMMENDATIONS.beginner,
  };
}
