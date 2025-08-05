import React, { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Header } from './Header';
import { CreateProjectModal } from '../modals/CreateProjectModal';
import { CreateClientModal } from '../modals/CreateClientModal';
import { DashboardProvider } from '../../contexts/DashboardContext';

interface DashboardLayoutProps {
  user: User;
  children: React.ReactNode;
}

export const DashboardLayout = ({ user, children }: DashboardLayoutProps) => {
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showCreateClient, setShowCreateClient] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [editingClient, setEditingClient] = useState<any>(null);

  // Function to handle project editing from children
  const handleProjectEdit = (project: any) => {
    setEditingProject(project);
    setShowCreateProject(true);
  };

  // Function to handle client editing from children
  const handleClientEdit = (client: any) => {
    setEditingClient(client);
    setShowCreateClient(true);
  };

  const closeProjectModal = () => {
    setShowCreateProject(false);
    setEditingProject(null);
  };

  const closeClientModal = () => {
    setShowCreateClient(false);
    setEditingClient(null);
  };

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
      <DashboardProvider
        onProjectEdit={handleProjectEdit}
        onClientEdit={handleClientEdit}
      >
        <main className="flex-1 p-6 pb-20 pt-24">
          {children}
        </main>
      </DashboardProvider>

      {/* Modals */}
      {showCreateProject && (
        <CreateProjectModal 
          onClose={closeProjectModal}
          project={editingProject}
        />
      )}
      
      {showCreateClient && (
        <CreateClientModal 
          onClose={closeClientModal}
          client={editingClient}
        />
      )}
    </>
  );
};