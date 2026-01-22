-- Create clients table
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assigned_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  total_progress INTEGER NOT NULL DEFAULT 0,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  project_lead TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create project_stages table
CREATE TABLE public.project_stages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed')),
  completion_percentage INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tickets table
CREATE TABLE public.tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'resolved', 'closed')),
  response TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create submissions table for project requests and feedback
CREATE TABLE public.submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('project_request', 'feedback', 'general')),
  data JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'archived')),
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Public read policies (for client portal access via assigned_id)
CREATE POLICY "Anyone can read clients by assigned_id" ON public.clients FOR SELECT USING (true);
CREATE POLICY "Anyone can read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Anyone can read project_stages" ON public.project_stages FOR SELECT USING (true);
CREATE POLICY "Anyone can read tickets" ON public.tickets FOR SELECT USING (true);
CREATE POLICY "Anyone can read submissions" ON public.submissions FOR SELECT USING (true);

-- Insert policies for clients (admin creates)
CREATE POLICY "Anyone can insert clients" ON public.clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update clients" ON public.clients FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete clients" ON public.clients FOR DELETE USING (true);

-- Insert policies for projects
CREATE POLICY "Anyone can insert projects" ON public.projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update projects" ON public.projects FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete projects" ON public.projects FOR DELETE USING (true);

-- Insert policies for project_stages
CREATE POLICY "Anyone can insert project_stages" ON public.project_stages FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update project_stages" ON public.project_stages FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete project_stages" ON public.project_stages FOR DELETE USING (true);

-- Insert policies for tickets
CREATE POLICY "Anyone can insert tickets" ON public.tickets FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update tickets" ON public.tickets FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete tickets" ON public.tickets FOR DELETE USING (true);

-- Insert policies for submissions
CREATE POLICY "Anyone can insert submissions" ON public.submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update submissions" ON public.submissions FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete submissions" ON public.submissions FOR DELETE USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at
  BEFORE UPDATE ON public.tickets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();