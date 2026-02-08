import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AdminDeveloper {
  id: string;
  name: string;
  email: string;
  specialty: string | null;
  status: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface AdminAssignment {
  id: string;
  developer_id: string;
  project_id: string | null;
  title: string;
  description: string | null;
  priority: string | null;
  status: string | null;
  due_date: string | null;
  assigned_by: string | null;
  created_at: string;
  updated_at: string;
  developer?: { name: string; email: string };
  project?: { title: string } | null;
}

export function useAdminDevelopers() {
  const [developers, setDevelopers] = useState<AdminDeveloper[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDevelopers = useCallback(async () => {
    const { data, error } = await supabase
      .from('developers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching developers:', error);
      toast.error('Failed to load developers');
    } else {
      setDevelopers((data || []) as AdminDeveloper[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDevelopers();
  }, [fetchDevelopers]);

  return { developers, loading, fetchDevelopers };
}

export function useAdminAssignments() {
  const [assignments, setAssignments] = useState<AdminAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAssignments = useCallback(async () => {
    // Fetch assignments
    const { data: assignmentsData, error: assignmentsError } = await supabase
      .from('developer_assignments')
      .select('*')
      .order('created_at', { ascending: false });

    if (assignmentsError) {
      console.error('Error fetching assignments:', assignmentsError);
      toast.error('Failed to load assignments');
      setLoading(false);
      return;
    }

    // Fetch related developers and projects
    const devIds = [...new Set((assignmentsData || []).map(a => a.developer_id))];
    const projIds = [...new Set((assignmentsData || []).filter(a => a.project_id).map(a => a.project_id!))];

    const [devsResult, projsResult] = await Promise.all([
      devIds.length > 0
        ? supabase.from('developers').select('id, name, email').in('id', devIds)
        : Promise.resolve({ data: [], error: null }),
      projIds.length > 0
        ? supabase.from('projects').select('id, title').in('id', projIds)
        : Promise.resolve({ data: [], error: null }),
    ]);

    const devsMap = new Map((devsResult.data || []).map(d => [d.id, d]));
    const projsMap = new Map((projsResult.data || []).map(p => [p.id, p]));

    const enriched = (assignmentsData || []).map(a => ({
      ...a,
      developer: devsMap.get(a.developer_id) as { name: string; email: string } | undefined,
      project: a.project_id ? (projsMap.get(a.project_id) as { title: string } | null) : null,
    })) as AdminAssignment[];

    setAssignments(enriched);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const createAssignment = async (assignment: {
    developer_id: string;
    project_id: string | null;
    title: string;
    description: string | null;
    priority: string;
    due_date: string | null;
  }) => {
    const { data, error } = await supabase
      .from('developer_assignments')
      .insert([{
        ...assignment,
        assigned_by: 'admin',
        status: 'pending',
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating assignment:', error);
      toast.error('Failed to create assignment');
      return null;
    }

    await fetchAssignments();
    return data;
  };

  const updateAssignmentStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('developer_assignments')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating assignment:', error);
      toast.error('Failed to update assignment');
      return false;
    }

    await fetchAssignments();
    return true;
  };

  const deleteAssignment = async (id: string) => {
    const { error } = await supabase
      .from('developer_assignments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting assignment:', error);
      toast.error('Failed to delete assignment');
      return false;
    }

    await fetchAssignments();
    return true;
  };

  return {
    assignments,
    loading,
    fetchAssignments,
    createAssignment,
    updateAssignmentStatus,
    deleteAssignment,
  };
}
