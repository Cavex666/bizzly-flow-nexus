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
        (payload) => {
          console.log('Client change detected:', payload);
          console.log('All payload keys:', Object.keys(payload));
          console.log('eventType:', payload.eventType);
          
          // Immediately update local state for faster response
          const eventType = payload.eventType;
          
          if (eventType === 'INSERT') {
            console.log('Inserting client:', payload.new);
            setClients(prev => [payload.new as Client, ...prev]);
          } else if (eventType === 'UPDATE') {
            console.log('Updating client:', payload.new);
            setClients(prev => prev.map(c => c.id === (payload.new as Client).id ? payload.new as Client : c));
          } else if (eventType === 'DELETE') {
            console.log('Deleting client with id:', payload.old?.id);
            setClients(prev => prev.filter(c => c.id !== (payload.old as Client).id));
          } else {
            console.log('Unknown event type, doing full reload:', eventType);
            // Fallback to full reload for other cases
            loadClients();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const deleteClient = async (clientId: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (error) {
        throw error;
      }
      
      // Real-time will handle the UI update automatically
      console.log('Client deleted successfully, waiting for real-time update');
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  };

  return { clients, loading, refetch: loadClients, deleteClient };
};