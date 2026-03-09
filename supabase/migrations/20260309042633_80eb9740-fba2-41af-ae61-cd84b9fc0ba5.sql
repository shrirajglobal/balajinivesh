-- Create storage bucket for RTA statements
INSERT INTO storage.buckets (id, name, public) VALUES ('rta-statements', 'rta-statements', false);

-- RLS for storage: only admins can upload/read
CREATE POLICY "Admins can upload RTA statements"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'rta-statements' AND
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can read RTA statements"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'rta-statements' AND
  public.has_role(auth.uid(), 'admin')
);