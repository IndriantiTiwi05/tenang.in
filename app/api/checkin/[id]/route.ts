import { NextResponse } from 'next/server';
import { history } from '@/lib/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  const item = history.find((d) => String(d.id) === String(id));

  if (!item) {
    return NextResponse.json(
      { status: 'error', message: 'Data tidak ditemukan' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    status: 'success',
    data: item,
  });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  const index = history.findIndex((d) => String(d.id) === String(id));

  if (index === -1) {
    return NextResponse.json(
      { status: 'error', message: 'Data tidak ditemukan' },
      { status: 404 }
    );
  }

  history.splice(index, 1);

  return NextResponse.json({
    status: 'success',
    message: 'Data berhasil dihapus',
  });
}