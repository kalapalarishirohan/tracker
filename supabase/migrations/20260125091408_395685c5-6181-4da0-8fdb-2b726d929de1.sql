
-- Add is_pro column to clients table
ALTER TABLE public.clients ADD COLUMN is_pro boolean NOT NULL DEFAULT false;

-- Create client_assets table for images, videos, documents, links
CREATE TABLE public.client_assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('image', 'video', 'document', 'link')),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  file_size INTEGER,
  mime_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create dev_tracking table for app/web development progress
CREATE TABLE public.dev_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  project_type TEXT NOT NULL CHECK (project_type IN ('app', 'web')),
  phase TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed')),
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  notes TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create approach_plans table for protected flow diagrams
CREATE TABLE public.approach_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  plan_data JSONB NOT NULL DEFAULT '{}',
  image_url TEXT,
  is_protected BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.client_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dev_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approach_plans ENABLE ROW LEVEL SECURITY;

-- RLS policies for client_assets
CREATE POLICY "Anyone can read client_assets" ON public.client_assets FOR SELECT USING (true);
CREATE POLICY "Anyone can insert client_assets" ON public.client_assets FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update client_assets" ON public.client_assets FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete client_assets" ON public.client_assets FOR DELETE USING (true);

-- RLS policies for dev_tracking
CREATE POLICY "Anyone can read dev_tracking" ON public.dev_tracking FOR SELECT USING (true);
CREATE POLICY "Anyone can insert dev_tracking" ON public.dev_tracking FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update dev_tracking" ON public.dev_tracking FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete dev_tracking" ON public.dev_tracking FOR DELETE USING (true);

-- RLS policies for approach_plans
CREATE POLICY "Anyone can read approach_plans" ON public.approach_plans FOR SELECT USING (true);
CREATE POLICY "Anyone can insert approach_plans" ON public.approach_plans FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update approach_plans" ON public.approach_plans FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete approach_plans" ON public.approach_plans FOR DELETE USING (true);

-- Create triggers for updated_at
CREATE TRIGGER update_client_assets_updated_at
  BEFORE UPDATE ON public.client_assets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_dev_tracking_updated_at
  BEFORE UPDATE ON public.dev_tracking
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_approach_plans_updated_at
  BEFORE UPDATE ON public.approach_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for client assets
INSERT INTO storage.buckets (id, name, public) VALUES ('client-assets', 'client-assets', true);

-- Storage policies for client-assets bucket
CREATE POLICY "Anyone can view client assets" ON storage.objects FOR SELECT USING (bucket_id = 'client-assets');
CREATE POLICY "Anyone can upload client assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'client-assets');
CREATE POLICY "Anyone can update client assets" ON storage.objects FOR UPDATE USING (bucket_id = 'client-assets');
CREATE POLICY "Anyone can delete client assets" ON storage.objects FOR DELETE USING (bucket_id = 'client-assets');
