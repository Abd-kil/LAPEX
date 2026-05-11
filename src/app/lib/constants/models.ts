// Database Enums
export type StorageType = 'HDD' | 'SSD' | 'NVME';
export type UsageType = 'office' | 'gaming' | 'editing' | 'programming' | 'studying';

// Database Models
export interface Source {
  id: number;
  name: string;
  website_url: string;
  logo_url: string | null;
  created_at: Date;
}

export interface Laptop {
  id: number;
  source_id: number;
  title: string;
  description: string | null;
  product_url: string;
  image_url: string;
  brand: string | null;
  model: string | null;
  price: number | null;
  currency: string;
  is_available: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface LaptopImage {
  id: number;
  laptop_id: number;
  image_url: string;
  is_primary: boolean;
  sort_order: number;
  source?: string;
  created_at: string;
}

interface CPU {
  id: number;
  cpu_name: string | null;
  cores: number | null;
  pcores: number | null;
  ecores: number | null;
  threads: number | null;
  clock_speed_mhz: number | null;
  turbo_speed_mhz: number | null;
  cpu_mark: number | null;
  thread_mark: number | null;
  tdp_w: number | null;
  power_performance: number | null;
  samples: number | null;
  test_date: Date | null;
}

interface GPU {
  id: number;
  gpu_name: string | null;
  g3d_mark: number | null;
  g2d_mark: number | null;
  tdp_w: number | null;
  power_performance: number | null;
  bus_interface: string | null;
  samples: number | null;
  test_date: Date | null;
  core_clock_mhz: number | null;
  memory_clock_mhz: number | null;
  vram_mb: number | null;
}

export interface LaptopSpec {
  id: number;
  laptop_id: number | null;
  cpu_id?: number | null;
  gpu_id?: number | null;
  cpu: CPU | null;
  gpu: GPU | null;
  cpu_normalized_score?: number | null;
  gpu_normalized_score?: number | null;
  gpu_gb: number | null;
  ram_gen: string | null;
  ram_gb: number | null;
  storage_type: StorageType | null;
  storage_gb: number | null;
  screen_size: number | null;
  screen_resolution: string | null;
  refresh_rate: number | null;
  battery_wh: number | null;
  weight_kg: number | null;
  os: string | null;
}

export interface LaptopScore {
  id: number;
  laptop_id: number | null;
  office_score: number | null;
  gaming_score: number | null;
  editing_score: number | null;
  programming_score: number | null;
  overall_score: number | null;
}

export interface PriceHistory {
  id: number;
  laptop_id: number;
  price: number | null;
  recorded_at: Date;
}

export interface User {
  id: number;
  name: string | null;
  email: string | null;
  created_at: Date;
}

export interface UserLaptopEvaluation {
  id: number;
  user_id: number | null;
  cpu: string | null;
  gpu: string | null;
  ram_gb: number | null;
  usage_type: UsageType | null;
  calculated_score: number | null;
  created_at: Date;
}

// Extended types with relations
export interface LaptopWithDetails extends Laptop {
  source?: Source;
  specs?: LaptopSpec;
  scores?: LaptopScore;
  images?: LaptopImage[];
  price_history?: PriceHistory[];
}

export type Category = {
  id: number;
  name: string;
  invertDark?: boolean;
};


