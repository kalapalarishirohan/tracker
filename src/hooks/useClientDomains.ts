import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface DbClientDomain {
  id: string;
  client_id: string;
  domain_type: 'core' | 'subdomain';
  name: string;
  url: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export function useClientDomains(clientId?: string) {
  const [domains, setDomains] = useState<DbClientDomain[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDomains = useCallback(async () => {
    if (!clientId) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('client_domains')
      .select('*')
      .eq('client_id', clientId)
      .order('domain_type', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching domains:', error);
      toast.error('Failed to load domains');
    } else {
      setDomains((data || []) as DbClientDomain[]);
    }
    setLoading(false);
  }, [clientId]);

  useEffect(() => {
    fetchDomains();
  }, [fetchDomains]);

  const addDomain = async (domain: Omit<DbClientDomain, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('client_domains')
      .insert([domain])
      .select()
      .single();

    if (error) {
      console.error('Error adding domain:', error);
      toast.error('Failed to add domain');
      return null;
    }

    setDomains(prev => [data as DbClientDomain, ...prev]);
    return data as DbClientDomain;
  };

  const updateDomain = async (id: string, updates: Partial<DbClientDomain>) => {
    const { error } = await supabase
      .from('client_domains')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating domain:', error);
      toast.error('Failed to update domain');
      return false;
    }

    await fetchDomains();
    return true;
  };

  const deleteDomain = async (id: string) => {
    const { error } = await supabase
      .from('client_domains')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting domain:', error);
      toast.error('Failed to delete domain');
      return false;
    }

    setDomains(prev => prev.filter(d => d.id !== id));
    return true;
  };

  return { domains, loading, fetchDomains, addDomain, updateDomain, deleteDomain };
}
