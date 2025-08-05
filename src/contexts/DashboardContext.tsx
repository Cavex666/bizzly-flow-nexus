import React, { createContext, useContext, useState } from 'react';

interface DashboardContextType {
  handleProjectEdit: (project: any) => void;
  handleClientEdit: (client: any) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

interface DashboardProviderProps {
  children: React.ReactNode;
  onProjectEdit: (project: any) => void;
  onClientEdit: (client: any) => void;
}

export const DashboardProvider = ({ children, onProjectEdit, onClientEdit }: DashboardProviderProps) => {
  const value = {
    handleProjectEdit: onProjectEdit,
    handleClientEdit: onClientEdit,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};