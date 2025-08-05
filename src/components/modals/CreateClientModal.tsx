import { useState } from 'react';
import { X, Users, Phone, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const countryCodes = [
  { code: '+375', name: 'Беларусь', country: 'Беларусь' },
  { code: '+7', name: 'Россия', country: 'Россия' },
  { code: '+380', name: 'Украина', country: 'Украина' },
  { code: '+1', name: 'США', country: 'США' },
  { code: '+44', name: 'Великобритания', country: 'Великобритания' },
  { code: '+49', name: 'Германия', country: 'Германия' },
  { code: '+33', name: 'Франция', country: 'Франция' },
  { code: '+48', name: 'Польша', country: 'Польша' },
  { code: '+420', name: 'Чехия', country: 'Чехия' },
  { code: '+370', name: 'Литва', country: 'Литва' },
  { code: '+371', name: 'Латвия', country: 'Латвия' },
  { code: '+372', name: 'Эстония', country: 'Эстония' },
];

const clientSchema = z.object({
  companyName: z.string().min(1, 'Наименование организации обязательно'),
  contactPerson: z.string().min(1, 'Контактное лицо обязательно'),
  phoneCountryCode: z.string().min(1, 'Выберите код страны'),
  phoneNumber: z.string().min(1, 'Номер телефона обязателен'),
  email: z.string().email('Некорректный адрес электронной почты'),
  country: z.string().min(1, 'Страна обязательна'),
  bankDetails: z.string().optional(),
  contactPersonPosition: z.string().min(1, 'Должность обязательна'),
  contactPersonAuthorities: z.string().min(1, 'Полномочия обязательны'),
  contactPersonName: z.string().min(1, 'ФИО в именительном падеже обязательно'),
  contactPersonNameGenitive: z.string().min(1, 'ФИО в родительном падеже обязательно'),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface CreateClientModalProps {
  onClose: () => void;
  client?: any;
}

export const CreateClientModal = ({ onClose, client }: CreateClientModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      companyName: client?.company_name || '',
      contactPerson: client?.contact_person || '',
      phoneCountryCode: client?.phone ? client.phone.split(/\d/)[0] || '+375' : '+375',
      phoneNumber: client?.phone ? client.phone.replace(/^\+\d+/, '') : '',
      email: client?.email || '',
      country: client?.country || 'Беларусь',
      bankDetails: client?.bank_details || '',
      contactPersonPosition: client?.contact_person_position || '',
      contactPersonAuthorities: client?.contact_person_authorities || '',
      contactPersonName: client?.contact_person_name || '',
      contactPersonNameGenitive: client?.contact_person_name_genitive || '',
    },
  });

  const watchPhoneCountryCode = form.watch('phoneCountryCode');

  // Автоматически обновляем страну при изменении кода телефона
  const handlePhoneCountryCodeChange = (value: string) => {
    form.setValue('phoneCountryCode', value);
    const countryData = countryCodes.find(c => c.code === value);
    if (countryData) {
      form.setValue('country', countryData.country);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const onSubmit = async (data: ClientFormData) => {
    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: 'Ошибка', description: 'Пользователь не авторизован' });
        return;
      }

      const fullPhoneNumber = `${data.phoneCountryCode}${data.phoneNumber}`;

      if (client) {
        // Update existing client
        const { error } = await supabase
          .from('clients')
          .update({
            company_name: data.companyName,
            contact_person: data.contactPerson,
            phone: fullPhoneNumber,
            email: data.email,
            country: data.country,
            bank_details: data.bankDetails,
            contact_person_position: data.contactPersonPosition,
            contact_person_authorities: data.contactPersonAuthorities,
            contact_person_name: data.contactPersonName,
            contact_person_name_genitive: data.contactPersonNameGenitive,
          })
          .eq('id', client.id);

        if (error) {
          toast({ title: 'Ошибка', description: 'Не удалось обновить клиента' });
          return;
        }

        toast({ title: 'Успех', description: 'Клиент успешно обновлен' });
      } else {
        // Create new client
        const { error } = await supabase.from('clients').insert({
          company_name: data.companyName,
          contact_person: data.contactPerson,
          phone: fullPhoneNumber,
          email: data.email,
          country: data.country,
          bank_details: data.bankDetails,
          contact_person_position: data.contactPersonPosition,
          contact_person_authorities: data.contactPersonAuthorities,
          contact_person_name: data.contactPersonName,
          contact_person_name_genitive: data.contactPersonNameGenitive,
          user_id: user.id,
        });

        if (error) {
          toast({ title: 'Ошибка', description: 'Не удалось создать клиента' });
          return;
        }

        toast({ title: 'Успех', description: 'Клиент успешно создан' });
      }
      onClose();
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Произошла ошибка при создании клиента' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay fade-in" onClick={handleOverlayClick}>
      <div className="modal-content slide-up max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">{client ? 'Редактировать клиента' : 'Добавить клиента'}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-primary/10">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Основная информация */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                Основная информация
              </h3>
              
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Наименование организации</FormLabel>
                    <FormControl>
                      <Input placeholder='ООО "Биззли Бай"' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Контактное лицо</FormLabel>
                    <FormControl>
                      <Input placeholder="Иванов Иван Иванович" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="phoneCountryCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Код страны</FormLabel>
                      <Select onValueChange={handlePhoneCountryCodeChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countryCodes.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.code} {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Номер телефона</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md text-sm text-muted-foreground">
                            <Phone className="w-4 h-4 mr-1" />
                            {watchPhoneCountryCode}
                          </div>
                          <Input
                            placeholder="29 123 45 67"
                            className="rounded-l-none"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          type="email"
                          placeholder="info@company.com"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Страна</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly className="bg-muted" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bankDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Реквизиты</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Банковские реквизиты организации"
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Информация об ответственном лице */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                Ответственное лицо
              </h3>

              <FormField
                control={form.control}
                name="contactPersonPosition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Должность ответственного лица</FormLabel>
                    <FormControl>
                      <Input placeholder="Директор" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactPersonAuthorities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Полномочия ответственного лица (в предложном падеже)</FormLabel>
                    <FormControl>
                      <Input placeholder="на основании свидетельства/устава" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactPersonName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ФИО ответственного лица (именительный падеж)</FormLabel>
                    <FormControl>
                      <Input placeholder="Иванов Иван Иванович" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactPersonNameGenitive"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ФИО ответственного лица (родительный падеж)</FormLabel>
                    <FormControl>
                      <Input placeholder="Иванова Ивана Ивановича" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-border">
              <Button type="button" variant="outline" onClick={onClose}>
                Отмена
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (client ? 'Сохранение...' : 'Создание...') : (client ? 'Сохранить изменения' : 'Создать клиента')}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};