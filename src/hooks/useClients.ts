import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Client {
  id: string;
  company_name: string;
  contact_person: string;
  phone: string;
  email: string;
  country: string;
  created_at: string;
  updated_at: string;
}

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const loadClients = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        toast({ title: 'Ошибка', description: 'Не удалось загрузить клиентов' });
        return;
      }

      setClients(data || []);
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Произошла ошибка при загрузке клиентов' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('clients-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'clients'
        },
        () => {
          loadClients();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { clients, loading, refetch: loadClients };
};