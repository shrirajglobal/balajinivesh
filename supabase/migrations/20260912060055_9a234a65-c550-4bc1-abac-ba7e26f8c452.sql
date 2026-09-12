CREATE UNIQUE INDEX IF NOT EXISTS partner_applications_user_id_unique
  ON public.partner_applications (user_id)
  WHERE user_id IS NOT NULL;

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
GRANT SELECT, INSERT ON public.partner_applications TO authenticated;
GRANT ALL ON public.partner_applications TO service_role;
GRANT SELECT ON public.partners TO authenticated;
GRANT ALL ON public.partners TO service_role;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.partner_leads TO authenticated;
GRANT ALL ON public.partner_leads TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.partner_lead_activities TO authenticated;
GRANT ALL ON public.partner_lead_activities TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.partner_clients TO authenticated;
GRANT ALL ON public.partner_clients TO service_role;
GRANT SELECT ON public.partner_commissions TO authenticated;
GRANT ALL ON public.partner_commissions TO service_role;
GRANT SELECT ON public.partner_aum_data TO authenticated;
GRANT ALL ON public.partner_aum_data TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.partner_module_progress TO authenticated;
GRANT ALL ON public.partner_module_progress TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.partner_chapter_progress TO authenticated;
GRANT ALL ON public.partner_chapter_progress TO service_role;
GRANT SELECT, INSERT ON public.learning_certificates TO authenticated;
GRANT ALL ON public.learning_certificates TO service_role;

CREATE OR REPLACE FUNCTION public.approve_distributor_application(
  _application_id uuid,
  _arn_number text,
  _euin text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  application_row public.partner_applications%ROWTYPE;
  distributor_id uuid;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'Administrator access required';
  END IF;

  IF NULLIF(btrim(_arn_number), '') IS NULL THEN
    RAISE EXCEPTION 'ARN number is required';
  END IF;

  SELECT * INTO application_row
  FROM public.partner_applications
  WHERE id = _application_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Distributor application not found';
  END IF;

  IF application_row.user_id IS NULL THEN
    RAISE EXCEPTION 'The application must be linked to a signed-in account before approval';
  END IF;

  INSERT INTO public.partners (user_id, arn_number, euin, status)
  VALUES (
    application_row.user_id,
    upper(btrim(_arn_number)),
    NULLIF(btrim(_euin), ''),
    'active'::public.partner_status
  )
  ON CONFLICT (user_id) DO UPDATE
    SET arn_number = EXCLUDED.arn_number,
        euin = EXCLUDED.euin,
        status = 'active'::public.partner_status,
        updated_at = now()
  RETURNING id INTO distributor_id;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (application_row.user_id, 'partner'::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  UPDATE public.partner_applications
  SET status = 'approved'::public.partner_status,
      updated_at = now()
  WHERE id = _application_id;

  RETURN distributor_id;
END;
$$;

REVOKE ALL ON FUNCTION public.approve_distributor_application(uuid, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.approve_distributor_application(uuid, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.approve_distributor_application(uuid, text, text) TO service_role;