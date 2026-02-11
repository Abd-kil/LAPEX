import { createServerClient } from './client';
import type { Laptop, LaptopSpec, LaptopScore, Source } from '../constants/models';

/**
 * Insert a new laptop (admin only)
 */
export async function insertLaptop(laptop: Omit<Laptop, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createServerClient();
  
  const { data, error } = await supabase
    .from('laptops')
    .insert(laptop)
    .select()
    .single();

  if (error) {
    console.error('Error inserting laptop:', error);
    throw error;
  }

  return data as Laptop;
}

/**
 * Update laptop information (admin only)
 */
export async function updateLaptop(laptopId: number, updates: Partial<Laptop>) {
  const supabase = createServerClient();
  
  const { data, error } = await supabase
    .from('laptops')
    .update(updates)
    .eq('id', laptopId)
    .select()
    .single();

  if (error) {
    console.error('Error updating laptop:', error);
    throw error;
  }

  return data as Laptop;
}

/**
 * Insert or update laptop specifications
 */
export async function upsertLaptopSpecs(specs: Omit<LaptopSpec, 'id'>) {
  const supabase = createServerClient();
  
  const { data, error } = await supabase
    .from('laptop_specs')
    .upsert(specs, { onConflict: 'laptop_id' })
    .select()
    .single();

  if (error) {
    console.error('Error upserting laptop specs:', error);
    throw error;
  }

  return data as LaptopSpec;
}

/**
 * Insert or update laptop scores
 */
export async function upsertLaptopScores(scores: Omit<LaptopScore, 'id'>) {
  const supabase = createServerClient();
  
  const { data, error } = await supabase
    .from('laptop_scores')
    .upsert(scores, { onConflict: 'laptop_id' })
    .select()
    .single();

  if (error) {
    console.error('Error upserting laptop scores:', error);
    throw error;
  }

  return data as LaptopScore;
}

/**
 * Record price change
 */
export async function recordPriceHistory(laptopId: number, price: number) {
  const supabase = createServerClient();
  
  const { data, error } = await supabase
    .from('price_history')
    .insert({
      laptop_id: laptopId,
      price,
    })
    .select()
    .single();

  if (error) {
    console.error('Error recording price history:', error);
    throw error;
  }

  return data;
}

/**
 * Delete a laptop (admin only)
 */
export async function deleteLaptop(laptopId: number) {
  const supabase = createServerClient();
  
  const { error } = await supabase
    .from('laptops')
    .delete()
    .eq('id', laptopId);

  if (error) {
    console.error('Error deleting laptop:', error);
    throw error;
  }

  return true;
}

/**
 * Insert a new source
 */
export async function insertSource(source: Omit<Source, 'id' | 'created_at'>) {
  const supabase = createServerClient();
  
  const { data, error } = await supabase
    .from('sources')
    .insert(source)
    .select()
    .single();

  if (error) {
    console.error('Error inserting source:', error);
    throw error;
  }

  return data as Source;
}
