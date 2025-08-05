import { FolderOpen, Users, DollarSign, TrendingUp } from 'lucide-react';

export const QuickStats = () => {
  const stats = [
    {
      icon: FolderOpen,
      title: 'Активные проекты',
      value: '12',
      change: '+2 за месяц',
      changeType: 'positive'
    },
    {
      icon: Users,
      title: 'Клиенты',
      value: '8',
      change: '+1 за месяц',
      changeType: 'positive'
    },
    {
      icon: DollarSign,
      title: 'Общий доход',
      value: '125,500 BYN',
      change: '+15% за месяц',
      changeType: 'positive'
    },
    {
      icon: TrendingUp,
      title: 'Прибыль',
      value: '89,200 BYN',
      change: '+12% за месяц',
      changeType: 'positive'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.title}
            className="floating-card p-4 rounded-2xl hover:shadow-glow transition-all duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium ${
                stat.changeType === 'positive' 
                  ? 'bg-success text-white' 
                  : 'bg-destructive text-white'
              }`}>
                {stat.change.replace(' за месяц', '')}
              </div>
            </div>
            <h3 className="text-xs text-muted-foreground mb-1">{stat.title}</h3>
            <p className="text-lg font-bold text-foreground">{stat.value}</p>
          </div>
        );
      })}
    </div>
  );
};