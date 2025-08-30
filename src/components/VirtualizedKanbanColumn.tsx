import { useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Job, JobStatus } from '@/types/job';
import { SortableJobCard } from './SortableJobCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AddJobForm } from './AddJobForm';
import { Plus } from 'lucide-react';
import { useState, useRef } from 'react';

interface VirtualizedKanbanColumnProps {
  id: JobStatus;
  title: string;
  color: string;
  jobs: Job[];
  onAddJob: (job: Omit<Job, 'id' | 'lastUpdated'>) => void;
  onUpdateJob: (id: string, updates: Partial<Job>) => void;
  onDeleteJob: (id: string) => void;
  height: number; // Height for virtualization
}

export const VirtualizedKanbanColumn = ({ 
  id, 
  title, 
  color, 
  jobs, 
  onAddJob, 
  onUpdateJob, 
  onDeleteJob,
  height 
}: VirtualizedKanbanColumnProps) => {
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);

  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  // Virtual list for performance with large datasets
  const rowVirtualizer = useVirtualizer({
    count: jobs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120, // Estimated height of each job card
    overscan: 5, // Render 5 extra items outside visible area
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

  const virtualItems = rowVirtualizer.getVirtualItems();

  return (
    <div className="flex flex-col h-full min-w-[300px]">
      <Card className={`flex flex-col h-full border-t-4 ${getColumnColorClass()} shadow-lg`}>
        <div className={`${getHeaderGradient()} rounded-t-lg border-b`}>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-foreground">{title}</h3>
              <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                {jobs.length.toLocaleString()}
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
          className={`flex-1 relative transition-colors ${
            isOver ? 'bg-muted/20' : ''
          }`}
          style={{ height }}
        >
          {jobs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground p-4">
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
          ) : (
            <div
              ref={parentRef}
              className="h-full overflow-auto p-4"
              style={{
                height,
              }}
            >
              <SortableContext items={jobs.map(job => job.id)} strategy={verticalListSortingStrategy}>
                <div
                  style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                  }}
                >
                  {virtualItems.map((virtualItem) => {
                    const job = jobs[virtualItem.index];
                    return (
                      <div
                        key={virtualItem.key}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: `${virtualItem.size}px`,
                          transform: `translateY(${virtualItem.start}px)`,
                        }}
                      >
                        <div className="pb-3">
                          <SortableJobCard
                            job={job}
                            onUpdate={onUpdateJob}
                            onDelete={onDeleteJob}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </SortableContext>
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