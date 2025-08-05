import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProjects } from '@/hooks/useProjects';
import { useClients } from '@/hooks/useClients';

interface QuarterlyCalendarProps {
  selectedProject: string | null;
  selectedClient: string | null;
}

export const QuarterlyCalendar = ({ selectedProject, selectedClient }: QuarterlyCalendarProps) => {
  const now = new Date();
  const currentQuarterNumber = Math.ceil((now.getMonth() + 1) / 3);
  const [currentQuarter, setCurrentQuarter] = useState(currentQuarterNumber);
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const { projects } = useProjects();
  const { clients } = useClients();

  const quarters = [
    { name: 'Q1', months: ['Январь', 'Февраль', 'Март'] },
    { name: 'Q2', months: ['Апрель', 'Май', 'Июнь'] },
    { name: 'Q3', months: ['Июль', 'Август', 'Сентябрь'] },
    { name: 'Q4', months: ['Октябрь', 'Ноябрь', 'Декабрь'] }
  ];

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  const navigateQuarter = (direction: 'prev' | 'next') => {
    if (direction === 'next') {
      if (currentQuarter === 4) {
        setCurrentQuarter(1);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentQuarter(currentQuarter + 1);
      }
    } else {
      if (currentQuarter === 1) {
        setCurrentQuarter(4);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentQuarter(currentQuarter - 1);
      }
    }
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    const firstDay = new Date(year, month - 1, 1).getDay();
    return firstDay === 0 ? 7 : firstDay; // Convert Sunday (0) to 7
  };

  const isWeekend = (day: number, month: number) => {
    const date = new Date(currentYear, month - 1, day);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
  };

  const isToday = (day: number, month: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() + 1 &&
      currentYear === today.getFullYear()
    );
  };

  const isProjectDay = (day: number, month: number) => {
    const currentDate = new Date(currentYear, month - 1, day);
    
    let relevantProjects = projects;
    
    // Filter by selected project
    if (selectedProject) {
      relevantProjects = projects.filter(p => p.id === selectedProject);
    }
    // Filter by selected client
    else if (selectedClient) {
      relevantProjects = projects.filter(p => p.client_id === selectedClient);
    }
    
    // Check if current date is within any project's date range
    return relevantProjects.some(project => {
      if (!project.start_date || !project.end_date) return false;
      
      const startDate = new Date(project.start_date);
      const endDate = new Date(project.end_date);
      
      // Check if current date is within project range
      if (currentDate < startDate || currentDate > endDate) return false;
      
      // If work_days_type is 'working', exclude weekends
      if (project.work_days_type === 'working') {
        const dayOfWeek = currentDate.getDay();
        return dayOfWeek !== 0 && dayOfWeek !== 6; // Exclude Sunday (0) and Saturday (6)
      }
      
      // If work_days_type is 'calendar', include all days
      return true;
    });
  };

  const renderMonth = (monthName: string, monthIndex: number) => {
    const month = monthIndex + 1;
    const daysInMonth = getDaysInMonth(month, currentYear);
    const firstDay = getFirstDayOfMonth(month, currentYear);
    
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 1; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isWeekendDay = isWeekend(day, month);
      const isTodayDay = isToday(day, month);
      const isProjectWorkDay = isProjectDay(day, month);
      
      days.push(
        <div
          key={day}
          className={`
            aspect-square flex items-center justify-center text-xs cursor-pointer transition-all duration-200 w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10
            ${isTodayDay 
              ? 'bg-primary text-primary-foreground font-bold shadow-md rounded-full scale-110' 
              : isProjectWorkDay 
                ? 'bg-secondary/20 border border-secondary text-secondary-dark font-medium rounded-full'
                : isWeekendDay 
                  ? 'bg-muted text-muted-foreground rounded-full' 
                  : 'hover:bg-primary/10 rounded-full'
            }
          `}
        >
          {day}
        </div>
      );
    }
    
    return (
      <div className="floating-card p-4 rounded-2xl">
        <h4 className="text-lg font-semibold mb-3 text-center">{monthName}</h4>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-xs font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <div key={`day-${index}`}>{day}</div>
          ))}
        </div>
      </div>
    );
  };

  const currentQuarterData = quarters[currentQuarter - 1];

  return (
    <div className="max-w-6xl mx-auto">{/* Center calendar and limit max width */}
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold">
            {currentQuarterData.name} {currentYear}
          </h3>
          <p className="text-sm text-muted-foreground">
            {selectedProject && (() => {
              const project = projects.find(p => p.id === selectedProject);
              return `Проект: ${project?.name || 'Неизвестный проект'}`;
            })()}
            {selectedClient && (() => {
              const client = clients.find(c => c.id === selectedClient);
              return `Клиент: ${client?.company_name || 'Неизвестный клиент'}`;
            })()}
            {!selectedProject && !selectedClient && 'Выберите проект или клиента для отображения дат'}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateQuarter('prev')}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateQuarter('next')}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <span>Сегодня</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-secondary/20 border border-secondary rounded-full"></div>
          <span>Дни проекта (рабочие/календарные в зависимости от настроек)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-muted rounded-full"></div>
          <span>Выходные</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {currentQuarterData.months.map((month, index) => 
          renderMonth(month, (currentQuarter - 1) * 3 + index)
        )}
      </div>
    </div>
  );
};