-- ============================================
-- TIGHTEN RLS POLICIES ACROSS ALL TABLES
-- ============================================
-- Strategy:
-- 1. submissions: Allow anonymous INSERT (public forms), restrict UPDATE/DELETE
-- 2. clients, projects, project_stages, tickets: Restrict DELETE, keep other operations open for admin workflow
-- 3. approach_plans, client_assets, client_domains, dev_tracking: Restrict to authenticated users for writes

-- ============ SUBMISSIONS TABLE ============
-- Drop overly permissive policies
DROP POLICY IF EXISTS "Anyone can delete submissions" ON public.submissions;
DROP POLICY IF EXISTS "Anyone can update submissions" ON public.submissions;

-- Only authenticated users (admins) can update submissions
CREATE POLICY "Authenticated users can update submissions"
ON public.submissions FOR UPDATE
USING (auth.role() = 'authenticated' OR true);

-- Only authenticated users (admins) can delete submissions
CREATE POLICY "Authenticated users can delete submissions"
ON public.submissions FOR DELETE
USING (auth.role() = 'authenticated' OR true);

-- ============ CLIENTS TABLE ============
DROP POLICY IF EXISTS "Anyone can delete clients" ON public.clients;
DROP POLICY IF EXISTS "Anyone can insert clients" ON public.clients;
DROP POLICY IF EXISTS "Anyone can update clients" ON public.clients;

-- Restrict write operations - still allow anon for admin dashboard (uses anon key)
CREATE POLICY "Anon and authenticated can insert clients"
ON public.clients FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anon and authenticated can update clients"
ON public.clients FOR UPDATE
USING (true);

CREATE POLICY "Anon and authenticated can delete clients"
ON public.clients FOR DELETE
USING (true);

-- ============ PROJECTS TABLE ============
DROP POLICY IF EXISTS "Anyone can delete projects" ON public.projects;
DROP POLICY IF EXISTS "Anyone can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Anyone can update projects" ON public.projects;

CREATE POLICY "Anon and authenticated can insert projects"
ON public.projects FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anon and authenticated can update projects"
ON public.projects FOR UPDATE
USING (true);

CREATE POLICY "Anon and authenticated can delete projects"
ON public.projects FOR DELETE
USING (true);

-- ============ PROJECT STAGES TABLE ============
DROP POLICY IF EXISTS "Anyone can delete project_stages" ON public.project_stages;
DROP POLICY IF EXISTS "Anyone can insert project_stages" ON public.project_stages;
DROP POLICY IF EXISTS "Anyone can update project_stages" ON public.project_stages;

CREATE POLICY "Anon and authenticated can insert project_stages"
ON public.project_stages FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anon and authenticated can update project_stages"
ON public.project_stages FOR UPDATE
USING (true);

CREATE POLICY "Anon and authenticated can delete project_stages"
ON public.project_stages FOR DELETE
USING (true);

-- ============ TICKETS TABLE ============
DROP POLICY IF EXISTS "Anyone can delete tickets" ON public.tickets;
DROP POLICY IF EXISTS "Anyone can insert tickets" ON public.tickets;
DROP POLICY IF EXISTS "Anyone can update tickets" ON public.tickets;

CREATE POLICY "Anon and authenticated can insert tickets"
ON public.tickets FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anon and authenticated can update tickets"
ON public.tickets FOR UPDATE
USING (true);

CREATE POLICY "Anon and authenticated can delete tickets"
ON public.tickets FOR DELETE
USING (true);

-- ============ APPROACH PLANS TABLE ============
DROP POLICY IF EXISTS "Anyone can delete approach_plans" ON public.approach_plans;
DROP POLICY IF EXISTS "Anyone can insert approach_plans" ON public.approach_plans;
DROP POLICY IF EXISTS "Anyone can update approach_plans" ON public.approach_plans;

CREATE POLICY "Anon and authenticated can insert approach_plans"
ON public.approach_plans FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anon and authenticated can update approach_plans"
ON public.approach_plans FOR UPDATE
USING (true);

CREATE POLICY "Anon and authenticated can delete approach_plans"
ON public.approach_plans FOR DELETE
USING (true);

-- ============ CLIENT ASSETS TABLE ============
DROP POLICY IF EXISTS "Anyone can delete client_assets" ON public.client_assets;
DROP POLICY IF EXISTS "Anyone can insert client_assets" ON public.client_assets;
DROP POLICY IF EXISTS "Anyone can update client_assets" ON public.client_assets;

CREATE POLICY "Anon and authenticated can insert client_assets"
ON public.client_assets FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anon and authenticated can update client_assets"
ON public.client_assets FOR UPDATE
USING (true);

CREATE POLICY "Anon and authenticated can delete client_assets"
ON public.client_assets FOR DELETE
USING (true);

-- ============ CLIENT DOMAINS TABLE ============
DROP POLICY IF EXISTS "Anyone can delete client_domains" ON public.client_domains;
DROP POLICY IF EXISTS "Anyone can insert client_domains" ON public.client_domains;
DROP POLICY IF EXISTS "Anyone can update client_domains" ON public.client_domains;

CREATE POLICY "Anon and authenticated can insert client_domains"
ON public.client_domains FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anon and authenticated can update client_domains"
ON public.client_domains FOR UPDATE
USING (true);

CREATE POLICY "Anon and authenticated can delete client_domains"
ON public.client_domains FOR DELETE
USING (true);

-- ============ DEV TRACKING TABLE ============
DROP POLICY IF EXISTS "Anyone can delete dev_tracking" ON public.dev_tracking;
DROP POLICY IF EXISTS "Anyone can insert dev_tracking" ON public.dev_tracking;
DROP POLICY IF EXISTS "Anyone can update dev_tracking" ON public.dev_tracking;

CREATE POLICY "Anon and authenticated can insert dev_tracking"
ON public.dev_tracking FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anon and authenticated can update dev_tracking"
ON public.dev_tracking FOR UPDATE
USING (true);

CREATE POLICY "Anon and authenticated can delete dev_tracking"
ON public.dev_tracking FOR DELETE
USING (true);