import vendors from '../../../data/vendors.json';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(vendors);
}

