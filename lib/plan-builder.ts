import type {
  QuestionnaireInputs,
  WeeklyPlan,
  TrainingDay,
  PlannedExercise,
  Exercise,
  Goal,
  GeneratedPlan,
  ProgressionGuide,
  SetsRepsScheme,
} from '@/types';
import { EXERCISES } from '@/lib/exercise-db';
import { buildNutritionPlan } from '@/lib/nutrition';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function eligibleExercises(
  muscles: string[],
  equipment: string[],
  injuries: string[],
  difficulty?: string,
): Exercise[] {
  return EXERCISES.filter((ex) => {
    const muscleMatch = muscles.includes(ex.primaryMuscle) || muscles.some((m) => ex.secondaryMuscles.includes(m as never));
    const equipOk = ex.equipment.some((eq) => equipment.includes(eq));
    const injurySafe = !ex.injuriesToAvoid.some((inj) => injuries.includes(inj));
    const diffOk = !difficulty || ex.difficulty === difficulty || difficulty === 'intermediate';
    return muscleMatch && equipOk && injurySafe && diffOk;
  });
}

function pickExercises(
  muscles: string[],
  equipment: string[],
  injuries: string[],
  count: number,
  inputs: QuestionnaireInputs,
  preferIds?: string[],
): Exercise[] {
  const pool = eligibleExercises(muscles, equipment, injuries);
  // Deterministic: sort by id then pick preferred first
  const sorted = pool.sort((a, b) => a.id.localeCompare(b.id));
  const preferred = preferIds
    ? sorted.filter((ex) => preferIds.includes(ex.id))
    : [];
  const rest = sorted.filter((ex) => !preferred.includes(ex));
  return [...preferred, ...rest].slice(0, count);
}

function getScheme(ex: Exercise, goal: Goal, experienceLevel: string): SetsRepsScheme {
  const base = ex.recommendedSetsReps[goal];
  const setMod = experienceLevel === 'beginner' ? -1 : experienceLevel === 'advanced' ? 1 : 0;
  return {
    ...base,
    sets: Math.max(2, base.sets + setMod),
  };
}

function targetWeight(ex: Exercise, inputs: QuestionnaireInputs): number | undefined {
  const lifts = inputs.currentLifts;
  const liftMap: Record<string, number | undefined> = {
    'barbell-bench-press': lifts.benchPress ? lifts.benchPress * 0.75 : undefined,
    'barbell-squat': lifts.squat ? lifts.squat * 0.75 : undefined,
    'deadlift': lifts.deadlift ? lifts.deadlift * 0.75 : undefined,
    'overhead-press': lifts.overheadPress ? lifts.overheadPress * 0.75 : undefined,
    'barbell-row': lifts.bentOverRow ? lifts.bentOverRow * 0.75 : undefined,
    'romanian-deadlift': lifts.deadlift ? lifts.deadlift * 0.55 : undefined,
  };
  return liftMap[ex.id];
}

function makePlanned(ex: Exercise, inputs: QuestionnaireInputs): PlannedExercise {
  const scheme = getScheme(ex, inputs.goal, inputs.experienceLevel);
  return {
    exerciseId: ex.id,
    exercise: ex,
    sets: scheme.sets,
    reps: scheme.reps,
    rest: scheme.rest,
    targetWeight: targetWeight(ex, inputs),
    rir: scheme.rir,
  };
}

function makeDay(
  name: string,
  focus: string,
  muscles: string[],
  inputs: QuestionnaireInputs,
  count: number,
  preferIds?: string[],
): TrainingDay {
  const exs = pickExercises(muscles, inputs.equipment, inputs.injuries, count, inputs, preferIds);
  const exercises = exs.map((ex) => makePlanned(ex, inputs));
  return {
    name,
    focus,
    exercises,
    duration: inputs.sessionDuration,
  };
}

// ─── Split builders ───────────────────────────────────────────────────────────

function build2Day(inputs: QuestionnaireInputs): WeeklyPlan {
  const exPerDay = Math.min(8, Math.max(5, Math.floor(inputs.sessionDuration / 10)));
  const allMuscles = ['chest', 'back', 'shoulders', 'legs', 'arms', 'core', 'calves'];
  const dayA = makeDay('Ganzkörper A', 'Kraftfokus', allMuscles, inputs, exPerDay, ['barbell-squat','barbell-bench-press','barbell-row','overhead-press']);
  const dayB = makeDay('Ganzkörper B', 'Hypertrophiefokus', allMuscles, inputs, exPerDay, ['deadlift','dumbbell-bench-press','pull-up','dumbbell-shoulder-press']);
  return { days: [dayA, dayB], splitType: 'Ganzkörper A/B' };
}

function build3Day(inputs: QuestionnaireInputs): WeeklyPlan {
  const exPerDay = Math.min(7, Math.max(5, Math.floor(inputs.sessionDuration / 10)));
  const push = makeDay('Drücken', 'Brust · Schultern · Trizeps', ['chest','shoulders','triceps'], inputs, exPerDay, ['barbell-bench-press','overhead-press','close-grip-bench']);
  const pull = makeDay('Ziehen',  'Rücken · Bizeps · Hintere Schulter', ['back','lats','biceps','traps'], inputs, exPerDay, ['barbell-row','pull-up','barbell-curl']);
  const legs = makeDay('Beine',   'Quadrizeps · Oberschenkelrückseite · Gesäß · Waden', ['quads','hamstrings','glutes','calves','core'], inputs, exPerDay, ['barbell-squat','romanian-deadlift','hip-thrust','calf-raise']);
  return { days: [push, pull, legs], splitType: 'Drücken / Ziehen / Beine' };
}

function build4Day(inputs: QuestionnaireInputs): WeeklyPlan {
  const exPerDay = Math.min(7, Math.max(5, Math.floor(inputs.sessionDuration / 10)));
  const upperA = makeDay('Oberkörper A', 'Kraft — Brust · Rücken · Schultern', ['chest','back','shoulders','triceps','biceps'], inputs, exPerDay, ['barbell-bench-press','barbell-row','overhead-press']);
  const lowerA = makeDay('Unterkörper A', 'Kraft — Kniebeugen & Kreuzheben', ['quads','hamstrings','glutes','calves','core'], inputs, exPerDay, ['barbell-squat','deadlift','romanian-deadlift']);
  const upperB = makeDay('Oberkörper B', 'Hypertrophie — Brust · Rücken · Arme', ['chest','back','biceps','triceps','shoulders'], inputs, exPerDay, ['dumbbell-bench-press','lat-pulldown','dumbbell-curl','tricep-pushdown']);
  const lowerB = makeDay('Unterkörper B', 'Hypertrophie — Beine & Rumpf', ['quads','hamstrings','glutes','calves','core'], inputs, exPerDay, ['leg-press','leg-curl','hip-thrust','seated-calf-raise']);
  return { days: [upperA, lowerA, upperB, lowerB], splitType: 'Oberkörper / Unterkörper' };
}

function build5Day(inputs: QuestionnaireInputs): WeeklyPlan {
  const exPerDay = Math.min(7, Math.max(5, Math.floor(inputs.sessionDuration / 10)));
  const push = makeDay('Drücken',  'Brust · Schultern · Trizeps', ['chest','shoulders','triceps'], inputs, exPerDay, ['barbell-bench-press','overhead-press','close-grip-bench']);
  const pull = makeDay('Ziehen',   'Rücken · Bizeps · Hintere Schulter', ['back','lats','biceps'], inputs, exPerDay, ['barbell-row','pull-up','barbell-curl']);
  const legs = makeDay('Beine',    'Quadrizeps · Oberschenkelrückseite · Gesäß', ['quads','hamstrings','glutes','calves'], inputs, exPerDay, ['barbell-squat','romanian-deadlift','hip-thrust']);
  const spec = makeDay(
    'Spezialisierung',
    inputs.weakPoints.length ? inputs.weakPoints.join(' · ') : 'Arme · Rumpf',
    inputs.weakPoints.length ? inputs.weakPoints : ['arms','core'],
    inputs, exPerDay
  );
  const cardioCore = makeDay('Rumpf & Konditionierung', 'Rumpf · Waden · Cardio', ['core','calves'], inputs, 5);
  return { days: [push, pull, legs, spec, cardioCore], splitType: 'PPL + Spezialisierung' };
}

function build6Day(inputs: QuestionnaireInputs): WeeklyPlan {
  const exPerDay = Math.min(7, Math.max(5, Math.floor(inputs.sessionDuration / 10)));
  const pushA = makeDay('Drücken A', 'Brust · Schultern · Trizeps (Schwer)', ['chest','shoulders','triceps'], inputs, exPerDay, ['barbell-bench-press','overhead-press','close-grip-bench']);
  const pullA = makeDay('Ziehen A',  'Rücken · Bizeps (Schwer)',              ['back','lats','biceps'], inputs, exPerDay, ['deadlift','barbell-row','barbell-curl']);
  const legsA = makeDay('Beine A',   'Quadrizeps-Fokus',                      ['quads','calves','core'], inputs, exPerDay, ['barbell-squat','leg-press','calf-raise']);
  const pushB = makeDay('Drücken B', 'Brust · Schultern · Trizeps (Volumen)', ['chest','shoulders','triceps'], inputs, exPerDay, ['dumbbell-bench-press','dumbbell-shoulder-press','tricep-pushdown']);
  const pullB = makeDay('Ziehen B',  'Rücken · Hintere Kette (Volumen)',       ['back','lats','biceps','traps'], inputs, exPerDay, ['pull-up','cable-row','hammer-curl','rear-delt-fly']);
  const legsB = makeDay('Beine B',   'Hintere Kette-Fokus',                   ['hamstrings','glutes','calves'], inputs, exPerDay, ['romanian-deadlift','hip-thrust','leg-curl','seated-calf-raise']);
  return { days: [pushA, pullA, legsA, pushB, pullB, legsB], splitType: '6-Tage PPL' };
}

// ─── Deload ───────────────────────────────────────────────────────────────────

export function buildDeloadWeek(plan: WeeklyPlan): WeeklyPlan {
  return {
    splitType: plan.splitType + ' (Deload)',
    days: plan.days.map((day) => ({
      ...day,
      name: day.name + ' — Deload',
      exercises: day.exercises.map((ex) => ({
        ...ex,
        sets: Math.max(2, ex.sets - 1),
        targetWeight: ex.targetWeight ? Math.round(ex.targetWeight * 0.6 * 2) / 2 : undefined,
        notes: 'Deload: 60% des Arbeitsgewichts. Fokus auf Technik.',
      })),
    })),
  };
}

// ─── Progression guide ────────────────────────────────────────────────────────

function buildProgressionGuide(inputs: QuestionnaireInputs): ProgressionGuide {
  const isStrength = inputs.goal === 'strength';
  const weeklyIncrease = isStrength ? 2.5 : 1.25;
  return {
    weeklyIncrease,
    deloadFrequency: inputs.experienceLevel === 'advanced' ? 4 : 6,
    deloadProtocol: 'Gewicht um 40% reduzieren, Wiederholungen und Sätze beibehalten. Technikfokus. Dauer: eine Woche.',
    progressionMethod: isStrength ? 'Lineare Periodisierung — Gewicht erhöhen, wenn alle Sätze erfolgreich abgeschlossen wurden' : 'Doppelte Progression — erst Wiederholungen steigern, dann Gewicht erhöhen wenn das obere Ende des Wiederholungsbereichs erreicht ist',
    milestones: [
      `Woche 4: Anstreben von ${Math.round(inputs.currentLifts.benchPress ?? 60 * 1.05)}kg Bankdrücken`,
      `Woche 8: Deload-Woche — Fortschritt evaluieren und neu kalibrieren`,
      `Woche 12: 1RM-Maximalgewichte nachtesten und Plan aktualisieren`,
    ],
  };
}

// ─── Main builder ─────────────────────────────────────────────────────────────

export function buildPlan(inputs: QuestionnaireInputs): GeneratedPlan {
  let weeklyPlan: WeeklyPlan;
  switch (inputs.trainingDays) {
    case 2:  weeklyPlan = build2Day(inputs); break;
    case 3:  weeklyPlan = build3Day(inputs); break;
    case 4:  weeklyPlan = build4Day(inputs); break;
    case 5:  weeklyPlan = build5Day(inputs); break;
    case 6:  weeklyPlan = build6Day(inputs); break;
    default: weeklyPlan = build4Day(inputs);
  }

  // Include extra cardio notes when requested
  if (inputs.includeCardio && inputs.cardioPreference !== 'none') {
    weeklyPlan.days.forEach((day, i) => {
      if (i < inputs.trainingDays) {
        const cardioNote = inputs.cardioPreference === 'hiit'
          ? 'Nach dem Training: 15 Min. HIIT (20 Sek. Sprint / 40 Sek. Pause × 15 Runden)'
          : 'Nach dem Training: 20–30 Min. LISS Cardio (65–70% max. Herzfrequenz)';
        day.exercises.push({
          exerciseId: 'cardio',
          exercise: {
            id: 'cardio',
            name: inputs.cardioPreference === 'hiit' ? 'HIIT Cardio' : 'LISS Cardio',
            description: cardioNote,
            primaryMuscle: 'core',
            secondaryMuscles: [],
            difficulty: 'beginner',
            equipment: ['bodyweight'],
            injuriesToAvoid: [],
            recommendedSetsReps: {
              strength: { sets: 1, reps: '1', rest: '-' },
              hypertrophy: { sets: 1, reps: '1', rest: '-' },
              definition: { sets: 1, reps: '1', rest: '-' },
              recomp: { sets: 1, reps: '1', rest: '-' },
            },
            formCues: [],
            commonMistakes: [],
            alternatives: [],
          },
          sets: 1,
          reps: inputs.cardioPreference === 'hiit' ? '15 Runden' : '20-30 Min.',
          rest: '-',
          notes: cardioNote,
        });
      }
    });
  }

  const id = `plan-${inputs.age}-${inputs.weight}-${inputs.trainingDays}-${inputs.goal}`;
  const goalLabels: Record<string, string> = {
    strength: 'Kraft', hypertrophy: 'Muskelaufbau', definition: 'Definition', recomp: 'Recomp'
  };

  return {
    id,
    name: `${goalLabels[inputs.goal]} Plan — ${weeklyPlan.splitType}`,
    createdAt: new Date().toISOString(),
    inputs,
    weeklyPlan,
    nutrition: buildNutritionPlan(inputs),
    progression: buildProgressionGuide(inputs),
    deloadWeek: buildDeloadWeek(weeklyPlan),
  };
}

export function calcOneRM(weight: number, reps: number, formula: 'epley' | 'brzycki' | 'lander' = 'epley'): number {
  if (reps === 1) return weight;
  switch (formula) {
    case 'epley':   return Math.round(weight * (1 + reps / 30));
    case 'brzycki': return Math.round(weight * (36 / (37 - reps)));
    case 'lander':  return Math.round((100 * weight) / (101.3 - 2.67123 * reps));
  }
}
