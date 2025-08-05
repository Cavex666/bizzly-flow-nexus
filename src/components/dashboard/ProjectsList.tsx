import { useState } from 'react';
import { Eye, Calendar, DollarSign, User, MoreVertical, FolderOpen, Search, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useProjects } from '@/hooks/useProjects';
import { useClients } from '@/hooks/useClients';

interface ProjectsListProps {
  onProjectSelect: (projectId: string | null) => void;
  selectedProject: string | null;
  onProjectView?: (project: any) => void;
  onProjectEdit?: (project: any) => void;
  onProjectDelete?: (project: any) => void;
  searchQuery?: string;
  filter?: ProjectFilter;
  selectedClientId?: string | null;
}

type ProjectFilter = 'active' | 'all' | 'completed';

export const ProjectsList = ({ 
  onProjectSelect, 
  selectedProject, 
  onProjectView,
  onProjectEdit,
  onProjectDelete,
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

  const calculateDateProgress = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    
    if (now < start) return 0;
    if (now > end) return 100;
    
    const totalTime = end.getTime() - start.getTime();
    const elapsedTime = now.getTime() - start.getTime();
    
    return Math.round((elapsedTime / totalTime) * 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  if (projectsLoading) {
    return (
      <div className="space-y-4 flex flex-col h-full">
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-20 rounded-md" />
          ))}
        </div>
        <div className="grid gap-3 flex-1 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-card border border-border rounded-lg p-3">
              <div className="flex items-start gap-3">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-2 w-full" />
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
      <div className="grid gap-3 flex-1 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
        {filteredProjects.map((project) => {
          const clientName = getClientName(project.client_id);
          const dateProgress = calculateDateProgress(project.start_date, project.end_date);
          return (
            <div
              key={project.id}
              className={`bg-card border border-border rounded-lg p-2 cursor-pointer transition-all duration-300 hover:border-primary/50 ${
                selectedProject === project.id 
                  ? 'border-primary bg-primary/5' 
                  : ''
              }`}
              onClick={() => onProjectSelect(selectedProject === project.id ? null : project.id)}
            >
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-primary/20 rounded-md flex items-center justify-center flex-shrink-0">
                  <FolderOpen className="w-3 h-3 text-primary" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-xs mb-0.5 truncate">{project.name}</h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <User className="w-2.5 h-2.5" />
                        <span className="truncate">{clientName}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {onProjectView && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            onProjectView(project);
                          }}
                        >
                          <Eye className="w-2.5 h-2.5" />
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="w-2.5 h-2.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32">
                          {onProjectEdit && (
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              onProjectEdit(project);
                            }}>
                              <Edit className="w-3 h-3 mr-2" />
                              Редактировать
                            </DropdownMenuItem>
                          )}
                          {onProjectDelete && (
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.stopPropagation();
                                onProjectDelete(project);
                              }}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="w-3 h-3 mr-2" />
                              Удалить
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Progress Bar and Status */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${getStatusColor(project.status)}`}>
                        {getStatusText(project.status)}
                      </span>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(project.start_date)} - {formatDate(project.end_date)}
                      </div>
                    </div>
                    
                    <div className="space-y-0.5">
                      <Progress value={dateProgress} className="h-1.5" />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Прогресс: {dateProgress}%</span>
                        <span>{project.budget?.toLocaleString()} {project.currency}</span>
                      </div>
                    </div>
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