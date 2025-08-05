import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { X, Save, Upload, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const profileSchema = z.object({
  displayName: z.string().optional(),
  phone: z.string().optional(),
  currency: z.string().min(1, 'Выберите валюту'),
});

const companySchema = z.object({
  companyName: z.string().optional(),
  contactPerson: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  country: z.string().optional(),
  bankDetails: z.string().optional(),
  contactPersonPosition: z.string().optional(),
  contactPersonAuthorities: z.string().optional(),
  contactPersonName: z.string().optional(),
  contactPersonNameGenitive: z.string().optional(),
});

interface AccountSettingsModalProps {
  user: User;
  onClose: () => void;
}

export const AccountSettingsModal = ({
  user,
  onClose
}: AccountSettingsModalProps) => {
  const [activeTab, setActiveTab] = useState('account');
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingCompany, setIsLoadingCompany] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingCompany, setIsSavingCompany] = useState(false);

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: '',
      phone: '',
      currency: 'BYN',
    },
  });

  const companyForm = useForm({
    resolver: zodResolver(companySchema),
    defaultValues: {
      companyName: '',
      contactPerson: '',
      phone: '',
      email: '',
      country: 'Беларусь',
      bankDetails: '',
      contactPersonPosition: 'Директор',
      contactPersonAuthorities: '',
      contactPersonName: '',
      contactPersonNameGenitive: '',
    },
  });

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        toast({ title: 'Ошибка', description: 'Не удалось загрузить профиль' });
        return;
      }

      if (data) {
        profileForm.reset({
          displayName: data.display_name || '',
          phone: data.phone || '',
          currency: (data as any).currency || 'BYN',
        });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Произошла ошибка при загрузке профиля' });
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const loadCompanySettings = async () => {
    try {
      const { data, error } = await supabase
        .from('company_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        toast({ title: 'Ошибка', description: 'Не удалось загрузить настройки организации' });
        return;
      }

      if (data) {
        companyForm.reset({
          companyName: data.company_name || '',
          contactPerson: data.contact_person || '',
          phone: data.phone || '',
          email: data.email || '',
          country: data.country || 'Беларусь',
          bankDetails: data.bank_details || '',
          contactPersonPosition: data.contact_person_position || 'Директор',
          contactPersonAuthorities: data.contact_person_authorities || '',
          contactPersonName: data.contact_person_name || '',
          contactPersonNameGenitive: data.contact_person_name_genitive || '',
        });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Произошла ошибка при загрузке настроек организации' });
    } finally {
      setIsLoadingCompany(false);
    }
  };

  useEffect(() => {
    loadProfile();
    loadCompanySettings();
  }, [user.id]);

  const handleProfileSave = async (data: any) => {
    setIsSavingProfile(true);
    try {
      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      let result;
      if (existingProfile) {
        // Update existing profile
        result = await supabase
          .from('profiles')
          .update({
            display_name: data.displayName,
            phone: data.phone,
            currency: data.currency,
          })
          .eq('user_id', user.id);
      } else {
        // Insert new profile
        result = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            display_name: data.displayName,
            phone: data.phone,
            currency: data.currency,
          });
      }

      if (result.error) {
        console.error('Profile save error:', result.error);
        toast({ title: 'Ошибка', description: 'Не удалось сохранить профиль' });
        return;
      }

      toast({ title: 'Успех', description: 'Профиль успешно сохранен' });
    } catch (error) {
      console.error('Profile save exception:', error);
      toast({ title: 'Ошибка', description: 'Произошла ошибка при сохранении профиля' });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleCompanySave = async (data: any) => {
    setIsSavingCompany(true);
    try {
      // Check if company settings already exist
      const { data: existingData } = await supabase
        .from('company_settings')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      let result;
      if (existingData) {
        // Update existing record
        result = await supabase
          .from('company_settings')
          .update({
            company_name: data.companyName,
            contact_person: data.contactPerson,
            phone: data.phone,
            email: data.email,
            country: data.country,
            bank_details: data.bankDetails,
            contact_person_position: data.contactPersonPosition,
            contact_person_authorities: data.contactPersonAuthorities,
            contact_person_name: data.contactPersonName,
            contact_person_name_genitive: data.contactPersonNameGenitive,
          })
          .eq('user_id', user.id);
      } else {
        // Insert new record
        result = await supabase
          .from('company_settings')
          .insert({
            user_id: user.id,
            company_name: data.companyName,
            contact_person: data.contactPerson,
            phone: data.phone,
            email: data.email,
            country: data.country,
            bank_details: data.bankDetails,
            contact_person_position: data.contactPersonPosition,
            contact_person_authorities: data.contactPersonAuthorities,
            contact_person_name: data.contactPersonName,
            contact_person_name_genitive: data.contactPersonNameGenitive,
          });
      }

      if (result.error) {
        toast({ title: 'Ошибка', description: 'Не удалось сохранить настройки организации' });
        return;
      }

      toast({ title: 'Успех', description: 'Настройки организации успешно сохранены' });
    } catch (error) {
      console.error('Company save exception:', error);
      toast({ title: 'Ошибка', description: 'Произошла ошибка при сохранении настроек организации' });
    } finally {
      setIsSavingCompany(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="modal-overlay fade-in" onClick={handleOverlayClick}>
      <div className="modal-content slide-up w-full max-w-3xl h-auto min-h-[500px] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-bold">Настройки аккаунта</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-primary/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="account">Профиль</TabsTrigger>
              <TabsTrigger value="company">Организация</TabsTrigger>
            </TabsList>

            <TabsContent value="account" className="space-y-6 mt-6 min-h-[400px]">
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(handleProfileSave)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Электронная почта</Label>
                      <Input value={user.email || ''} disabled className="bg-muted" />
                      <p className="text-sm text-muted-foreground">Email нельзя изменить</p>
                    </div>
                    
                    <FormField
                      control={profileForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Номер телефона</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="+375 (XX) XXX-XX-XX" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                     <FormField
                       control={profileForm.control}
                       name="displayName"
                       render={({ field }) => (
                         <FormItem>
                           <FormLabel>Отображаемое имя</FormLabel>
                           <FormControl>
                             <Input {...field} placeholder="Иван Иванов" />
                           </FormControl>
                           <FormMessage />
                         </FormItem>
                       )}
                     />

                     <FormField
                       control={profileForm.control}
                       name="currency"
                       render={({ field }) => (
                         <FormItem>
                           <FormLabel>Валюта по умолчанию</FormLabel>
                           <FormControl>
                             <Select onValueChange={field.onChange} value={field.value}>
                               <SelectTrigger>
                                 <SelectValue placeholder="Выберите валюту" />
                               </SelectTrigger>
                               <SelectContent>
                                 <SelectItem value="BYN">BYN</SelectItem>
                                 <SelectItem value="USD">USD</SelectItem>
                                 <SelectItem value="EUR">EUR</SelectItem>
                                 <SelectItem value="RUB">RUB</SelectItem>
                                 <SelectItem value="UAH">UAH</SelectItem>
                                 <SelectItem value="PLN">PLN</SelectItem>
                               </SelectContent>
                             </Select>
                           </FormControl>
                           <FormMessage />
                         </FormItem>
                       )}
                     />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <Button type="submit" disabled={isSavingProfile || isLoadingProfile}>
                      <Save className="w-4 h-4 mr-2" />
                      {isSavingProfile ? 'Сохранение...' : 'Сохранить профиль'}
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="company" className="space-y-6 mt-6 min-h-[400px]">
              <Form {...companyForm}>
                <form onSubmit={companyForm.handleSubmit(handleCompanySave)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <FormField
                      control={companyForm.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Наименование организации</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder='ООО "Биззли Бай"' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={companyForm.control}
                      name="contactPerson"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Контактное лицо</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Иван Иванов" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={companyForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Номер телефона</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="+375 (XX) XXX-XX-XX" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={companyForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" placeholder="info@company.com" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={companyForm.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Страна</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите страну" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Беларусь">Беларусь</SelectItem>
                                <SelectItem value="Россия">Россия</SelectItem>
                                <SelectItem value="Украина">Украина</SelectItem>
                                <SelectItem value="Казахстан">Казахстан</SelectItem>
                                <SelectItem value="Польша">Польша</SelectItem>
                                <SelectItem value="Литва">Литва</SelectItem>
                                <SelectItem value="Латвия">Латвия</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={companyForm.control}
                      name="contactPersonPosition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Должность ответственного лица</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Директор" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={companyForm.control}
                      name="bankDetails"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Реквизиты</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Банковские реквизиты организации" className="resize-none" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={companyForm.control}
                      name="contactPersonAuthorities"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Полномочия ответственного лица</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="на основании устава / свидетельства" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={companyForm.control}
                      name="contactPersonName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ФИО ответственного лица (И.п.)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Иванов Иван Иванович" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={companyForm.control}
                      name="contactPersonNameGenitive"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ФИО ответственного лица (Р.п.)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Иванова Ивана Ивановича" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <Button type="submit" disabled={isSavingCompany || isLoadingCompany}>
                      <Save className="w-4 h-4 mr-2" />
                      {isSavingCompany ? 'Сохранение...' : 'Сохранить настройки организации'}
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};