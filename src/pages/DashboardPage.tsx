import { useState } from 'react';
import { Plus, Calendar, Users, FolderOpen, DollarSign, TrendingUp, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuickStats } from '../components/dashboard/QuickStats';
import { QuarterlyCalendar } from '../components/dashboard/QuarterlyCalendar';
import { ProjectsList } from '../components/dashboard/ProjectsList';
import { ClientsList } from '../components/dashboard/ClientsList';
import { CreateProjectModal } from '../components/modals/CreateProjectModal';
import { CreateClientModal } from '../components/modals/CreateClientModal';
import { CalendarEditorModal } from '../components/modals/CalendarEditorModal';
import { ProjectViewModal } from '../components/modals/ProjectViewModal';

export const DashboardPage = () => {
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showCreateClient, setShowCreateClient] = useState(false);
  const [showCalendarEditor, setShowCalendarEditor] = useState(false);
  const [showProjectView, setShowProjectView] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [viewingProject, setViewingProject] = useState<any>(null);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Дашборд</h1>
          <p className="text-muted-foreground">Обзор ваших проектов и финансов</p>
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="gap-2"
          >
            <DollarSign className="w-4 h-4" />
            Добавить платеж
          </Button>
          <Button
            onClick={() => setShowCreateClient(true)}
            variant="outline"
            className="gap-2"
          >
            <Users className="w-4 h-4" />
            Добавить клиента
          </Button>
          <Button
            onClick={() => setShowCreateProject(true)}
            className="material-button gap-2 relative z-40"
          >
            <Plus className="w-4 h-4" />
            Создать проект
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="flex gap-6">
        {/* Stats and Clients Section */}
        <div className="flex flex-col gap-6">
          {/* Quick Stats */}
          <QuickStats />
          
          {/* Clients List */}
          <div className="w-96">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Клиенты
            </h2>
            <ClientsList
              onClientSelect={setSelectedClient}
              selectedClient={selectedClient}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Календарь проектов
            </h2>
            <Button
              onClick={() => setShowCalendarEditor(true)}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Settings className="w-4 h-4" />
              Редактор календаря
            </Button>
          </div>

          {/* Quarterly Calendar */}
          <QuarterlyCalendar
            selectedProject={selectedProject}
            selectedClient={selectedClient}
          />

          {/* Projects List */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-primary" />
              Все проекты
            </h2>
            <ProjectsList
              onProjectSelect={setSelectedProject}
              selectedProject={selectedProject}
              onProjectView={(project) => {
                setViewingProject(project);
                setShowProjectView(true);
              }}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCreateProject && (
        <CreateProjectModal onClose={() => setShowCreateProject(false)} />
      )}
      
      {showCreateClient && (
        <CreateClientModal onClose={() => setShowCreateClient(false)} />
      )}
      
      {showCalendarEditor && (
        <CalendarEditorModal onClose={() => setShowCalendarEditor(false)} />
      )}
      
      {showProjectView && (
        <ProjectViewModal 
          onClose={() => setShowProjectView(false)} 
          project={viewingProject}
        />
      )}
    </div>
  );
};