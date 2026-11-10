-- Forms moved into jurisdiction folders, so their ids now include the
-- jurisdiction (`ma/court-order`).
ALTER TABLE form_feedback RENAME COLUMN form_slug TO form_id;

UPDATE form_feedback SET form_id = CASE form_id
  WHEN 'court-order-ma' THEN 'ma/court-order'
  WHEN 'court-order-ma-minor' THEN 'ma/court-order-minor'
  WHEN 'affidavit-of-indigency-ma' THEN 'ma/affidavit-of-indigency'
  WHEN 'birth-certificate-affidavit-ma' THEN 'ma/birth-certificate-affidavit'
  WHEN 'court-order-ny' THEN 'ny/court-order'
  WHEN 'court-order-ri' THEN 'ri/court-order'
  ELSE form_id
END;
