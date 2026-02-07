-- Create the anonymous/public client record used by public forms (Contact & Project Request)
INSERT INTO public.clients (id, assigned_id, name, email, company, is_pro)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'PUBLIC',
  'Public Visitor',
  'public@system.internal',
  'Public Submission',
  false
)
ON CONFLICT (id) DO NOTHING;