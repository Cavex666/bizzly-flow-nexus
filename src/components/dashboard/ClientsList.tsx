import { Users, Phone, Mail, MapPin } from 'lucide-react';
interface ClientsListProps {
  onClientSelect: (clientId: string | null) => void;
  selectedClient: string | null;
}
export const ClientsList = ({
  onClientSelect,
  selectedClient
}: ClientsListProps) => {
  // Mock clients data
  const clients = [{
    id: '1',
    name: 'ООО "Логистика Плюс"',
    contactPerson: 'Иванов Иван Иванович',
    phone: '+375 (29) 123-45-67',
    email: 'ivanov@logistics.by',
    country: 'Беларусь',
    activeProjects: 2
  }, {
    id: '2',
    name: 'ЗАО "СтройИнвест"',
    contactPerson: 'Петров Петр Петрович',
    phone: '+375 (33) 987-65-43',
    email: 'petrov@stroyinvest.by',
    country: 'Беларусь',
    activeProjects: 1
  }, {
    id: '3',
    name: 'ООО "РетейлДев"',
    contactPerson: 'Сидорова Анна Сергеевна',
    phone: '+375 (25) 555-33-22',
    email: 'sidorova@retaildev.by',
    country: 'Беларусь',
    activeProjects: 0
  }];
  return <div className="space-y-3">
      {clients.map(client => <div key={client.id} className={`floating-card p-4 rounded-2xl cursor-pointer transition-all duration-300 ${selectedClient === client.id ? 'ring-2 ring-primary shadow-glow' : 'hover:shadow-lg'}`} onClick={() => onClientSelect(selectedClient === client.id ? null : client.id)}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-secondary rounded-xl flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm mb-1 truncate">{client.name}</h4>
              <p className="text-xs text-muted-foreground mb-2">{client.contactPerson}</p>
              
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Phone className="w-3 h-3" />
                  <span className="truncate">{client.phone}</span>
                </div>
                
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Mail className="w-3 h-3" />
                  <span className="truncate">{client.email}</span>
                </div>
                
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span>{client.country}</span>
                </div>
              </div>
              
              <div className="mt-2 pt-2 border-t border-border">
                <span className={`text-xs px-2 py-1 rounded-full ${client.activeProjects > 0 ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                  {client.activeProjects > 0 ? `${client.activeProjects} активных проектов` : 'Нет активных проектов'}
                </span>
              </div>
            </div>
          </div>
        </div>)}

      {clients.length === 0 && <div className="text-center py-8 text-muted-foreground">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Нет клиентов</p>
        </div>}
    </div>;
};