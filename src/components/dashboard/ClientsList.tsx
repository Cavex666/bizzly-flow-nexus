import { useState } from 'react';
import { Users, Phone, Mail, MapPin, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ClientsListProps {
  onClientSelect: (clientId: string | null) => void;
  selectedClient: string | null;
}

export const ClientsList = ({ onClientSelect, selectedClient }: ClientsListProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock clients data
  const clients = [
    {
      id: '1',
      name: 'ООО "Логистика Плюс"',
      contactPerson: 'Иванов Иван Иванович',
      phone: '+375 (29) 123-45-67',
      email: 'ivanov@logistics.by',
      country: 'Беларусь',
      activeProjects: 2
    },
    {
      id: '2',
      name: 'ЗАО "СтройИнвест"',
      contactPerson: 'Петров Петр Петрович',
      phone: '+375 (33) 987-65-43',
      email: 'petrov@stroyinvest.by',
      country: 'Беларусь',
      activeProjects: 1
    },
    {
      id: '3',
      name: 'ООО "РетейлДев"',
      contactPerson: 'Сидорова Анна Сергеевна',
      phone: '+375 (25) 555-33-22',
      email: 'sidorova@retaildev.by',
      country: 'Беларусь',
      activeProjects: 0
    }
  ];

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-3">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Поиск по названию или контактному лицу..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Clients List with Scroll */}
      <ScrollArea className="flex-1">
        <div className="space-y-3 pr-4">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className={`floating-card p-3 rounded-2xl cursor-pointer transition-all duration-300 ${
                selectedClient === client.id 
                  ? 'ring-2 ring-primary shadow-glow' 
                  : 'hover:shadow-lg'
              }`}
              onClick={() => onClientSelect(selectedClient === client.id ? null : client.id)}
            >
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 bg-gradient-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-xs mb-1 truncate">{client.name}</h4>
                  <p className="text-xs text-muted-foreground mb-1">{client.contactPerson}</p>
                  
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone className="w-3 h-3" />
                      <span className="truncate">{client.phone}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Mail className="w-3 h-3" />
                      <span className="truncate">{client.email}</span>
                    </div>
                  </div>
                  
                  <div className="mt-1.5 pt-1.5 border-t border-border">
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      client.activeProjects > 0 
                        ? 'bg-success/10 text-success' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {client.activeProjects > 0 
                        ? `${client.activeProjects} проектов` 
                        : 'Нет проектов'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredClients.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Клиенты не найдены</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};