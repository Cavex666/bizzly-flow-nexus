import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Users, BarChart, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const HomePage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);

  const features = [
    {
      icon: Users,
      title: 'Управление проектами',
      description: 'Комплексное управление проектами с календарным планированием и отслеживанием прогресса'
    },
    {
      icon: BarChart,
      title: 'Финансовая аналитика',
      description: 'Детальная аналитика доходов, расходов и рентабельности ваших проектов'
    },
    {
      icon: Shield,
      title: 'Безопасность данных',
      description: 'Надёжная защита ваших данных с шифрованием и регулярными резервными копиями'
    },
    {
      icon: Zap,
      title: 'Автоматизация',
      description: 'Автоматическое создание документов, отчётов и уведомлений'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 opacity-50"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Logo */}
          <div className="mb-8 fade-in">
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-primary rounded-3xl flex items-center justify-center text-white font-bold text-3xl shadow-2xl">
                B
              </div>
              <h1 className="text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Bizzly
              </h1>
            </div>
            <p className="text-xl text-muted-foreground mb-2">
              Профессиональная система управления проектами и финансами
            </p>
          </div>

          {/* Main Heading */}
          <div className="mb-12 slide-up">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Управляйте бизнесом
              <br />
              <span className="bg-gradient-secondary bg-clip-text text-transparent">
                эффективно
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Объедините управление проектами, финансами и клиентами в одной современной платформе. 
              Автоматизируйте рутинные задачи и сосредоточьтесь на развитии бизнеса.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 scale-in">
            <Button 
              onClick={() => navigate('/auth')}
              className="material-button text-lg px-8 py-4 h-auto"
            >
              Начать бесплатно
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline"
              className="text-lg px-8 py-4 h-auto border-2 hover:shadow-glow"
            >
              Демо-версия
            </Button>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground fade-in">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span>Без скрытых платежей</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span>30 дней бесплатно</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span>Техподдержка 24/7</span>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-secondary/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-accent/20 rounded-full blur-xl animate-pulse delay-500"></div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 fade-in">
            <h3 className="text-4xl font-bold mb-4">
              Всё необходимое для успешного бизнеса
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Мощные инструменты для управления проектами, финансами и клиентами в одном месте
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={feature.title}
                  className="floating-card p-6 rounded-3xl text-center group"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-glow transition-all duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold mb-6">
            Готовы начать?
          </h3>
          <p className="text-xl text-muted-foreground mb-8">
            Присоединяйтесь к тысячам компаний, которые уже используют Bizzly для роста своего бизнеса
          </p>
          <Button 
            onClick={() => navigate('/auth')}
            className="material-button text-lg px-8 py-4 h-auto"
          >
            Создать аккаунт бесплатно
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};