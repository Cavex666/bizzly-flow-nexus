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

export const DashboardPage = () => {
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showCreateClient, setShowCreateClient] = useState(false);
  const [showCalendarEditor, setShowCalendarEditor] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

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
            onClick={() => setShowCreateClient(true)}
            variant="outline"
            className="gap-2"
          >
            <Users className="w-4 h-4" />
            Добавить клиента
          </Button>
          <Button
            onClick={() => setShowCreateProject(true)}
            className="material-button gap-2"
          >
            <Plus className="w-4 h-4" />
            Создать проект
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <QuickStats />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Calendar Section */}
        <div className="xl:col-span-2 space-y-6">
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
              Активные проекты
            </h2>
            <ProjectsList
              onProjectSelect={setSelectedProject}
              selectedProject={selectedProject}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Clients List */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Клиенты
            </h2>
            <ClientsList
              onClientSelect={setSelectedClient}
              selectedClient={selectedClient}
            />
          </div>

          {/* Quick Actions */}
          <div className="floating-card p-6 rounded-2xl">
            <h3 className="text-lg font-semibold mb-4">Быстрые действия</h3>
            <div className="space-y-3">
              <Button
                onClick={() => setShowCreateProject(true)}
                variant="outline"
                className="w-full justify-start gap-2"
              >
                <Plus className="w-4 h-4" />
                Новый проект
              </Button>
              <Button
                onClick={() => setShowCreateClient(true)}
                variant="outline"
                className="w-full justify-start gap-2"
              >
                <Users className="w-4 h-4" />
                Новый клиент
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
              >
                <DollarSign className="w-4 h-4" />
                Добавить платеж
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                Отчет
              </Button>
            </div>
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
    </div>
  );
};