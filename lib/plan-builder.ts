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
  const dayA = makeDay('Full Body A', 'Strength Focus', allMuscles, inputs, exPerDay, ['barbell-squat','barbell-bench-press','barbell-row','overhead-press']);
  const dayB = makeDay('Full Body B', 'Hypertrophy Focus', allMuscles, inputs, exPerDay, ['deadlift','dumbbell-bench-press','pull-up','dumbbell-shoulder-press']);
  return { days: [dayA, dayB], splitType: 'Full Body A/B' };
}

function build3Day(inputs: QuestionnaireInputs): WeeklyPlan {
  const exPerDay = Math.min(7, Math.max(5, Math.floor(inputs.sessionDuration / 10)));
  const push = makeDay('Push', 'Chest · Shoulders · Triceps', ['chest','shoulders','triceps'], inputs, exPerDay, ['barbell-bench-press','overhead-press','close-grip-bench']);
  const pull = makeDay('Pull', 'Back · Biceps · Rear Delts',  ['back','lats','biceps','traps'], inputs, exPerDay, ['barbell-row','pull-up','barbell-curl']);
  const legs = makeDay('Legs', 'Quads · Hamstrings · Glutes · Calves', ['quads','hamstrings','glutes','calves','core'], inputs, exPerDay, ['barbell-squat','romanian-deadlift','hip-thrust','calf-raise']);
  return { days: [push, pull, legs], splitType: 'Push / Pull / Legs' };
}

function build4Day(inputs: QuestionnaireInputs): WeeklyPlan {
  const exPerDay = Math.min(7, Math.max(5, Math.floor(inputs.sessionDuration / 10)));
  const upperA = makeDay('Upper A', 'Strength — Chest · Back · Shoulders', ['chest','back','shoulders','triceps','biceps'], inputs, exPerDay, ['barbell-bench-press','barbell-row','overhead-press']);
  const lowerA = makeDay('Lower A', 'Strength — Squats & Deadlifts', ['quads','hamstrings','glutes','calves','core'], inputs, exPerDay, ['barbell-squat','deadlift','romanian-deadlift']);
  const upperB = makeDay('Upper B', 'Hypertrophy — Chest · Back · Arms', ['chest','back','biceps','triceps','shoulders'], inputs, exPerDay, ['dumbbell-bench-press','lat-pulldown','dumbbell-curl','tricep-pushdown']);
  const lowerB = makeDay('Lower B', 'Hypertrophy — Legs & Core', ['quads','hamstrings','glutes','calves','core'], inputs, exPerDay, ['leg-press','leg-curl','hip-thrust','seated-calf-raise']);
  return { days: [upperA, lowerA, upperB, lowerB], splitType: 'Upper / Lower' };
}

function build5Day(inputs: QuestionnaireInputs): WeeklyPlan {
  const exPerDay = Math.min(7, Math.max(5, Math.floor(inputs.sessionDuration / 10)));
  const push = makeDay('Push',   'Chest · Shoulders · Triceps', ['chest','shoulders','triceps'], inputs, exPerDay, ['barbell-bench-press','overhead-press','close-grip-bench']);
  const pull = makeDay('Pull',   'Back · Biceps · Rear Delts',  ['back','lats','biceps'], inputs, exPerDay, ['barbell-row','pull-up','barbell-curl']);
  const legs = makeDay('Legs',   'Quads · Hamstrings · Glutes', ['quads','hamstrings','glutes','calves'], inputs, exPerDay, ['barbell-squat','romanian-deadlift','hip-thrust']);
  const spec = makeDay(
    'Specialization',
    inputs.weakPoints.length ? inputs.weakPoints.join(' · ') : 'Arms · Core',
    inputs.weakPoints.length ? inputs.weakPoints : ['arms','core'],
    inputs, exPerDay
  );
  const cardioCore = makeDay('Core & Conditioning', 'Core · Calves · Cardio', ['core','calves'], inputs, 5);
  return { days: [push, pull, legs, spec, cardioCore], splitType: 'PPL + Specialization' };
}

function build6Day(inputs: QuestionnaireInputs): WeeklyPlan {
  const exPerDay = Math.min(7, Math.max(5, Math.floor(inputs.sessionDuration / 10)));
  const pushA = makeDay('Push A', 'Chest · Shoulders · Triceps (Heavy)', ['chest','shoulders','triceps'], inputs, exPerDay, ['barbell-bench-press','overhead-press','close-grip-bench']);
  const pullA = makeDay('Pull A', 'Back · Biceps (Heavy)',                 ['back','lats','biceps'], inputs, exPerDay, ['deadlift','barbell-row','barbell-curl']);
  const legsA = makeDay('Legs A', 'Quads Dominant',                        ['quads','calves','core'], inputs, exPerDay, ['barbell-squat','leg-press','calf-raise']);
  const pushB = makeDay('Push B', 'Chest · Shoulders · Triceps (Volume)', ['chest','shoulders','triceps'], inputs, exPerDay, ['dumbbell-bench-press','dumbbell-shoulder-press','tricep-pushdown']);
  const pullB = makeDay('Pull B', 'Back · Posterior Chain (Volume)',        ['back','lats','biceps','traps'], inputs, exPerDay, ['pull-up','cable-row','hammer-curl','rear-delt-fly']);
  const legsB = makeDay('Legs B', 'Posterior Chain Dominant',              ['hamstrings','glutes','calves'], inputs, exPerDay, ['romanian-deadlift','hip-thrust','leg-curl','seated-calf-raise']);
  return { days: [pushA, pullA, legsA, pushB, pullB, legsB], splitType: '6-Day PPL' };
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
        notes: 'Deload: 60% of working weight. Focus on technique.',
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
    deloadProtocol: 'Reduce load by 40%, maintain reps and sets. Focus on technique. One week duration.',
    progressionMethod: isStrength ? 'Linear periodisation — add weight each session when all sets are completed' : 'Double progression — increase reps first, then weight when top of rep range is hit',
    milestones: [
      `Week 4: Aim for ${Math.round(inputs.currentLifts.benchPress ?? 60 * 1.05)}kg bench press`,
      `Week 8: Deload week — assess progress and recalibrate`,
      `Week 12: Retest 1RM lifts and update your plan`,
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
          ? 'Post-workout: 15 min HIIT (20s sprint / 40s rest × 15 rounds)'
          : 'Post-workout: 20–30 min LISS cardio (65–70% max HR)';
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
          reps: inputs.cardioPreference === 'hiit' ? '15 rounds' : '20-30 min',
          rest: '-',
          notes: cardioNote,
        });
      }
    });
  }

  const id = `plan-${inputs.age}-${inputs.weight}-${inputs.trainingDays}-${inputs.goal}`;
  const goalLabels: Record<string, string> = {
    strength: 'Strength', hypertrophy: 'Hypertrophy', definition: 'Definition', recomp: 'Recomp'
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
