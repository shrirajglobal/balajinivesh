CREATE OR REPLACE FUNCTION public.approve_distributor_application(
  _application_id uuid,
  _arn_number text,
  _euin text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY INVOKER
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

GRANT SELECT, INSERT, UPDATE, DELETE ON public.partner_applications TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.partners TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;
REVOKE ALL ON FUNCTION public.approve_distributor_application(uuid, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.approve_distributor_application(uuid, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.approve_distributor_application(uuid, text, text) TO service_role;