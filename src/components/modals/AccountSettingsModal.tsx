import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { X, Save, Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
interface AccountSettingsModalProps {
  user: User;
  onClose: () => void;
}
export const AccountSettingsModal = ({
  user,
  onClose
}: AccountSettingsModalProps) => {
  const [activeTab, setActiveTab] = useState('account');
  return <div className="modal-overlay fade-in">
      <div className="modal-content slide-up max-w-4xl">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-bold">Настройки аккаунта</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-primary/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="account">Аккаунт</TabsTrigger>
              <TabsTrigger value="company">Организация</TabsTrigger>
              <TabsTrigger value="templates">Шаблоны</TabsTrigger>
            </TabsList>

            <TabsContent value="account" className="space-y-6 mt-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Электронная почта</Label>
                  <Input id="email" type="email" defaultValue={user.email} className="material-input" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Номер телефона</Label>
                  <Input id="phone" type="tel" placeholder="+375 (XX) XXX-XX-XX" className="material-input" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Валюта по умолчанию</Label>
                  <select className="material-input w-full">
                    <option value="BYN">BYN - Белорусский рубль</option>
                    <option value="USD">USD - Доллар США</option>
                    <option value="EUR">EUR - Евро</option>
                    <option value="RUB">RUB - Российский рубль</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region">Регион по умолчанию</Label>
                  <select className="material-input w-full">
                    <option value="BY">Беларусь</option>
                    <option value="RU">Россия</option>
                    <option value="UA">Украина</option>
                    <option value="PL">Польша</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button className="material-button">
                  <Save className="w-4 h-4 mr-2" />
                  Сохранить изменения
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="company" className="space-y-6 mt-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Наименование организации</Label>
                  <Input id="companyName" placeholder="ООО &quot;Биззли Бай&quot;" className="material-input" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Контактное лицо</Label>
                  <Input id="contactPerson" placeholder="Иванов Иван Иванович" className="material-input" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyPhone">Номер телефона</Label>
                  <Input id="companyPhone" type="tel" placeholder="+375 (XX) XXX-XX-XX" className="material-input" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyEmail">Email</Label>
                  <Input id="companyEmail" type="email" placeholder="info@company.com" className="material-input" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Страна</Label>
                  <select className="material-input w-full py-[7px] mx-0 px-0">
                    <option value="BY">Беларусь</option>
                    <option value="RU">Россия</option>
                    <option value="UA">Украина</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Должность ответственного лица</Label>
                  <Input id="position" placeholder="Директор" className="material-input" />
                </div>

                <div className="col-span-2 space-y-2">
                  <Label htmlFor="bankDetails">Реквизиты</Label>
                  <textarea id="bankDetails" className="material-input w-full h-24 resize-none" placeholder="Банковские реквизиты организации..." />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="authorities">Полномочия ответственного лица</Label>
                  <Input id="authorities" placeholder="на основании устава" className="material-input" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nameGenitive">ФИО в родительном падеже</Label>
                  <Input id="nameGenitive" placeholder="Иванова Ивана Ивановича" className="material-input" />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button className="material-button">
                  <Save className="w-4 h-4 mr-2" />
                  Сохранить настройки организации
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="templates" className="space-y-6 mt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Стандартные шаблоны</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {['Контракт общая стоимость', 'Контракт стоимость за единицу', 'Акт общая стоимость', 'Акт стоимость за единицу'].map(template => <div key={template} className="floating-card p-4 rounded-2xl">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{template}</span>
                          <Button variant="outline" size="sm">
                            <Upload className="w-4 h-4 mr-2" />
                            Загрузить
                          </Button>
                        </div>
                      </div>)}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Пользовательские шаблоны</h3>
                  <div className="floating-card p-6 rounded-2xl">
                    <div className="text-center py-8">
                      <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-lg font-medium mb-2">Загрузите пользовательский шаблон</p>
                      <p className="text-muted-foreground mb-4">Поддерживаются файлы .docx</p>
                      <div className="flex gap-3 justify-center">
                        <Input type="text" placeholder="Название шаблона" className="material-input max-w-xs" />
                        <Button className="material-button">
                          <Upload className="w-4 h-4 mr-2" />
                          Выбрать файл
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Example user templates */}
                  <div className="space-y-3 mt-4">
                    {['Спецификация оборудования', 'Техническое задание'].map(template => <div key={template} className="floating-card p-4 rounded-2xl">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{template}</span>
                          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>)}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>;
};