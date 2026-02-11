'use client';

import { useEffect, useState } from 'react';
import { supabase } from './client';
import type { LaptopWithDetails } from '../constants/models';
import { getLaptopWithDetails, getLaptops } from './queries';

/**
 * Hook to fetch laptops with real-time updates
 */
export function useLaptops(params?: {
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  isAvailable?: boolean;
  limit?: number;
}) {
  const [laptops, setLaptops] = useState<LaptopWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!supabase) {
      setError(new Error('Supabase client not initialized'));
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchLaptops = async () => {
      try {
        setLoading(true);
        const data = await getLaptops(params);
        
        if (isMounted) {
          setLaptops(data as LaptopWithDetails[]);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchLaptops();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('laptops-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'laptops',
        },
        () => {
          fetchLaptops();
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      if (supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [params?.brand, params?.minPrice, params?.maxPrice, params?.isAvailable, params?.limit]);

  return { laptops, loading, error };
}

/**
 * Hook to fetch a single laptop with details
 */
export function useLaptop(laptopId: number | null) {
  const [laptop, setLaptop] = useState<LaptopWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!supabase) {
      setError(new Error('Supabase client not initialized'));
      setLoading(false);
      return;
    }

    if (!laptopId) {
      setLaptop(null);
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchLaptop = async () => {
      try {
        setLoading(true);
        const data = await getLaptopWithDetails(laptopId);
        
        if (isMounted) {
          setLaptop(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchLaptop();

    // Subscribe to real-time updates for this laptop
    const channel = supabase
      .channel(`laptop-${laptopId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'laptops',
          filter: `id=eq.${laptopId}`,
        },
        () => {
          fetchLaptop();
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      if (supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [laptopId]);

  return { laptop, loading, error };
}
