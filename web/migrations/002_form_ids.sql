-- Forms moved into jurisdiction folders, which changed their ids.
UPDATE form_feedback SET form_slug = CASE form_slug
  WHEN 'court-order-ma' THEN 'ma/court-order'
  WHEN 'court-order-ma-minor' THEN 'ma/court-order-minor'
  WHEN 'affidavit-of-indigency-ma' THEN 'ma/affidavit-of-indigency'
  WHEN 'birth-certificate-affidavit-ma' THEN 'ma/birth-certificate-affidavit'
  WHEN 'court-order-ny' THEN 'ny/court-order'
  WHEN 'court-order-ri' THEN 'ri/court-order'
  ELSE form_slug
END;
