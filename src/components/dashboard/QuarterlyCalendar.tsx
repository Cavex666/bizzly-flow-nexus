import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuarterlyCalendarProps {
  selectedProject: string | null;
  selectedClient: string | null;
}

export const QuarterlyCalendar = ({ selectedProject, selectedClient }: QuarterlyCalendarProps) => {
  const [currentQuarter, setCurrentQuarter] = useState(1);
  const [currentYear, setCurrentYear] = useState(2024);

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
    // Mock project days - in real app, this would check actual project dates
    if (selectedProject) {
      return Math.random() > 0.7; // Random project days for demo
    }
    return false;
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
          {days}
        </div>
      </div>
    );
  };

  const currentQuarterData = quarters[currentQuarter - 1];

  return (
    <div className="max-w-6xl">{/* Limit calendar max width */}
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold">
            {currentQuarterData.name} {currentYear}
          </h3>
          <p className="text-sm text-muted-foreground">
            {selectedProject && `Проект: ${selectedProject}`}
            {selectedClient && `Клиент: ${selectedClient}`}
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
          <div className="w-3 h-3 bg-primary rounded"></div>
          <span>Сегодня</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-secondary/20 border border-secondary rounded"></div>
          <span>Рабочие дни проекта</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-muted rounded"></div>
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