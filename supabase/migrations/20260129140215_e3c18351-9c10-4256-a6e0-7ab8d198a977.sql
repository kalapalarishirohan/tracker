-- Enable realtime for dev_tracking table so Pro clients see updates instantly
ALTER PUBLICATION supabase_realtime ADD TABLE public.dev_tracking;