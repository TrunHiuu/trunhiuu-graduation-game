# Graduation Invitation OS - Setup Instructions

## Supabase Setup

### 1. Create Tables

Run these SQL commands in Supabase SQL Editor:

```sql
-- Create invites table
CREATE TABLE invites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  name TEXT NOT NULL,
  major TEXT NOT NULL,
  personalized_message TEXT,
  avatar_url TEXT,
  graduation_year TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create memories table
CREATE TABLE memories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invite_id UUID REFERENCES invites(id) ON DELETE CASCADE,
  image_url TEXT,
  caption TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Storage Setup

Create two buckets in Supabase Storage:
- `avatars` - for user avatars
- `memories` - for memory photos

### 3. Environment Variables

Update `.env.local` with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Running the Project

```bash
npm run dev
```

Open [http://localhost:3000/invite/test-user](http://localhost:3000/invite/test-user)

## Test Data

Insert sample data:

```sql
INSERT INTO invites (slug, phone, name, major, personalized_message, graduation_year)
VALUES (
  'test-user',
  '0123456789',
  'John Doe',
  'Information Technology',
  'You are cordially invited to celebrate our graduation!',
  '2026'
);
```

## Project Structure

- `/app/invite/[slug]` - Dynamic invitation pages
- `/api/invite` - API to fetch invitation data
- `/components` - Retro desktop components
- `/lib` - Supabase client
- `/types` - TypeScript definitions

## Deployment

Deploy to Vercel with your Supabase credentials.
