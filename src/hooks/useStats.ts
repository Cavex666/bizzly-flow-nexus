import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Stats {
  activeProjects: number;
  totalClients: number;
  totalRevenue: number;
  totalProfit: number;
  currency: string;
}

export const useStats = () => {
  const [stats, setStats] = useState<Stats>({
    activeProjects: 0,
    totalClients: 0,
    totalRevenue: 0,
    totalProfit: 0,
    currency: 'BYN'
  });
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Load projects for active count and revenue
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('status, budget, currency')
        .eq('user_id', user.id);

      if (projectsError) {
        toast({ title: 'Ошибка', description: 'Не удалось загрузить статистику проектов' });
        return;
      }

      // Load clients count
      const { data: clients, error: clientsError } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id);

      if (clientsError) {
        toast({ title: 'Ошибка', description: 'Не удалось загрузить статистику клиентов' });
        return;
      }

      const activeProjects = projects?.filter(p => p.status === 'active' || p.status === 'new').length || 0;
      const totalClients = clients?.length || 0;
      const totalRevenue = projects?.reduce((sum, p) => sum + (p.budget || 0), 0) || 0;
      // Assuming profit is 70% of revenue for calculation
      const totalProfit = totalRevenue * 0.7;

      setStats({
        activeProjects,
        totalClients,
        totalRevenue,
        totalProfit,
        currency: 'BYN' // You could make this dynamic based on user settings
      });
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Произошла ошибка при загрузке статистики' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();

    // Subscribe to real-time updates
    const projectsChannel = supabase
      .channel('stats-projects-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects'
        },
        () => {
          loadStats();
        }
      )
      .subscribe();

    const clientsChannel = supabase
      .channel('stats-clients-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'clients'
        },
        () => {
          loadStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(projectsChannel);
      supabase.removeChannel(clientsChannel);
    };
  }, []);

  return { stats, loading, refetch: loadStats };
};