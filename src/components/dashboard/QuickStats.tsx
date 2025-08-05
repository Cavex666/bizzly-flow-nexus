import { FolderOpen, Users, DollarSign, TrendingUp } from 'lucide-react';
import { useStats } from '@/hooks/useStats';
import { Skeleton } from '@/components/ui/skeleton';

export const QuickStats = () => {
  const { stats, loading } = useStats();

  const statsConfig = [
    {
      icon: FolderOpen,
      title: 'Активные проекты',
      value: stats.activeProjects.toString(),
      change: '+2',
      changeType: 'positive' as const
    },
    {
      icon: Users,
      title: 'Клиенты',
      value: stats.totalClients.toString(),
      change: '+1',
      changeType: 'positive' as const
    },
    {
      icon: DollarSign,
      title: 'Общий доход',
      value: `${stats.totalRevenue.toLocaleString()} ${stats.currency}`,
      change: '+15%',
      changeType: 'positive' as const
    },
    {
      icon: TrendingUp,
      title: 'Прибыль',
      value: `${stats.totalProfit.toLocaleString()} ${stats.currency}`,
      change: '+12%',
      changeType: 'positive' as const
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="floating-card p-4 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-3">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="w-5 h-5 rounded-full" />
            </div>
            <Skeleton className="h-3 w-20 mb-1" />
            <Skeleton className="h-6 w-16" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {statsConfig.map((stat, index) => {
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
              <div className="text-xs font-medium text-primary">
                {stat.change}
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