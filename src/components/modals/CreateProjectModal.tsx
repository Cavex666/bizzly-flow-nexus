import { useState, useEffect } from 'react';
import { X, FolderOpen, Calendar, CalendarIcon, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addDays, addBusinessDays, format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';

const currencies = [
  'BYN', 'USD', 'EUR', 'RUB', 'UAH', 'PLN', 'CZK', 'GBP', 'CHF', 'JPY', 'CNY', 'KRW', 'CAD', 'AUD', 'SGD', 'HKD', 'SEK', 'NOK', 'DKK'
];

const projectSchema = z.object({
  shortName: z.string().min(1, 'Краткое название обязательно'),
  basis: z.string().min(1, 'Основание обязательно'),
  startDate: z.date(),
  contractDate: z.date(),
  workDays: z.number().min(1, 'Срок выполнения должен быть больше 0'),
  workDaysType: z.enum(['calendar', 'business']),
  comments: z.string().optional(),
  currency: z.string(),
  vatEnabled: z.boolean(),
  vatRate: z.number().optional(),
  pricingType: z.enum(['total', 'unit']),
  cost: z.number().min(0, 'Стоимость должна быть больше 0'),
  prepayment: z.number().min(0, 'Предоплата не может быть отрицательной').optional(),
  clientId: z.string().min(1, 'Выберите клиента'),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface CreateProjectModalProps {
  onClose: () => void;
  project?: any;
}

interface Client {
  id: string;
  company_name: string;
  contact_person: string;
  email: string;
}

export const CreateProjectModal = ({ onClose, project }: CreateProjectModalProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [clientSearch, setClientSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      shortName: project?.name || project?.short_project_name || '',
      basis: project?.description || '',
      currency: project?.currency || 'BYN',
      vatEnabled: project?.vat_enabled || false,
      vatRate: project?.vat_rate || 20,
      pricingType: project?.payment_model === 'unit' ? 'unit' : 'total',
      workDaysType: project?.work_days_type || 'calendar',
      workDays: project?.work_duration_days || 30,
      cost: project?.budget || 0,
      prepayment: project?.prepayment_amount || 0,
      startDate: project?.start_date ? new Date(project.start_date) : addDays(new Date(), 7),
      contractDate: project?.start_date ? new Date(project.start_date) : addBusinessDays(new Date(), 3),
      clientId: project?.client_id || '',
      comments: project?.description || '',
    },
  });

  const watchStartDate = form.watch('startDate');
  const watchWorkDays = form.watch('workDays');
  const watchWorkDaysType = form.watch('workDaysType');

  useEffect(() => {
    const loadClients = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('clients')
        .select('id, company_name, contact_person, email')
        .eq('user_id', user.id);

      if (error) {
        toast({ title: 'Ошибка', description: 'Не удалось загрузить клиентов' });
        return;
      }

      setClients(data || []);
      setFilteredClients(data || []);
    };

    loadClients();
  }, []);

  useEffect(() => {
    const filtered = clients.filter(client =>
      client.company_name?.toLowerCase().includes(clientSearch.toLowerCase()) ||
      client.contact_person?.toLowerCase().includes(clientSearch.toLowerCase())
    );
    setFilteredClients(filtered);
  }, [clientSearch, clients]);

  useEffect(() => {
    if (watchStartDate) {
      const contractDate = addBusinessDays(watchStartDate, -3);
      form.setValue('contractDate', contractDate);
    }
  }, [watchStartDate, form]);

  const calculateEndDate = () => {
    if (!watchStartDate || !watchWorkDays) return null;
    
    if (watchWorkDaysType === 'business') {
      return addBusinessDays(watchStartDate, watchWorkDays);
    } else {
      return addDays(watchStartDate, watchWorkDays);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: 'Ошибка', description: 'Пользователь не авторизован' });
        return;
      }

      const endDate = calculateEndDate();
      const selectedClientData = clients.find(c => c.id === data.clientId);

      let error;

      if (project) {
        // Update existing project
        const updateResult = await supabase
          .from('projects')
          .update({
            name: data.shortName,
            short_project_name: data.shortName,
            client_id: data.clientId,
            client_name: selectedClientData?.company_name,
            client_contact_person: selectedClientData?.contact_person,
            start_date: data.startDate.toISOString().split('T')[0],
            end_date: endDate?.toISOString().split('T')[0],
            work_duration_days: data.workDays,
            work_days_type: data.workDaysType,
            budget: data.cost,
            currency: data.currency,
            vat_enabled: data.vatEnabled,
            vat_rate: data.vatEnabled ? data.vatRate : null,
            prepayment_amount: data.prepayment,
            payment_model: data.pricingType === 'total' ? 'fixed' : 'unit',
            description: data.comments,
          })
          .eq('id', project.id);
        
        error = updateResult.error;
      } else {
        // Create new project
        const insertResult = await supabase.from('projects').insert({
          name: data.shortName,
          short_project_name: data.shortName,
          client_id: data.clientId,
          client_name: selectedClientData?.company_name,
          client_contact_person: selectedClientData?.contact_person,
          start_date: data.startDate.toISOString().split('T')[0],
          end_date: endDate?.toISOString().split('T')[0],
          work_duration_days: data.workDays,
          work_days_type: data.workDaysType,
          budget: data.cost,
          currency: data.currency,
          vat_enabled: data.vatEnabled,
          vat_rate: data.vatEnabled ? data.vatRate : null,
          prepayment_amount: data.prepayment,
          payment_model: data.pricingType === 'total' ? 'fixed' : 'unit',
          description: data.comments,
          user_id: user.id,
          status: 'new'
        });
        
        error = insertResult.error;
      }

      if (error) {
        toast({ 
          title: 'Ошибка', 
          description: project ? 'Не удалось обновить проект' : 'Не удалось создать проект' 
        });
        return;
      }

      toast({ 
        title: 'Успех', 
        description: project ? 'Проект успешно обновлен' : 'Проект успешно создан' 
      });
      onClose();
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Произошла ошибка при создании проекта' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const endDate = calculateEndDate();

  return (
    <div className="modal-overlay fade-in" onClick={handleOverlayClick}>
      <div className="modal-content slide-up max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar">{/* Add custom scrollbar */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-bold">{project ? 'Редактировать проект' : 'Создать проект'}</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-primary/10">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6">
            <Tabs defaultValue="project" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="project" className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4" />
                  Проект
                </TabsTrigger>
                <TabsTrigger value="client" className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Клиент
                </TabsTrigger>
                <TabsTrigger value="finance" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Финансы
                </TabsTrigger>
              </TabsList>

              <TabsContent value="project" className="space-y-4">
                <FormField
                  control={form.control}
                  name="shortName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Краткое название проекта</FormLabel>
                      <FormControl>
                        <Input placeholder="Склад 500 тн" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="basis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Основание для выполнения проекта</FormLabel>
                      <FormControl>
                        <Input placeholder="согласно комплекту/шифру/заданию" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Дата начала</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "dd.MM.yyyy")
                                ) : (
                                  <span>Выберите дату</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contractDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Дата договора</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "dd.MM.yyyy")
                                ) : (
                                  <span>Выберите дату</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="workDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Срок выполнения (дни)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="workDaysType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Тип дней</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="calendar">Календарные</SelectItem>
                            <SelectItem value="business">Рабочие</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col">
                    <Label className="text-sm font-medium mb-2">Дата окончания</Label>
                    <div className="h-10 px-3 py-2 bg-muted rounded-md flex items-center text-sm">
                      {endDate ? format(endDate, "dd.MM.yyyy") : "Не определена"}
                    </div>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="comments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Комментарии к проекту</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Дополнительная информация о проекте"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="client" className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Поиск клиента</Label>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Поиск по названию организации или контактному лицу"
                      value={clientSearch}
                      onChange={(e) => setClientSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Выберите клиента</FormLabel>
                      <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
                        {filteredClients.map((client) => (
                          <div
                            key={client.id}
                            className={cn(
                              "p-4 border rounded-lg cursor-pointer transition-colors",
                              field.value === client.id
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            )}
                            onClick={() => {
                              field.onChange(client.id);
                              setSelectedClient(client.id);
                            }}
                          >
                            <div className="font-medium">{client.company_name}</div>
                            <div className="text-sm text-muted-foreground">{client.contact_person}</div>
                            <div className="text-sm text-muted-foreground">{client.email}</div>
                          </div>
                        ))}
                        {filteredClients.length === 0 && (
                          <div className="text-center text-muted-foreground py-8">
                            Клиенты не найдены
                          </div>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="finance" className="space-y-4">
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Валюта договора</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency} value={currency}>
                              {currency}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="vatEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">НДС</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Включить НДС в стоимость проекта
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form.watch('vatEnabled') && (
                    <FormField
                      control={form.control}
                      name="vatRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ставка НДС (%)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="pricingType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Ценообразование</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="total" id="total" />
                            <Label htmlFor="total">Общая стоимость</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="unit" id="unit" />
                            <Label htmlFor="unit">Стоимость за единицу</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="cost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {form.watch('pricingType') === 'total' ? 'Общая стоимость' : 'Стоимость за единицу'}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="prepayment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Предоплата</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-border">
              <Button type="button" variant="outline" onClick={onClose}>
                Отмена
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting 
                  ? (project ? 'Сохранение...' : 'Создание...')
                  : (project ? 'Сохранить изменения' : 'Создать проект')
                }
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};