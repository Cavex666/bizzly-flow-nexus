import { X } from 'lucide-react';

interface CalendarEditorModalProps {
  onClose: () => void;
}

export const CalendarEditorModal = ({ onClose }: CalendarEditorModalProps) => {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay fade-in" onClick={handleOverlayClick}>
      <div className="modal-content slide-up">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-bold">Редактор календаря</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-primary/10">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <p>Редактор календаря с настройкой рабочих дней будет реализован...</p>
        </div>
      </div>
    </div>
  );
};