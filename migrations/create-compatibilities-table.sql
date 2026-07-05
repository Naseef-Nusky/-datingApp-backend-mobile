-- AI compatibility cache (pair scores, summaries, icebreakers)
CREATE TABLE IF NOT EXISTS compatibilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_low_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_high_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  summary TEXT,
  strengths JSONB DEFAULT '[]'::jsonb,
  challenges JSONB DEFAULT '[]'::jsonb,
  icebreakers JSONB DEFAULT '[]'::jsonb,
  source VARCHAR(32) DEFAULT 'ai',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_low_id, user_high_id)
);

CREATE INDEX IF NOT EXISTS idx_compatibilities_user_low ON compatibilities(user_low_id);
CREATE INDEX IF NOT EXISTS idx_compatibilities_user_high ON compatibilities(user_high_id);
