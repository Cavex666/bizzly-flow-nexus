import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Header } from './Header';
import { CreateProjectModal } from '../modals/CreateProjectModal';
import { CreateClientModal } from '../modals/CreateClientModal';

interface DashboardLayoutProps {
  user: User;
  children: React.ReactNode;
}

export const DashboardLayout = ({ user, children }: DashboardLayoutProps) => {
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showCreateClient, setShowCreateClient] = useState(false);

  return (
    <>
      <Header 
        user={user}
        onCreateProject={() => setShowCreateProject(true)}
        onCreateClient={() => setShowCreateClient(true)}
        onCreatePayment={() => {
          // TODO: Implement payment creation
          console.log('Create payment clicked');
        }}
      />
      <main className="flex-1 p-6 pb-20 pt-24">
        {children}
      </main>

      {/* Modals */}
      {showCreateProject && (
        <CreateProjectModal onClose={() => setShowCreateProject(false)} />
      )}
      
      {showCreateClient && (
        <CreateClientModal onClose={() => setShowCreateClient(false)} />
      )}
    </>
  );
};