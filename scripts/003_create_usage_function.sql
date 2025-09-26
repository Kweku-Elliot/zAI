-- Create function to increment usage tracking
CREATE OR REPLACE FUNCTION increment_usage(
  p_user_id UUID,
  p_date DATE,
  p_metric TEXT,
  p_increment INTEGER DEFAULT 1
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.usage_tracking (user_id, date, messages_sent, files_uploaded, voice_minutes, tokens_used)
  VALUES (
    p_user_id,
    p_date,
    CASE WHEN p_metric = 'messages_sent' THEN p_increment ELSE 0 END,
    CASE WHEN p_metric = 'files_uploaded' THEN p_increment ELSE 0 END,
    CASE WHEN p_metric = 'voice_minutes' THEN p_increment ELSE 0 END,
    CASE WHEN p_metric = 'tokens_used' THEN p_increment ELSE 0 END
  )
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    messages_sent = usage_tracking.messages_sent + CASE WHEN p_metric = 'messages_sent' THEN p_increment ELSE 0 END,
    files_uploaded = usage_tracking.files_uploaded + CASE WHEN p_metric = 'files_uploaded' THEN p_increment ELSE 0 END,
    voice_minutes = usage_tracking.voice_minutes + CASE WHEN p_metric = 'voice_minutes' THEN p_increment ELSE 0 END,
    tokens_used = usage_tracking.tokens_used + CASE WHEN p_metric = 'tokens_used' THEN p_increment ELSE 0 END,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;
