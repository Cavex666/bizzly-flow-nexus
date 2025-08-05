import { X } from 'lucide-react';

interface CreateClientModalProps {
  onClose: () => void;
}

export const CreateClientModal = ({ onClose }: CreateClientModalProps) => {
  return (
    <div className="modal-overlay fade-in">
      <div className="modal-content slide-up">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-bold">Добавить клиента</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-primary/10">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <p>Модальное окно создания клиента будет реализовано...</p>
        </div>
      </div>
    </div>
  );
};