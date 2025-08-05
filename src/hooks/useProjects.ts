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
        (payload) => {
          console.log('Project change detected:', payload);
          console.log('All payload keys:', Object.keys(payload));
          console.log('eventType:', payload.eventType);
          
          // Immediately update local state for faster response
          const eventType = payload.eventType;
          
          if (eventType === 'INSERT') {
            console.log('Inserting project:', payload.new);
            setProjects(prev => [payload.new as Project, ...prev]);
          } else if (eventType === 'UPDATE') {
            console.log('Updating project:', payload.new);
            setProjects(prev => prev.map(p => p.id === (payload.new as Project).id ? payload.new as Project : p));
          } else if (eventType === 'DELETE') {
            console.log('Deleting project with id:', payload.old?.id);
            setProjects(prev => prev.filter(p => p.id !== (payload.old as Project).id));
          } else {
            console.log('Unknown event type, doing full reload:', eventType);
            // Fallback to full reload for other cases
            loadProjects();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const deleteProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) {
        throw error;
      }
      
      // Real-time will handle the UI update automatically
      console.log('Project deleted successfully, waiting for real-time update');
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  };

  return { projects, loading, refetch: loadProjects, deleteProject };
};