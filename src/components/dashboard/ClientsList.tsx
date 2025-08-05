import { Users, Phone, Mail, MapPin, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { useClients } from '@/hooks/useClients';
import { useProjects } from '@/hooks/useProjects';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface ClientsListProps {
  onClientSelect: (clientId: string | null) => void;
  selectedClient: string | null;
  searchQuery?: string;
  onClientEdit?: (client: any) => void;
  onClientDelete?: (client: any) => void;
}

export const ClientsList = ({
  onClientSelect,
  selectedClient,
  searchQuery = '',
  onClientEdit,
  onClientDelete
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
          <div key={index} className="bg-card border border-border rounded-lg p-3">
            <div className="flex items-start gap-3">
              <Skeleton className="w-8 h-8 rounded-lg" />
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
            className={`bg-card border border-border rounded-lg p-3 cursor-pointer transition-all duration-300 hover:border-primary/50 h-[140px] flex flex-col ${
              selectedClient === client.id 
                ? 'border-primary bg-primary/5' 
                : ''
            }`} 
            onClick={() => onClientSelect(selectedClient === client.id ? null : client.id)}
          >
            <div className="flex items-start gap-2 flex-1">
              <div className="w-6 h-6 bg-primary/20 rounded-md flex items-center justify-center flex-shrink-0">
                <Users className="w-3 h-3 text-primary" />
              </div>
              
              <div className="flex-1 min-w-0 flex flex-col h-full">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-xs mb-0.5 truncate">{client.company_name}</h4>
                    <p className="text-xs text-muted-foreground">{client.contact_person}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="w-2.5 h-2.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                      {onClientEdit && (
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          onClientEdit(client);
                        }}>
                          <Edit className="w-3 h-3 mr-2" />
                          Редактировать
                        </DropdownMenuItem>
                      )}
                      {onClientDelete && (
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            onClientDelete(client);
                          }}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-3 h-3 mr-2" />
                          Удалить
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="space-y-0.5 mb-1">
                  {client.phone && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone className="w-2.5 h-2.5" />
                      <span className="truncate">{client.phone}</span>
                    </div>
                  )}
                  
                  {client.email && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Mail className="w-2.5 h-2.5" />
                      <span className="truncate">{client.email}</span>
                    </div>
                  )}
                  
                  {client.country && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-2.5 h-2.5" />
                      <span>{client.country}</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-auto">
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
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