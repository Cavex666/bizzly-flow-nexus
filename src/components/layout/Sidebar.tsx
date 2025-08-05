import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, DollarSign, BarChart3, FileText, ChevronLeft, ChevronRight, FolderOpen, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
const menuItems = [{
  to: '/dashboard',
  icon: Home,
  label: 'Дашборд'
}, {
  to: '/projects',
  icon: FolderOpen,
  label: 'Проекты'
}, {
  to: '/clients',
  icon: Users,
  label: 'Клиенты'
}, {
  to: '/finances',
  icon: DollarSign,
  label: 'Финансы'
}, {
  to: '/analytics',
  icon: BarChart3,
  label: 'Аналитика'
}, {
  to: '/documents',
  icon: FileText,
  label: 'Документы'
}];
export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  return <div className={cn("bg-white/90 backdrop-blur-xl border-r border-border/50 shadow-xl transition-all duration-300", collapsed ? "w-16" : "w-64")}>
      <div className="p-4">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-primary rounded-2xl flex items-center justify-center text-white font-bold text-xl bg-slate-950">
            B
          </div>
          {!collapsed && <div className="fade-in">
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-slate-950">
                Bizzly
              </h1>
              <p className="text-xs text-muted-foreground">Управление проектами</p>
            </div>}
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          return <NavLink key={item.to} to={item.to} className={cn("sidebar-item group", isActive && "active")}>
                <Icon className="w-5 h-5 flex-shrink-0 my-0 mx-0 px-0" />
                {!collapsed && <span className="font-medium fade-in">{item.label}</span>}
                
                {/* Active indicator */}
                {isActive && <div className="absolute right-0 w-1 h-8 bg-primary rounded-l-full" />}
              </NavLink>;
        })}
        </nav>

        {/* Collapse Toggle */}
        <button onClick={() => setCollapsed(!collapsed)} className="mt-8 w-full flex items-center justify-center p-2 rounded-xl hover:bg-primary/10 transition-colors">
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </div>;
};