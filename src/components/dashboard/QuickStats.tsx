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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.title}
            className="floating-card p-6 rounded-2xl hover:shadow-glow transition-all duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className={`text-xs px-2 py-1 rounded-full ${
                stat.changeType === 'positive' 
                  ? 'bg-success/10 text-success' 
                  : 'bg-destructive/10 text-destructive'
              }`}>
                {stat.change}
              </div>
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          </div>
        );
      })}
    </div>
  );
};