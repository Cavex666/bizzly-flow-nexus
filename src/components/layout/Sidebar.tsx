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
interface SidebarProps {
  onCollapsedChange?: (collapsed: boolean) => void;
}

export const Sidebar = ({ onCollapsedChange }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const handleToggleCollapse = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    onCollapsedChange?.(newCollapsed);
  };
  return <div className={cn("bg-white/90 backdrop-blur-xl border-r border-border/50 shadow-xl transition-all duration-300 h-screen overflow-hidden flex flex-col", collapsed ? "w-16" : "w-64")}>
      <div className={cn("p-4 flex-1", collapsed && "px-2")}>
        {/* Logo */}
        <div className={cn("flex items-center gap-3 mb-8", collapsed && "justify-center")}>
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
          return <NavLink 
            key={item.to} 
            to={item.to} 
            className={cn(
              "sidebar-item group relative flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200",
              collapsed && "justify-center px-2",
              isActive 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
                <Icon className={cn("w-5 h-5 flex-shrink-0", collapsed && "mx-auto")} />
                {!collapsed && <span className="font-medium fade-in">{item.label}</span>}
                
                {/* Active indicator */}
                {isActive && !collapsed && <div className="absolute right-2 w-2 h-2 bg-primary rounded-full" />}
                {isActive && collapsed && <div className="absolute right-1 w-1 h-6 bg-primary rounded-l-full" />}
              </NavLink>;
        })}
        </nav>
      </div>

      {/* Collapse Toggle - moved up to avoid footer overlap */}
      <div className="p-4 mt-auto pb-20">
        <button 
          onClick={handleToggleCollapse} 
          className={cn(
            "flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-primary/10 transition-all duration-200 w-full justify-center",
            collapsed && "justify-center"
          )}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="font-medium">Свернуть</span>
            </>
          )}
        </button>
      </div>
    </div>;
};