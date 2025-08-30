import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Job, JobStatus } from '@/types/job';
import { JobCard } from './JobCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AddJobForm } from './AddJobForm';
import { Plus } from 'lucide-react';
import { SortableJobCard } from './SortableJobCard';

interface KanbanColumnProps {
  id: JobStatus;
  title: string;
  color: string;
  jobs: Job[];
  onAddJob: (job: Omit<Job, 'id' | 'lastUpdated'>) => void;
  onUpdateJob: (id: string, updates: Partial<Job>) => void;
  onDeleteJob: (id: string) => void;
}

export const KanbanColumn = ({ 
  id, 
  title, 
  color, 
  jobs, 
  onAddJob, 
  onUpdateJob, 
  onDeleteJob 
}: KanbanColumnProps) => {
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  const handleAddJob = (job: Omit<Job, 'id' | 'lastUpdated'>) => {
    onAddJob({ ...job, status: id });
    setIsAddFormOpen(false);
  };

  const getColumnColorClass = () => {
    switch (id) {
      case 'applied':
        return 'border-t-applied';
      case 'interviewing':
        return 'border-t-interviewing';
      case 'offer':
        return 'border-t-offer';
      case 'rejected':
        return 'border-t-rejected';
      default:
        return 'border-t-border';
    }
  };

  const getHeaderGradient = () => {
    switch (id) {
      case 'applied':
        return 'bg-gradient-to-r from-applied/10 to-applied/5';
      case 'interviewing':
        return 'bg-gradient-to-r from-interviewing/10 to-interviewing/5';
      case 'offer':
        return 'bg-gradient-to-r from-offer/10 to-offer/5';
      case 'rejected':
        return 'bg-gradient-to-r from-rejected/10 to-rejected/5';
      default:
        return 'bg-gradient-to-r from-muted/10 to-muted/5';
    }
  };

  return (
    <div className="flex flex-col h-full min-w-[300px]">
      <Card className={`flex flex-col h-full border-t-4 ${getColumnColorClass()} shadow-lg`}>
        <div className={`${getHeaderGradient()} rounded-t-lg border-b`}>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-foreground">{title}</h3>
              <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                {jobs.length}
              </span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsAddFormOpen(true)}
              className="h-8 w-8 p-0 hover:bg-background/50"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div
          ref={setNodeRef}
          className={`flex-1 p-4 space-y-3 overflow-y-auto transition-colors ${
            isOver ? 'bg-muted/20' : ''
          }`}
        >
          <SortableContext items={jobs.map(job => job.id)} strategy={verticalListSortingStrategy}>
            {jobs.map((job) => (
              <SortableJobCard
                key={job.id}
                job={job}
                onUpdate={onUpdateJob}
                onDelete={onDeleteJob}
              />
            ))}
          </SortableContext>
          
          {jobs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No applications yet</p>
              <Button
                variant="outline"
                onClick={() => setIsAddFormOpen(true)}
                className="mt-2"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Application
              </Button>
            </div>
          )}
        </div>
      </Card>

      <Dialog open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Application - {title}</DialogTitle>
          </DialogHeader>
          <AddJobForm 
            onSubmit={handleAddJob} 
            onCancel={() => setIsAddFormOpen(false)}
            initialStatus={id}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};