import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { CheckInData } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body: CheckInData = await req.json();
    const checkIn = await prisma.checkIn.create({
      data: {
        planId: body.planId,
        weekNumber: body.weekNumber,
        hitsTargets: body.hitsTargets,
        notes: body.notes,
        progressionApplied: body.hitsTargets,
      },
    });
    return NextResponse.json(checkIn, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to save check-in' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const planId = searchParams.get('planId');
  if (!planId) return NextResponse.json({ error: 'planId required' }, { status: 400 });

  const checkIns = await prisma.checkIn.findMany({
    where: { planId },
    orderBy: { date: 'desc' },
  });
  return NextResponse.json(checkIns);
}
