import { NextResponse } from 'next/server';

// sementara (nanti ganti DB)
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

    if (!journal || sleep === undefined || !workload) {
      return NextResponse.json(
        { status: 'error', message: 'Input tidak lengkap' },
        { status: 400 }
      );
    }

    // VALIDASI RANGE
    if (sleep < 0 || sleep > 24) {
      return NextResponse.json(
        { status: 'error', message: 'Sleep harus 0 - 24 jam' },
        { status: 400 }
      );
    }

    let risk = 'low';
    let score = 30;

    //AI SEMENTARAAA
    if (sleep < 5 && workload === 'high') {
      risk = 'high';
      score = 90;
    } else if (sleep < 6) {
      risk = 'medium';
      score = 65;
    }

    if (workload === 'high') score += 10;
    else if (workload === 'medium') score += 5;

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