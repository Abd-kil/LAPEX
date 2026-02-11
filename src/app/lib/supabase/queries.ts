import { supabase } from './client';
import type { 
  Laptop, 
  LaptopWithDetails, 
  LaptopSpec, 
  LaptopScore,
  LaptopImage,
  Source, 
  Category
} from '../constants/models';
import { cleanDescription } from '@/app/utils/text';

// Helper to check if supabase client is available
function getSupabaseClient() {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Check your environment variables.');
  }
  return supabase;
}

/**
 * Fetch laptops with optional filters
 */
export async function getLaptops(params?: {
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  isAvailable?: boolean;
  limit?: number;
  offset?: number;
  categoryId?: number;
  searchQuery?: string;
}) {
  const client = getSupabaseClient();
  let query = client
    .from('laptops')
    .select('*')
    .order('created_at', { ascending: false });

  if( params?.categoryId) {
    const { data: laptopIds } = await client.from('laptop_categories').select('laptop_id').eq('category_id', params.categoryId);
    if (laptopIds) {
      query = query.in('id', laptopIds.map(laptop => laptop.laptop_id));
    }
  }
  
  if (params?.brand) {
    query = query.ilike('brand', `%${params.brand}%`);
  }

  if (params?.searchQuery) {
    const trimmed = params.searchQuery.trim();
    if (trimmed.length) {
      query = query.or(
        `title.ilike.%${trimmed}%,brand.ilike.%${trimmed}%,model.ilike.%${trimmed}%`
      );
    }
  }

  if (params?.minPrice !== undefined) {
    query = query.gte('price', params.minPrice);
  }

  if (params?.maxPrice !== undefined) {
    query = query.lte('price', params.maxPrice);
  }

  if (params?.isAvailable !== undefined) {
    query = query.eq('is_available', params.isAvailable);
  }

  if (params?.limit) {
    query = query.limit(params.limit);
  }

  if (params?.offset) {
    query = query.range(params.offset, params.offset + (params?.limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching laptops:', error);
    throw error;
  }

  return data as Laptop[];
}

/**
 * Fetch a single laptop with all related data
 */
export async function getLaptopWithDetails(laptopId: number): Promise<LaptopWithDetails | null> {
  const client = getSupabaseClient();
  const { data: laptop, error: laptopError } = await client
    .from('laptops')
    .select('*')
    .eq('id', laptopId)
    .single();

  if (laptopError || !laptop) {
    console.error('Error fetching laptop:', laptopError);
    return null;
  }

  // Fetch related data in parallel
  const [specsResult, scoresResult, imagesResult, sourceResult] = await Promise.all([
    client.from('laptop_specs').select('*').eq('laptop_id', laptopId).single(),
    client.from('laptop_scores').select('*').eq('laptop_id', laptopId).single(),
    client.from('laptop_images').select('*').eq('laptop_id', laptopId).order('sort_order'),
    client.from('sources').select('*').eq('id', laptop.source_id).single(),
  ]);

  return {
    ...laptop,
    description: cleanDescription(laptop.description),
    specs: specsResult.data || undefined,
    scores: scoresResult.data || undefined,
    images: imagesResult.data || undefined,
    source: sourceResult.data || undefined,
  } as LaptopWithDetails;
}

/**
 * Fetch laptop by product URL slug
 */
export async function getLaptopBySlug(slug: string): Promise<LaptopWithDetails | null> {
  const client = getSupabaseClient();
  const { data: laptop, error } = await client
    .from('laptops')
    .select('*')
    .ilike('product_url', `%${slug}%`)
    .single();

  if (error || !laptop) {
    console.error('Error fetching laptop by slug:', error);
    return null;
  }

  return getLaptopWithDetails(laptop.id);
}

/**
 * Search laptops by title or brand
 */
export async function searchLaptops(query: string, limit: number = 20) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('laptops')
    .select('*')
    .or(`title.ilike.%${query}%,brand.ilike.%${query}%,model.ilike.%${query}%`)
    .eq('is_available', true)
    .limit(limit);

  if (error) {
    console.error('Error searching laptops:', error);
    throw error;
  }

  return data as Laptop[];
}

/**
 * Fetch laptops with high scores for a specific usage type
 */
export async function getLaptopsByUsage(
  usageType: 'office' | 'gaming' | 'editing' | 'programming',
  limit: number = 20
) {
  const client = getSupabaseClient();
  const scoreColumn = `${usageType}_score`;
  
  const { data, error } = await client
    .from('laptop_scores')
    .select(`
      *,
      laptops (*)
    `)
    .order(scoreColumn, { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching laptops by usage:', error);
    throw error;
  }

  return data;
}

/**
 * Get price history for a laptop
 */
export async function getPriceHistory(laptopId: number) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('price_history')
    .select('*')
    .eq('laptop_id', laptopId)
    .order('recorded_at', { ascending: false });

  if (error) {
    console.error('Error fetching price history:', error);
    throw error;
  }

  return data;
}

/**
 * Get all sources
 */
export async function getSources() {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('sources')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching sources:', error);
    throw error;
  }

  return data as Source[];
}

export async function getCategories() {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('categories')
    .select('*')
    .order('id');
    if(error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
    const categories = data.map((category) => ({ ...category, invertDark: true }));
    return categories as Category[];
}
