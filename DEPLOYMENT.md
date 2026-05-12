# Deploy to Vercel - Quick Guide

## Step 1: Push to GitHub

First, create a GitHub repository:

1. Go to https://github.com/new
2. Create repo named `graduation-os`
3. Run these commands:

```bash
git remote add origin https://github.com/YOUR_USERNAME/graduation-os.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

1. Go to https://vercel.com
2. Click **"New Project"**
3. Import your GitHub repository
4. Select **Next.js** as framework
5. Click **Deploy**

## Step 3: Add Environment Variables

In Vercel Project Settings → Environment Variables, add:

```
NEXT_PUBLIC_SUPABASE_URL = your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_supabase_anon_key
```

Get these from your Supabase project settings.

## Step 4: Create Supabase Tables (if not done)

Run this SQL in Supabase:

```sql
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

CREATE TABLE memories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invite_id UUID REFERENCES invites(id) ON DELETE CASCADE,
  image_url TEXT,
  caption TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

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

## Done! 🎉

Your site will be live at: `https://graduation-os-YOUR_USERNAME.vercel.app`

Visit: `https://graduation-os-YOUR_USERNAME.vercel.app/invite/test-user`
