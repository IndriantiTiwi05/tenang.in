import { NextResponse } from 'next/server';

//simpan sementara (nanti diganti database)
let history: any[] = [];

export async function GET() {
  return NextResponse.json({
    status: 'success',
    data: history,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { journal, sleep, workload } = body;

    if (!journal || !sleep || !workload) {
      return NextResponse.json(
        { status: 'error', message: 'Input tidak lengkap' },
        { status: 400 }
      );
    }

    let risk = 'low';
    let score = 30;

    //AI SEMENTARA
    if (sleep < 5) {
      risk = 'high';
      score = 80;
    } else if (sleep < 7) {
      risk = 'medium';
      score = 60;
    }

    if (workload === 'high') score += 10;

    const newData = {
      id: Date.now(),
      journal,
      sleep,
      workload,
      risk,
      score,
      createdAt: new Date(),
    };

    history.push(newData);

    return NextResponse.json({
      status: 'success',
      data: newData,
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Server error' },
      { status: 500 }
    );
  }
}