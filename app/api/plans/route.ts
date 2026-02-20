import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { buildPlan } from '@/lib/plan-builder';
import type { QuestionnaireInputs } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const inputs: QuestionnaireInputs = await req.json();
    const plan = buildPlan(inputs);

    const saved = await prisma.plan.create({
      data: {
        id: plan.id,
        name: plan.name,
        data: JSON.stringify(plan),
        inputs: JSON.stringify(inputs),
      },
    });

    return NextResponse.json({ id: saved.id, plan }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to create plan' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (id) {
    const plan = await prisma.plan.findUnique({ where: { id } });
    if (!plan) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(JSON.parse(plan.data));
  }

  const plans = await prisma.plan.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: { id: true, name: true, createdAt: true },
  });
  return NextResponse.json(plans);
}
