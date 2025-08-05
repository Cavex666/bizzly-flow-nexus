import { X } from 'lucide-react';

interface ProjectViewModalProps {
  onClose: () => void;
  project?: {
    id: string;
    name: string;
    client: string;
    status: string;
    progress: number;
    budget: string;
    startDate: string;
    endDate: string;
  } | null;
}

export const ProjectViewModal = ({ onClose, project }: ProjectViewModalProps) => {
  if (!project) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay fade-in" onClick={handleOverlayClick}>
      <div className="modal-content slide-up">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-bold">Просмотр проекта</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-primary/10">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{project.name}</h3>
            <p className="text-muted-foreground">Клиент: {project.client}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Статус</p>
              <p className="font-medium text-foreground">{project.status}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Прогресс</p>
              <p className="font-medium text-foreground">{project.progress}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Бюджет</p>
              <p className="font-medium text-foreground">{project.budget}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Период</p>
              <p className="font-medium text-foreground">{project.startDate} - {project.endDate}</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button className="material-button px-4 py-2">
              Договор
            </button>
            <button className="material-button px-4 py-2">
              Акт
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};