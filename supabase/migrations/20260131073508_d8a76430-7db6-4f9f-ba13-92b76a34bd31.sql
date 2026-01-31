-- Create role enum for app users
CREATE TYPE public.app_role AS ENUM ('admin', 'developer', 'user');

-- Create user_roles table for secure role management
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles (only admins can manage, users can read their own)
CREATE POLICY "Users can read their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create developers table (profile for developer users)
CREATE TABLE public.developers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    name text NOT NULL,
    email text NOT NULL,
    avatar_url text,
    specialty text,
    status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'busy')),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS on developers
ALTER TABLE public.developers ENABLE ROW LEVEL SECURITY;

-- Developers can read all developers, update own profile
CREATE POLICY "Authenticated can read developers"
ON public.developers FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Developers can update own profile"
ON public.developers FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Allow insert for authenticated users"
ON public.developers FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Create developer_assignments table (work assigned by admin)
CREATE TABLE public.developer_assignments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_id uuid REFERENCES public.developers(id) ON DELETE CASCADE NOT NULL,
    project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'on-hold')),
    due_date timestamp with time zone,
    assigned_by text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS on developer_assignments
ALTER TABLE public.developer_assignments ENABLE ROW LEVEL SECURITY;

-- Policies for developer_assignments
CREATE POLICY "Developers can read their assignments"
ON public.developer_assignments FOR SELECT
TO authenticated
USING (
    developer_id IN (SELECT id FROM public.developers WHERE user_id = auth.uid())
    OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can manage all assignments"
ON public.developer_assignments FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Developers can update their own assignments"
ON public.developer_assignments FOR UPDATE
TO authenticated
USING (developer_id IN (SELECT id FROM public.developers WHERE user_id = auth.uid()));

-- Add trigger for updated_at on developers
CREATE TRIGGER update_developers_updated_at
    BEFORE UPDATE ON public.developers
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add trigger for updated_at on developer_assignments
CREATE TRIGGER update_developer_assignments_updated_at
    BEFORE UPDATE ON public.developer_assignments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();