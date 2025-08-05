import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Project {
  id: string;
  name: string;
  client_name: string;
  client_id: string;
  status: string;
  progress: number;
  budget: number;
  currency: string;
  start_date: string;
  end_date: string;
  work_days_type: string;
  created_at: string;
  updated_at: string;
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        toast({ title: 'Ошибка', description: 'Не удалось загрузить проекты' });
        return;
      }

      setProjects(data || []);
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Произошла ошибка при загрузке проектов' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('projects-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects'
        },
        () => {
          loadProjects();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { projects, loading, refetch: loadProjects };
};