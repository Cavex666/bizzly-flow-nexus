import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail, Lock, Building, Phone, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    phone: '',
    countryCode: '+375'
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  // Country codes for phone input
  const countryCodes = [
    { code: '+375', country: 'BY', name: 'Беларусь' },
    { code: '+7', country: 'RU', name: 'Россия' },
    { code: '+380', country: 'UA', name: 'Украина' },
    { code: '+48', country: 'PL', name: 'Польша' },
    { code: '+1', country: 'US', name: 'США' }
  ];

  // Auto-detect country by IP (simplified)
  useEffect(() => {
    // In real app, you would use a geolocation API
    // For now, default to Belarus
    setFormData(prev => ({ ...prev, countryCode: '+375' }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        toast({
          title: "Успешный вход",
          description: "Добро пожаловать в Bizzly!"
        });
        
        navigate('/dashboard');
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Пароли не совпадают');
        }

        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: {
              company_name: formData.companyName,
              phone: `${formData.countryCode}${formData.phone}`
            }
          }
        });

        if (error) throw error;

        toast({
          title: "Регистрация успешна",
          description: "Проверьте почту для подтверждения аккаунта"
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background flex items-center justify-center p-6">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-secondary/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-accent/20 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back to Home */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          На главную
        </button>

        {/* Auth Card */}
        <div className="glass-card rounded-3xl p-8 shadow-2xl scale-in">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
              <span className="text-white font-bold text-2xl">B</span>
            </div>
            <h1 className="text-2xl font-bold">
              {isLogin ? 'Вход в Bizzly' : 'Регистрация в Bizzly'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isLogin 
                ? 'Войдите в свой аккаунт' 
                : 'Создайте аккаунт для начала работы'
              }
            </p>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="companyName" className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Наименование организации
                </Label>
                <Input
                  id="companyName"
                  type="text"
                  placeholder="ООО &quot;Биззли Бай&quot;"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className="material-input"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Электронная почта
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="material-input"
                required
              />
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Номер телефона
                </Label>
                <div className="flex gap-2">
                  <select
                    value={formData.countryCode}
                    onChange={(e) => handleInputChange('countryCode', e.target.value)}
                    className="material-input w-24"
                  >
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.code}
                      </option>
                    ))}
                  </select>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(XX) XXX-XX-XX"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="material-input flex-1"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Пароль
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="material-input pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Подтвердите пароль
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="material-input"
                  required
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="material-button w-full"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                isLogin ? 'Войти' : 'Создать аккаунт'
              )}
            </Button>
          </form>

          {/* Switch Mode */}
          <div className="text-center mt-6">
            <p className="text-muted-foreground">
              {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline ml-2 font-medium"
              >
                {isLogin ? 'Зарегистрироваться' : 'Войти'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};