-- Allow anon to read developer_assignments (admin dashboard uses anon key)
CREATE POLICY "Anon can read all assignments"
ON public.developer_assignments FOR SELECT
USING (true);

-- Allow anon to insert assignments (admin dashboard creates tasks)
CREATE POLICY "Anon can insert assignments"
ON public.developer_assignments FOR INSERT
WITH CHECK (true);

-- Allow anon to update assignments (admin dashboard manages status)
CREATE POLICY "Anon can update assignments"
ON public.developer_assignments FOR UPDATE
USING (true);

-- Allow anon to delete assignments (admin dashboard can remove tasks)
CREATE POLICY "Anon can delete assignments"
ON public.developer_assignments FOR DELETE
USING (true);