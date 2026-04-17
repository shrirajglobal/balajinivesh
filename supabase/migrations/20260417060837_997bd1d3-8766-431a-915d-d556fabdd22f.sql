DROP POLICY IF EXISTS "Anyone can create chat conversation" ON public.chat_conversations;

CREATE POLICY "Visitors create own chat conversation"
  ON public.chat_conversations FOR INSERT TO public
  WITH CHECK (
    session_id IS NOT NULL
    AND length(session_id) BETWEEN 8 AND 128
    AND (auth.uid() IS NULL OR user_id = auth.uid() OR user_id IS NULL)
  );