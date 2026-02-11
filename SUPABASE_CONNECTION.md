# Supabase PostgreSQL Connection - Setup Complete ✓

## What Was Set Up

### 1. Installed Dependencies
- `@supabase/supabase-js` - Official Supabase JavaScript client

### 2. Environment Configuration
- Created `.env.local` with Supabase credentials placeholders
- Added example configuration (update with your actual Supabase project details)

### 3. Database Client (`src/app/lib/supabase/client.ts`)
- **Main client**: Browser-side Supabase client with authentication
- **Server client**: Admin client with service role key for server-side operations
- Handles missing credentials gracefully during build

### 4. Query Functions (`src/app/lib/supabase/queries.ts`)
- `getLaptops()` - Fetch laptops with filters (brand, price range, availability)
- `getLaptopWithDetails()` - Get laptop with specs, scores, images, and source
- `getLaptopBySlug()` - Find laptop by URL slug
- `searchLaptops()` - Search by title, brand, or model
- `getLaptopsByUsage()` - Get laptops ranked by usage type (office, gaming, editing, programming)
- `getPriceHistory()` - Fetch price history for a laptop
- `getSources()` - Get all data sources

### 5. Mutation Functions (`src/app/lib/supabase/mutations.ts`)
Admin-only operations (server-side):
- `insertLaptop()` - Add new laptop
- `updateLaptop()` - Update laptop information
- `upsertLaptopSpecs()` - Insert/update specifications
- `upsertLaptopScores()` - Insert/update usage scores
- `recordPriceHistory()` - Track price changes
- `deleteLaptop()` - Remove laptop
- `insertSource()` - Add new data source

### 6. React Hooks (`src/app/lib/supabase/hooks.ts`)
- `useLaptops()` - Fetch laptops with real-time updates
- `useLaptop()` - Fetch single laptop with real-time updates

### 7. API Routes
- `GET /api/laptops` - Query laptops with filters
- `GET /api/laptops/[id]` - Get laptop details by ID

## Next Steps

### 1. Set Up Your Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Wait for the database to be provisioned

### 2. Get Your Credentials

1. Go to Project Settings → API
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public key**
   - **service_role secret key**

### 3. Update `.env.local`

Replace the placeholder values in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key-here
```

### 4. Run Database Schema

Execute the SQL schema in your Supabase SQL Editor (see [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md) for the complete SQL script)

### 5. Enable Row Level Security

Run the RLS policies from the setup guide to secure your database

### 6. Test the Connection

Start the dev server and test the API:

```bash
npm run dev

# Test the API
curl http://localhost:3000/api/laptops
```

## Usage Examples

### In Server Components/API Routes

```typescript
import { getLaptops, getLaptopWithDetails } from '@/app/lib/supabase/queries';

// Get all laptops
const laptops = await getLaptops({ isAvailable: true, limit: 20 });

// Get specific laptop with all details
const laptop = await getLaptopWithDetails(1);
```

### In Client Components

```typescript
'use client';

import { useLaptops } from '@/app/lib/supabase/hooks';

function LaptopList() {
  const { laptops, loading, error } = useLaptops({ 
    isAvailable: true, 
    limit: 20 
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {laptops.map(laptop => (
        <div key={laptop.id}>{laptop.title} - ${laptop.price}</div>
      ))}
    </div>
  );
}
```

## Files Created

- ✓ `src/app/lib/supabase/client.ts` - Database client configuration
- ✓ `src/app/lib/supabase/queries.ts` - Read operations
- ✓ `src/app/lib/supabase/mutations.ts` - Write operations
- ✓ `src/app/lib/supabase/hooks.ts` - React hooks
- ✓ `src/app/api/laptops/route.ts` - Laptops API endpoint
- ✓ `src/app/api/laptops/[id]/route.ts` - Single laptop API endpoint
- ✓ `docs/SUPABASE_SETUP.md` - Detailed setup guide
- ✓ `.env.local` - Environment variables

## Important Notes

- ⚠️ Never commit `.env.local` to version control
- ⚠️ Service role key should only be used server-side
- ⚠️ Enable Row Level Security (RLS) before production
- ✅ Real-time subscriptions are set up in hooks
- ✅ Build succeeds even without valid credentials
- ✅ TypeScript types match database schema

## Documentation

For detailed setup instructions, database schema, and advanced usage, see:
- [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md)
