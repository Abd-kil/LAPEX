import { NextRequest, NextResponse } from 'next/server';
import { getLaptops } from '@/app/lib/supabase/queries';

// Mark as dynamic to prevent static generation
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
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

    const searchParams = request.nextUrl.searchParams;
    
    // Parse query parameters
    const brand = searchParams.get('brand') || undefined;
    const minPrice = searchParams.get('minPrice') 
      ? parseFloat(searchParams.get('minPrice')!) 
      : undefined;
    const maxPrice = searchParams.get('maxPrice') 
      ? parseFloat(searchParams.get('maxPrice')!) 
      : undefined;
    const isAvailable = searchParams.get('isAvailable') === 'true';
    const limit = searchParams.get('limit') 
      ? parseInt(searchParams.get('limit')!) 
      : 20;
    const offset = searchParams.get('offset') 
      ? parseInt(searchParams.get('offset')!) 
      : 0;

    const laptops = await getLaptops({
      brand,
      minPrice,
      maxPrice,
      isAvailable,
      limit,
      offset,
    });

    return NextResponse.json({
      success: true,
      data: laptops,
      count: laptops.length,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch laptops',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
