import { useState } from 'react';
import { Eye, Calendar, DollarSign, User, MoreVertical, FolderOpen, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ProjectsListProps {
  onProjectSelect: (projectId: string | null) => void;
  selectedProject: string | null;
  onProjectView?: (project: any) => void;
}

type ProjectFilter = 'active' | 'all' | 'completed';

export const ProjectsList = ({ onProjectSelect, selectedProject, onProjectView }: ProjectsListProps) => {
  const [filter, setFilter] = useState<ProjectFilter>('active');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock projects data
  const projects = [
    {
      id: '1',
      name: 'Склад 500 тн',
      client: 'ООО "Логистика Плюс"',
      status: 'active',
      progress: 65,
      budget: '125,000 BYN',
      startDate: '2024-01-15',
      endDate: '2024-04-30',
      workDaysType: 'working'
    },
    {
      id: '2',
      name: 'Офисное здание',
      client: 'ЗАО "СтройИнвест"',
      status: 'active',
      progress: 30,
      budget: '280,000 BYN',
      startDate: '2024-02-01',
      endDate: '2024-08-15',
      workDaysType: 'calendar'
    },
    {
      id: '3',
      name: 'Торговый центр',
      client: 'ООО "РетейлДев"',
      status: 'completed',
      progress: 100,
      budget: '450,000 BYN',
      startDate: '2023-09-01',
      endDate: '2024-01-30',
      workDaysType: 'working'
    }
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    switch (filter) {
      case 'active':
        return project.status === 'active';
      case 'completed':
        return project.status === 'completed';
      default:
        return true;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success/10 text-success';
      case 'completed':
        return 'bg-primary/10 text-primary';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Активный';
      case 'completed':
        return 'Завершен';
      default:
        return 'Неизвестно';
    }
  };

  return (
    <div className="space-y-4 flex flex-col h-full">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Поиск по названию проекта или клиенту..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

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
      <div className="grid gap-4 flex-1 overflow-auto">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className={`floating-card p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
              selectedProject === project.id 
                ? 'ring-2 ring-primary shadow-glow' 
                : 'hover:shadow-lg'
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
                      <span className="truncate">{project.client}</span>
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                      {getStatusText(project.status)}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Добавить логику для меню
                      }}
                    >
                      <MoreVertical className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-2">
                    <span>Прогресс</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Project Details */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <DollarSign className="w-3 h-3" />
                    <span className="font-medium">{project.budget}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {project.workDaysType === 'working' ? 'Рабочие дни' : 'Календарные дни'}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-3 pt-3 border-t border-border">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full gap-2 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      onProjectView?.(project);
                    }}
                  >
                    <Eye className="w-3 h-3" />
                    Просмотр проекта
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredProjects.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Нет проектов в выбранной категории</p>
          </div>
        )}
      </div>
    </div>
  );
};