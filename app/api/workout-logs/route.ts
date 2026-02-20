import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { WorkoutSession } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const session: WorkoutSession = await req.json();
    const log = await prisma.workoutLog.create({
      data: {
        planId: session.planId,
        dayIndex: session.dayIndex,
        dayName: session.dayName,
        exercises: JSON.stringify(session.exercises),
        notes: session.notes,
      },
    });
    return NextResponse.json(log, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to save workout' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const planId = searchParams.get('planId');
  if (!planId) return NextResponse.json({ error: 'planId required' }, { status: 400 });

  const logs = await prisma.workoutLog.findMany({
    where: { planId },
    orderBy: { date: 'desc' },
    take: 50,
  });
  return NextResponse.json(logs);
}
