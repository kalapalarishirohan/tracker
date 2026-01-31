import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

export interface Developer {
  id: string;
  user_id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  specialty: string | null;
  status: 'active' | 'inactive' | 'busy';
  created_at: string;
  updated_at: string;
}

export interface DeveloperAssignment {
  id: string;
  developer_id: string;
  project_id: string | null;
  title: string;
  description: string | null;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'on-hold';
  due_date: string | null;
  assigned_by: string | null;
  created_at: string;
  updated_at: string;
  project?: {
    id: string;
    title: string;
    client_id: string;
  };
}

export function useDeveloperAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch developer profile
  const fetchDeveloperProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('developers')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching developer profile:', error);
      return null;
    }
    
    return data as Developer | null;
  }, []);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Use setTimeout to avoid Supabase deadlock
          setTimeout(async () => {
            const profile = await fetchDeveloperProfile(session.user.id);
            setDeveloper(profile);
            setLoading(false);
          }, 0);
        } else {
          setDeveloper(null);
          setLoading(false);
        }
      }
    );

    // Then check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchDeveloperProfile(session.user.id).then(profile => {
          setDeveloper(profile);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchDeveloperProfile]);

  const signUp = async (email: string, password: string, name: string, specialty?: string) => {
    setLoading(true);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      }
    });

    if (error) {
      setLoading(false);
      toast.error('Sign up failed', { description: error.message });
      return { error };
    }

    if (data.user) {
      // Create developer profile
      const { error: profileError } = await supabase
        .from('developers')
        .insert({
          user_id: data.user.id,
          name,
          email,
          specialty: specialty || null,
          status: 'active'
        });

      if (profileError) {
        console.error('Error creating developer profile:', profileError);
        toast.error('Profile creation failed', { description: profileError.message });
        setLoading(false);
        return { error: profileError };
      }

      // Add developer role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: data.user.id,
          role: 'developer'
        });

      if (roleError) {
        console.error('Error assigning developer role:', roleError);
      }

      toast.success('Account created!', { 
        description: 'Please check your email to verify your account.' 
      });
    }

    setLoading(false);
    return { data, error: null };
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      toast.error('Sign in failed', { description: error.message });
      return { error };
    }

    if (data.user) {
      const profile = await fetchDeveloperProfile(data.user.id);
      if (!profile) {
        // Not a developer account
        await supabase.auth.signOut();
        setLoading(false);
        toast.error('Access denied', { description: 'This account is not registered as a developer.' });
        return { error: new Error('Not a developer account') };
      }
      setDeveloper(profile);
      toast.success('Welcome back!', { description: `Signed in as ${profile.name}` });
    }

    setLoading(false);
    return { data, error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setDeveloper(null);
    setSession(null);
    toast.success('Signed out successfully');
  };

  return {
    user,
    developer,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!developer,
  };
}

// Hook for fetching developer assignments
export function useDeveloperAssignments(developerId?: string) {
  const [assignments, setAssignments] = useState<DeveloperAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAssignments = useCallback(async () => {
    if (!developerId) {
      setAssignments([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('developer_assignments')
      .select(`
        *,
        project:projects(id, title, client_id)
      `)
      .eq('developer_id', developerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching assignments:', error);
      toast.error('Failed to load assignments');
    } else {
      setAssignments((data || []) as DeveloperAssignment[]);
    }
    setLoading(false);
  }, [developerId]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const updateAssignmentStatus = async (assignmentId: string, status: DeveloperAssignment['status']) => {
    const { error } = await supabase
      .from('developer_assignments')
      .update({ status })
      .eq('id', assignmentId);

    if (error) {
      console.error('Error updating assignment:', error);
      toast.error('Failed to update assignment');
      return false;
    }

    await fetchAssignments();
    toast.success('Assignment updated');
    return true;
  };

  return { assignments, loading, fetchAssignments, updateAssignmentStatus };
}

// Hook for fetching all developers (team view)
export function useDevelopers() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDevelopers = useCallback(async () => {
    const { data, error } = await supabase
      .from('developers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching developers:', error);
      toast.error('Failed to load team');
    } else {
      setDevelopers((data || []) as Developer[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDevelopers();
  }, [fetchDevelopers]);

  return { developers, loading, fetchDevelopers };
}

// Hook for fetching active projects for developers
export function useActiveProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        client:clients(id, name, company)
      `)
      .eq('is_completed', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, loading, fetchProjects };
}
