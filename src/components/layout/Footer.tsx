import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { LicenseModal } from '../modals/LicenseModal';

export const Footer = () => {
  const [showLicense, setShowLicense] = useState(false);
  
  return (
    <>
      <footer className="bg-white/90 backdrop-blur-xl border-t border-border/50 px-6 py-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-6">
            <p>© 2024 Bizzly. Все права защищены.</p>
            <button
              onClick={() => setShowLicense(true)}
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              Лицензионное соглашение
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
          
          <div className="flex items-center gap-6">
            <span>Версия 1.0.0</span>
            <span>Поддержка: support@bizzly.com</span>
          </div>
        </div>
      </footer>

      {/* License Modal */}
      {showLicense && (
        <LicenseModal onClose={() => setShowLicense(false)} />
      )}
    </>
  );
};