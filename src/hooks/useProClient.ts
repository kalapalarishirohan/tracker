import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface DbClientAsset {
  id: string;
  client_id: string;
  type: 'image' | 'video' | 'document' | 'link';
  name: string;
  url: string;
  description: string | null;
  file_size: number | null;
  mime_type: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbDevTracking {
  id: string;
  client_id: string;
  project_type: 'app' | 'web';
  phase: string;
  status: 'pending' | 'in-progress' | 'completed';
  progress: number;
  notes: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbApproachPlan {
  id: string;
  client_id: string;
  title: string;
  description: string | null;
  plan_data: Record<string, string | number | boolean | null>;
  image_url: string | null;
  is_protected: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbProClient {
  id: string;
  assigned_id: string;
  name: string;
  email: string;
  company: string | null;
  is_pro: boolean;
  created_at: string;
  updated_at: string;
}

// Hook for client assets
export function useClientAssets(clientId?: string) {
  const [assets, setAssets] = useState<DbClientAsset[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAssets = useCallback(async () => {
    if (!clientId) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('client_assets')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching assets:', error);
      toast.error('Failed to load assets');
    } else {
      setAssets((data || []) as DbClientAsset[]);
    }
    setLoading(false);
  }, [clientId]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const addAsset = async (asset: Omit<DbClientAsset, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('client_assets')
      .insert([asset])
      .select()
      .single();

    if (error) {
      console.error('Error adding asset:', error);
      toast.error('Failed to add asset');
      return null;
    }

    setAssets(prev => [data as DbClientAsset, ...prev]);
    return data as DbClientAsset;
  };

  const deleteAsset = async (assetId: string) => {
    const { error } = await supabase
      .from('client_assets')
      .delete()
      .eq('id', assetId);

    if (error) {
      console.error('Error deleting asset:', error);
      toast.error('Failed to delete asset');
      return false;
    }

    setAssets(prev => prev.filter(a => a.id !== assetId));
    return true;
  };

  const uploadFile = async (file: File, clientId: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${clientId}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('client-assets')
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
      return null;
    }

    const { data: publicUrl } = supabase.storage
      .from('client-assets')
      .getPublicUrl(data.path);

    return publicUrl.publicUrl;
  };

  return { assets, loading, fetchAssets, addAsset, deleteAsset, uploadFile };
}

// Hook for development tracking
export function useDevTracking(clientId?: string) {
  const [tracking, setTracking] = useState<DbDevTracking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTracking = useCallback(async () => {
    if (!clientId) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('dev_tracking')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching tracking:', error);
      toast.error('Failed to load tracking data');
    } else {
      setTracking((data || []) as DbDevTracking[]);
    }
    setLoading(false);
  }, [clientId]);

  useEffect(() => {
    fetchTracking();
  }, [fetchTracking]);

  const addTracking = async (item: Omit<DbDevTracking, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('dev_tracking')
      .insert([item])
      .select()
      .single();

    if (error) {
      console.error('Error adding tracking:', error);
      toast.error('Failed to add tracking');
      return null;
    }

    setTracking(prev => [...prev, data as DbDevTracking]);
    return data as DbDevTracking;
  };

  const updateTracking = async (id: string, updates: Partial<DbDevTracking>) => {
    const { error } = await supabase
      .from('dev_tracking')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating tracking:', error);
      toast.error('Failed to update tracking');
      return false;
    }

    await fetchTracking();
    return true;
  };

  const deleteTracking = async (id: string) => {
    const { error } = await supabase
      .from('dev_tracking')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting tracking:', error);
      toast.error('Failed to delete tracking');
      return false;
    }

    setTracking(prev => prev.filter(t => t.id !== id));
    return true;
  };

  return { tracking, loading, fetchTracking, addTracking, updateTracking, deleteTracking };
}

// Hook for approach plans
export function useApproachPlans(clientId?: string) {
  const [plans, setPlans] = useState<DbApproachPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = useCallback(async () => {
    if (!clientId) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('approach_plans')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching plans:', error);
      toast.error('Failed to load approach plans');
    } else {
      setPlans((data || []) as DbApproachPlan[]);
    }
    setLoading(false);
  }, [clientId]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const addPlan = async (plan: Omit<DbApproachPlan, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('approach_plans')
      .insert([plan])
      .select()
      .single();

    if (error) {
      console.error('Error adding plan:', error);
      toast.error('Failed to add plan');
      return null;
    }

    setPlans(prev => [data as DbApproachPlan, ...prev]);
    return data as DbApproachPlan;
  };

  const updatePlan = async (id: string, updates: Partial<DbApproachPlan>) => {
    const { error } = await supabase
      .from('approach_plans')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating plan:', error);
      toast.error('Failed to update plan');
      return false;
    }

    await fetchPlans();
    return true;
  };

  const deletePlan = async (id: string) => {
    const { error } = await supabase
      .from('approach_plans')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting plan:', error);
      toast.error('Failed to delete plan');
      return false;
    }

    setPlans(prev => prev.filter(p => p.id !== id));
    return true;
  };

  return { plans, loading, fetchPlans, addPlan, updatePlan, deletePlan };
}

// Hook for Pro clients
export function useProClients() {
  const [proClients, setProClients] = useState<DbProClient[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProClients = useCallback(async () => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('is_pro', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching pro clients:', error);
      toast.error('Failed to load pro clients');
    } else {
      setProClients((data || []) as DbProClient[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProClients();
  }, [fetchProClients]);

  const toggleProStatus = async (clientId: string, isPro: boolean) => {
    const { error } = await supabase
      .from('clients')
      .update({ is_pro: isPro })
      .eq('id', clientId);

    if (error) {
      console.error('Error updating pro status:', error);
      toast.error('Failed to update pro status');
      return false;
    }

    await fetchProClients();
    return true;
  };

  return { proClients, loading, fetchProClients, toggleProStatus };
}
