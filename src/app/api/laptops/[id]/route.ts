import { NextRequest, NextResponse } from 'next/server';
import { getLaptopWithDetails } from '@/app/lib/supabase/queries';

// Mark as dynamic to prevent static generation
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: 'Database not configured. Please set up your Supabase credentials.',
        },
        { status: 503 }
      );
    }

    const { id } = await params;
    const laptopId = parseInt(id);

    if (isNaN(laptopId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid laptop ID',
        },
        { status: 400 }
      );
    }

    const laptop = await getLaptopWithDetails(laptopId);

    if (!laptop) {
      return NextResponse.json(
        {
          success: false,
          error: 'Laptop not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: laptop,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch laptop',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
