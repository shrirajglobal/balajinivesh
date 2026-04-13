
-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can manage all gift claims
CREATE POLICY "Admins can manage gift claims"
ON public.gift_claims
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can view all certificates
CREATE POLICY "Admins can view all certificates"
ON public.certificates
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can view all education progress
CREATE POLICY "Admins can view all education progress"
ON public.education_progress
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can manage all partner leads
CREATE POLICY "Admins can manage all leads"
ON public.partner_leads
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
