CREATE TABLE form_feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  form_slug TEXT NOT NULL,
  sentiment TEXT NOT NULL CHECK (sentiment IN ('positive', 'negative')),
  comment TEXT,
  ip TEXT,
  user_agent TEXT,
  country TEXT,
  region TEXT,
  city TEXT,
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
