-- ============================================================
-- Studio Flow — Supabase Setup
-- הרצי את ה-SQL הזה בסופאבייס Dashboard → SQL Editor
-- ============================================================

-- ── 1. טבלת profiles ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access"
  ON public.profiles FOR ALL TO authenticated
  USING  (auth.jwt() ->> 'email' = 'tamarlev.avnisan@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'tamarlev.avnisan@gmail.com');

CREATE POLICY "User own profile"
  ON public.profiles FOR ALL TO authenticated
  USING  (auth.uid() = id)
  WITH CHECK (auth.uid() = id);


-- ── 2. טבלת פוסטים מתוזמנים ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.scheduled_posts (
  id             UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id      TEXT    NOT NULL,
  client_name    TEXT    NOT NULL,
  title          TEXT    NOT NULL,
  content        TEXT    NOT NULL DEFAULT '',
  content_type   TEXT    NOT NULL CHECK (content_type IN ('post','reel','story','carousel')),
  platform       TEXT    NOT NULL CHECK (platform IN ('Instagram','TikTok','Facebook')),
  scheduled_date DATE    NOT NULL,
  scheduled_time TIME    NOT NULL,
  status         TEXT    NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','published','failed')),
  media_url      TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.scheduled_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own posts"
  ON public.scheduled_posts FOR ALL TO authenticated
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ── 3. Storage bucket לקבצי מדיה ────────────────────────────
-- יצרי bucket בשם "post-media" בסופאבייס Dashboard → Storage
-- ואז הרצי את המדיניות הבאה:

-- INSERT INTO storage.buckets (id, name, public) VALUES ('post-media', 'post-media', true)
-- ON CONFLICT (id) DO NOTHING;

-- CREATE POLICY "Authenticated upload"
--   ON storage.objects FOR INSERT TO authenticated
--   WITH CHECK (bucket_id = 'post-media');

-- CREATE POLICY "Public read"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'post-media');
