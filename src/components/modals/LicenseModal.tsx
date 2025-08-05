import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LicenseModalProps {
  onClose: () => void;
}

export const LicenseModal = ({ onClose }: LicenseModalProps) => {
  return (
    <div className="modal-overlay fade-in">
      <div className="modal-content slide-up max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-bold">Лицензионное соглашение</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-primary/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-96 overflow-y-auto">
          <div className="space-y-4 text-sm text-muted-foreground">
            <h3 className="text-lg font-semibold text-foreground">
              Условия использования Bizzly
            </h3>
            
            <p>
              Настоящее лицензионное соглашение («Соглашение») заключается между вами 
              («Пользователь») и компанией Bizzly («Компания») относительно использования 
              программного обеспечения Bizzly («Программное обеспечение»).
            </p>

            <h4 className="font-semibold text-foreground">1. Предоставление лицензии</h4>
            <p>
              Компания предоставляет Пользователю неисключительную, непередаваемую лицензию 
              на использование Программного обеспечения в соответствии с условиями данного Соглашения.
            </p>

            <h4 className="font-semibold text-foreground">2. Ограничения</h4>
            <p>
              Пользователь не имеет права: модифицировать, декомпилировать, дизассемблировать 
              или создавать производные работы на основе Программного обеспечения; 
              распространять, продавать или сдавать в аренду Программное обеспечение.
            </p>

            <h4 className="font-semibold text-foreground">3. Конфиденциальность</h4>
            <p>
              Компания обязуется защищать конфиденциальность данных Пользователя в соответствии 
              с применимым законодательством о защите данных.
            </p>

            <h4 className="font-semibold text-foreground">4. Ответственность</h4>
            <p>
              Программное обеспечение предоставляется «как есть», без каких-либо гарантий. 
              Компания не несет ответственности за любые убытки, возникшие в результате 
              использования Программного обеспечения.
            </p>

            <h4 className="font-semibold text-foreground">5. Прекращение действия</h4>
            <p>
              Данное Соглашение действует до его прекращения. Компания может прекратить 
              действие лицензии в случае нарушения Пользователем условий Соглашения.
            </p>

            <p className="text-xs">
              Последнее обновление: 1 января 2024 года
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-border">
          <Button onClick={onClose} className="material-button">
            Принять и закрыть
          </Button>
        </div>
      </div>
    </div>
  );
};