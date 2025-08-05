import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Redirect to auth if not logged in (except for home and auth pages)
  useEffect(() => {
    if (!loading && !user && location.pathname !== '/' && location.pathname !== '/auth') {
      navigate('/auth');
    }
  }, [user, loading, location.pathname, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="glass-card p-8 rounded-3xl text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  // Show layout only for authenticated pages
  if (user && location.pathname !== '/' && location.pathname !== '/auth') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <div className="flex">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Header user={user} />
            <main className="flex-1 p-6">
              {children}
            </main>
            <Footer />
          </div>
        </div>
      </div>
    );
  }

  // Show without layout for home and auth pages
  return <>{children}</>;
};