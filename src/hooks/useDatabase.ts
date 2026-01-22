import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types matching database schema
export interface DbClient {
  id: string;
  assigned_id: string;
  name: string;
  email: string;
  company: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbProject {
  id: string;
  client_id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  total_progress: number;
  is_completed: boolean;
  project_lead: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbProjectStage {
  id: string;
  project_id: string;
  name: string;
  status: 'pending' | 'in-progress' | 'completed';
  completion_percentage: number;
  sort_order: number;
  created_at: string;
}

export interface DbTicket {
  id: string;
  client_id: string;
  project_id: string | null;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  response: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbSubmission {
  id: string;
  client_id: string;
  type: 'project_request' | 'feedback' | 'general';
  data: Record<string, string | number | boolean | null>;
  status: 'pending' | 'reviewed' | 'archived';
  submitted_at: string;
}

// Hook for clients
export function useClients() {
  const [clients, setClients] = useState<DbClient[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = useCallback(async () => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching clients:', error);
      toast.error('Failed to load clients');
    } else {
      setClients((data || []) as DbClient[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const addClient = async (client: Omit<DbClient, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('clients')
      .insert([client])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding client:', error);
      toast.error('Failed to add client');
      return null;
    }
    
    setClients(prev => [data as DbClient, ...prev]);
    return data as DbClient;
  };

  const loginClient = async (assignedId: string): Promise<DbClient | null> => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('assigned_id', assignedId)
      .maybeSingle();
    
    if (error) {
      console.error('Error logging in client:', error);
      return null;
    }
    
    return data as DbClient | null;
  };

  return { clients, loading, fetchClients, addClient, loginClient };
}

// Hook for projects with stages
export function useProjects(clientId?: string) {
  const [projects, setProjects] = useState<(DbProject & { stages: DbProjectStage[] })[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    let query = supabase.from('projects').select('*');
    
    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    
    const { data: projectsData, error: projectsError } = await query.order('created_at', { ascending: false });
    
    if (projectsError) {
      console.error('Error fetching projects:', projectsError);
      toast.error('Failed to load projects');
      setLoading(false);
      return;
    }

    // Fetch stages for all projects
    const projectIds = projectsData?.map(p => p.id) || [];
    
    if (projectIds.length === 0) {
      setProjects([]);
      setLoading(false);
      return;
    }

    const { data: stagesData, error: stagesError } = await supabase
      .from('project_stages')
      .select('*')
      .in('project_id', projectIds)
      .order('sort_order', { ascending: true });

    if (stagesError) {
      console.error('Error fetching stages:', stagesError);
    }

    const projectsWithStages = (projectsData || []).map(project => ({
      ...(project as DbProject),
      stages: ((stagesData || []) as DbProjectStage[]).filter(s => s.project_id === project.id)
    }));

    setProjects(projectsWithStages);
    setLoading(false);
  }, [clientId]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const addProject = async (
    project: Omit<DbProject, 'id' | 'created_at' | 'updated_at'>,
    stages: Omit<DbProjectStage, 'id' | 'project_id' | 'created_at'>[]
  ) => {
    // Insert project
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .insert([project])
      .select()
      .single();
    
    if (projectError) {
      console.error('Error adding project:', projectError);
      toast.error('Failed to add project');
      return null;
    }

    // Insert stages
    const stagesWithProjectId = stages.map(s => ({
      ...s,
      project_id: projectData.id
    }));

    const { data: stagesData, error: stagesError } = await supabase
      .from('project_stages')
      .insert(stagesWithProjectId)
      .select();
    
    if (stagesError) {
      console.error('Error adding stages:', stagesError);
    }

    const newProject = {
      ...(projectData as DbProject),
      stages: ((stagesData || []) as DbProjectStage[])
    };

    setProjects(prev => [newProject, ...prev]);
    return newProject;
  };

  const updateProjectProgress = async (
    projectId: string, 
    stageName: string, 
    progress: number
  ) => {
    // Update the stage
    const { error: stageError } = await supabase
      .from('project_stages')
      .update({
        completion_percentage: progress,
        status: progress === 100 ? 'completed' : progress > 0 ? 'in-progress' : 'pending'
      })
      .eq('project_id', projectId)
      .eq('name', stageName);
    
    if (stageError) {
      console.error('Error updating stage:', stageError);
      toast.error('Failed to update progress');
      return false;
    }

    // Recalculate total progress
    const { data: allStages } = await supabase
      .from('project_stages')
      .select('completion_percentage')
      .eq('project_id', projectId);

    const totalProgress = allStages 
      ? Math.round(allStages.reduce((acc, s) => acc + s.completion_percentage, 0) / allStages.length)
      : 0;

    const isCompleted = allStages?.every(s => s.completion_percentage === 100) || false;

    // Update project total
    const { error: projectError } = await supabase
      .from('projects')
      .update({ 
        total_progress: totalProgress,
        is_completed: isCompleted,
        end_date: isCompleted ? new Date().toISOString() : null
      })
      .eq('id', projectId);
    
    if (projectError) {
      console.error('Error updating project:', projectError);
    }

    await fetchProjects();
    return true;
  };

  const markProjectComplete = async (projectId: string) => {
    // Update all stages to completed
    const { error: stagesError } = await supabase
      .from('project_stages')
      .update({
        completion_percentage: 100,
        status: 'completed'
      })
      .eq('project_id', projectId);
    
    if (stagesError) {
      console.error('Error completing stages:', stagesError);
      toast.error('Failed to complete project');
      return false;
    }

    // Update project
    const { error: projectError } = await supabase
      .from('projects')
      .update({
        total_progress: 100,
        is_completed: true,
        end_date: new Date().toISOString()
      })
      .eq('id', projectId);
    
    if (projectError) {
      console.error('Error completing project:', projectError);
      return false;
    }

    await fetchProjects();
    return true;
  };

  return { 
    projects, 
    loading, 
    fetchProjects, 
    addProject, 
    updateProjectProgress, 
    markProjectComplete 
  };
}

// Hook for tickets
export function useTickets(clientId?: string) {
  const [tickets, setTickets] = useState<DbTicket[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = useCallback(async () => {
    let query = supabase.from('tickets').select('*');
    
    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Failed to load tickets');
    } else {
      setTickets((data || []) as DbTicket[]);
    }
    setLoading(false);
  }, [clientId]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const addTicket = async (ticket: Omit<DbTicket, 'id' | 'created_at' | 'updated_at' | 'response'>) => {
    const { data, error } = await supabase
      .from('tickets')
      .insert([ticket])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding ticket:', error);
      toast.error('Failed to create ticket');
      return null;
    }
    
    setTickets(prev => [data as DbTicket, ...prev]);
    return data as DbTicket;
  };

  const respondToTicket = async (ticketId: string, response: string) => {
    const { error } = await supabase
      .from('tickets')
      .update({
        response,
        status: 'resolved'
      })
      .eq('id', ticketId);
    
    if (error) {
      console.error('Error responding to ticket:', error);
      toast.error('Failed to respond to ticket');
      return false;
    }

    await fetchTickets();
    return true;
  };

  const updateTicketStatus = async (ticketId: string, status: DbTicket['status']) => {
    const { error } = await supabase
      .from('tickets')
      .update({ status })
      .eq('id', ticketId);
    
    if (error) {
      console.error('Error updating ticket status:', error);
      toast.error('Failed to update ticket');
      return false;
    }

    await fetchTickets();
    return true;
  };

  return { tickets, loading, fetchTickets, addTicket, respondToTicket, updateTicketStatus };
}

// Hook for submissions
export function useSubmissions(clientId?: string) {
  const [submissions, setSubmissions] = useState<DbSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = useCallback(async () => {
    let query = supabase.from('submissions').select('*');
    
    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    
    const { data, error } = await query.order('submitted_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to load submissions');
    } else {
      setSubmissions((data || []) as DbSubmission[]);
    }
    setLoading(false);
  }, [clientId]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const addSubmission = async (submission: Omit<DbSubmission, 'id' | 'submitted_at'>) => {
    const { data, error } = await supabase
      .from('submissions')
      .insert([submission])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding submission:', error);
      toast.error('Failed to submit');
      return null;
    }
    
    setSubmissions(prev => [data as DbSubmission, ...prev]);
    return data as DbSubmission;
  };

  const updateSubmissionStatus = async (submissionId: string, status: DbSubmission['status']) => {
    const { error } = await supabase
      .from('submissions')
      .update({ status })
      .eq('id', submissionId);
    
    if (error) {
      console.error('Error updating submission:', error);
      toast.error('Failed to update submission');
      return false;
    }

    await fetchSubmissions();
    return true;
  };

  return { submissions, loading, fetchSubmissions, addSubmission, updateSubmissionStatus };
}
