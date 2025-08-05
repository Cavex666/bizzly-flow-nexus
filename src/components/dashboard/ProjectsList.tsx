import { useState } from 'react';
import { Eye, Calendar, DollarSign, User, MoreVertical, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProjectsListProps {
  onProjectSelect: (projectId: string | null) => void;
  selectedProject: string | null;
}

type ProjectFilter = 'active' | 'all' | 'completed';

export const ProjectsList = ({ onProjectSelect, selectedProject }: ProjectsListProps) => {
  const [filter, setFilter] = useState<ProjectFilter>('active');

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
    <div className="space-y-4">
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
      <div className="grid gap-4">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className={`floating-card p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
              selectedProject === project.id 
                ? 'ring-2 ring-primary shadow-glow' 
                : 'hover:shadow-lg'
            }`}
            onClick={() => onProjectSelect(selectedProject === project.id ? null : project.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold mb-1">{project.name}</h4>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {project.client}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                  {getStatusText(project.status)}
                </span>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
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
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-success" />
                <span className="text-muted-foreground">Бюджет:</span>
                <span className="font-medium">{project.budget}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">
                  {project.workDaysType === 'working' ? 'Рабочие дни' : 'Календарные дни'}
                </span>
              </div>
            </div>

            {/* Dates */}
            <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Начало: {new Date(project.startDate).toLocaleDateString('ru-RU')}</span>
                <span>Окончание: {new Date(project.endDate).toLocaleDateString('ru-RU')}</span>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-4 pt-4 border-t border-border">
              <Button variant="outline" size="sm" className="w-full gap-2">
                <Eye className="w-4 h-4" />
                Просмотр проекта
              </Button>
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