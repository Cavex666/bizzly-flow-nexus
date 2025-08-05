import { Users, Phone, Mail, MapPin } from 'lucide-react';
import { useClients } from '@/hooks/useClients';
import { useProjects } from '@/hooks/useProjects';
import { Skeleton } from '@/components/ui/skeleton';

interface ClientsListProps {
  onClientSelect: (clientId: string | null) => void;
  selectedClient: string | null;
  searchQuery?: string;
}

export const ClientsList = ({
  onClientSelect,
  selectedClient,
  searchQuery = ''
}: ClientsListProps) => {
  const { clients, loading: clientsLoading } = useClients();
  const { projects } = useProjects();

  const getActiveProjectsCount = (clientId: string) => {
    return projects.filter(p => p.client_id === clientId && (p.status === 'active' || p.status === 'new')).length;
  };

  const filteredClients = clients.filter(client =>
    client.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.contact_person?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (clientsLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="floating-card p-4 rounded-2xl">
            <div className="flex items-start gap-3">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-3 w-36" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
      {filteredClients.map(client => {
        const activeProjectsCount = getActiveProjectsCount(client.id);
        return (
          <div 
            key={client.id} 
            className={`floating-card p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
              selectedClient === client.id 
                ? 'ring-2 ring-primary shadow-glow' 
                : 'hover:shadow-lg'
            }`} 
            onClick={() => onClientSelect(selectedClient === client.id ? null : client.id)}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm mb-1 truncate">{client.company_name}</h4>
                <p className="text-xs text-muted-foreground mb-2">{client.contact_person}</p>
                
                <div className="space-y-1">
                  {client.phone && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone className="w-3 h-3" />
                      <span className="truncate">{client.phone}</span>
                    </div>
                  )}
                  
                  {client.email && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Mail className="w-3 h-3" />
                      <span className="truncate">{client.email}</span>
                    </div>
                  )}
                  
                  {client.country && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{client.country}</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-2 pt-2 border-t border-border">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    activeProjectsCount > 0 
                      ? 'bg-success/10 text-success' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {activeProjectsCount > 0 
                      ? `${activeProjectsCount} активных проектов` 
                      : 'Нет активных проектов'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {filteredClients.length === 0 && !clientsLoading && (
        <div className="text-center py-8 text-muted-foreground">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>{searchQuery ? 'Клиенты не найдены' : 'Нет клиентов'}</p>
        </div>
      )}
    </div>
  );
};