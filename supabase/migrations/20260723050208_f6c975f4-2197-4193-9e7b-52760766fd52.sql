
-- 1. Fix mutable search_path on set_partner_leads_updated_at
CREATE OR REPLACE FUNCTION public.set_partner_leads_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- 2. Remove permissive public SELECT on partner_service_areas (use RPC instead)
DROP POLICY IF EXISTS "Service areas readable by everyone" ON public.partner_service_areas;

-- 3. Replace WITH CHECK (true) on contact_submissions with input validation
DROP POLICY IF EXISTS "Anyone can submit contact" ON public.contact_submissions;
CREATE POLICY "Anyone can submit contact"
ON public.contact_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(name) BETWEEN 1 AND 200
  AND length(email) BETWEEN 3 AND 320
  AND email LIKE '%_@_%.__%'
  AND length(message) BETWEEN 1 AND 5000
  AND (phone IS NULL OR length(phone) BETWEEN 4 AND 20)
  AND (subject IS NULL OR length(subject) <= 200)
);
