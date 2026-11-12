ALTER TABLE form_feedback ADD COLUMN share_consent INTEGER CHECK (share_consent IN (0, 1));
