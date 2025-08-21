import orders from '../../../data/orders.json';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(orders);
}

