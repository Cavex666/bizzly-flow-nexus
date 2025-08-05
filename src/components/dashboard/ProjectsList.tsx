import { useState } from 'react';
import { Eye, Calendar, DollarSign, User, MoreVertical, FolderOpen, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useProjects } from '@/hooks/useProjects';
import { useClients } from '@/hooks/useClients';

interface ProjectsListProps {
  onProjectSelect: (projectId: string | null) => void;
  selectedProject: string | null;
  onProjectView?: (project: any) => void;
  searchQuery?: string;
  filter?: ProjectFilter;
  selectedClientId?: string | null;
}

type ProjectFilter = 'active' | 'all' | 'completed';

export const ProjectsList = ({ 
  onProjectSelect, 
  selectedProject, 
  onProjectView,
  searchQuery = '',
  filter: externalFilter,
  selectedClientId
}: ProjectsListProps) => {
  const [filter, setFilter] = useState<ProjectFilter>(externalFilter || 'all');
  const { projects, loading: projectsLoading } = useProjects();
  const { clients } = useClients();

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client?.company_name || 'Неизвестный клиент';
  };

  const filteredProjects = projects.filter(project => {
    const clientName = getClientName(project.client_id);
    const matchesSearch = project.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         clientName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    // Filter by selected client
    if (selectedClientId && project.client_id !== selectedClientId) return false;
    
    switch (filter) {
      case 'active':
        return project.status === 'active' || project.status === 'new';
      case 'completed':
        return project.status === 'completed';
      default:
        return true;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'new':
        return 'bg-success/10 text-success';
      case 'completed':
        return 'bg-primary/10 text-primary';
      case 'paused':
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Активный';
      case 'new':
        return 'Новый';
      case 'completed':
        return 'Завершен';
      case 'paused':
        return 'Приостановлен';
      default:
        return 'Неизвестно';
    }
  };

  if (projectsLoading) {
    return (
      <div className="space-y-4 flex flex-col h-full">
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-20 rounded-md" />
          ))}
        </div>
        <div className="grid gap-4 flex-1 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="floating-card p-4 rounded-2xl">
              <div className="flex items-start gap-3">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-3 w-36" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 flex flex-col h-full">
      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[
          { key: 'active', label: 'Активные' },
          { key: 'all', label: 'Все' },
          { key: 'completed', label: 'Завершенные' }
        ].map(({ key, label }) => (
          <Button
            key={key}
            variant={filter === key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(key as ProjectFilter)}
            className={filter === key ? 'material-button' : ''}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid gap-4 flex-1 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
        {filteredProjects.map((project) => {
          const clientName = getClientName(project.client_id);
          return (
            <div
              key={project.id}
              className={`floating-card p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                selectedProject === project.id 
                  ? 'ring-2 ring-primary shadow-glow' 
                  : ''
              }`}
              onClick={() => onProjectSelect(selectedProject === project.id ? null : project.id)}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <FolderOpen className="w-5 h-5 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm mb-1 truncate">{project.name}</h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span className="truncate">{clientName}</span>
                      </p>
                    </div>
                    {onProjectView && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          onProjectView(project);
                        }}
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                    )}
                  </div>

                  {/* Project Details */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <DollarSign className="w-3 h-3" />
                      <span className="font-medium">
                        {project.budget?.toLocaleString()} {project.currency}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {project.work_days_type === 'working' ? 'Рабочие дни' : 'Календарные дни'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span>Прогресс: {project.progress || 0}%</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                      {getStatusText(project.status)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredProjects.length === 0 && !projectsLoading && (
          <div className="text-center py-8 text-muted-foreground">
            <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>
              {selectedClientId 
                ? 'У данного клиента нет проектов в выбранной категории'
                : searchQuery 
                  ? 'Проекты не найдены'
                  : 'Нет проектов в выбранной категории'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};