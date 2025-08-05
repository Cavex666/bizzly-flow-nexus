import { useState, useRef, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { Bell, Settings, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { AccountSettingsModal } from '../modals/AccountSettingsModal';
interface HeaderProps {
  user: User;
}
export const Header = ({
  user
}: HeaderProps) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };
  return <>
      <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-b border-border/50 shadow-sm px-6 py-4 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 ml-64">
            <h2 className="text-2xl font-bold text-slate-950">
              Добро пожаловать в Bizzly
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 rounded-xl transition-colors bg-slate-950 hover:bg-slate-800">
              <Bell className="w-5 h-5 text-muted-foreground bg-slate-800" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full"></div>
            </button>

            {/* User Menu */}
            <div className="relative" ref={menuRef}>
              <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-3 p-2 rounded-xl hover:bg-primary/10 transition-colors">
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white text-sm font-semibold bg-slate-950">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">
                    {user.email}
                  </p>
                  <p className="text-xs text-muted-foreground">Администратор</p>
                </div>
              </button>

              {/* User Dropdown */}
              {showUserMenu && <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-border/50 p-2 z-[60] fade-in">
                  <button onClick={() => {
                setShowSettings(true);
                setShowUserMenu(false);
              }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 transition-colors text-left">
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">Настройки аккаунта</span>
                  </button>
                  <hr className="my-2 border-border" />
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-destructive/10 text-destructive transition-colors text-left">
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Выйти</span>
                  </button>
                </div>}
            </div>
          </div>
        </div>
      </header>

      {/* Account Settings Modal */}
      {showSettings && <AccountSettingsModal user={user} onClose={() => setShowSettings(false)} />}
    </>;
};