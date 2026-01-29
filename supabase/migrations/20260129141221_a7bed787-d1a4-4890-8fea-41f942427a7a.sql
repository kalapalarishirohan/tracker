-- Create table for client domains
CREATE TABLE public.client_domains (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  domain_type TEXT NOT NULL CHECK (domain_type IN ('core', 'subdomain')),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.client_domains ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read client_domains" ON public.client_domains FOR SELECT USING (true);
CREATE POLICY "Anyone can insert client_domains" ON public.client_domains FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update client_domains" ON public.client_domains FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete client_domains" ON public.client_domains FOR DELETE USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_client_domains_updated_at
  BEFORE UPDATE ON public.client_domains
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();