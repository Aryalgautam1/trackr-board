import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Job, JobStatus, KanbanColumn as KanbanColumnType } from '@/types/job';
import { KanbanColumn } from './KanbanColumn';
import { useJobStorage } from '@/hooks/useJobStorage';
import { Card } from '@/components/ui/card';

const columns: KanbanColumnType[] = [
  { id: 'applied', title: 'Applied', color: 'blue', jobs: [] },
  { id: 'interviewing', title: 'Interviewing', color: 'orange', jobs: [] },
  { id: 'offer', title: 'Offer', color: 'green', jobs: [] },
  { id: 'rejected', title: 'Rejected', color: 'red', jobs: [] },
];

export const KanbanBoard = () => {
  const { jobs, addJob, updateJob, deleteJob, moveJob } = useJobStorage();
  const [activeJob, setActiveJob] = useState<Job | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const getJobsByStatus = (status: JobStatus): Job[] => {
    return jobs.filter(job => job.status === status);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const job = jobs.find(j => j.id === active.id);
    setActiveJob(job || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeJob = jobs.find(j => j.id === active.id);
    if (!activeJob) return;

    const overId = over.id as string;
    
    // Check if we're over a column
    if (['applied', 'interviewing', 'offer', 'rejected'].includes(overId)) {
      const newStatus = overId as JobStatus;
      if (activeJob.status !== newStatus) {
        moveJob(activeJob.id, newStatus);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveJob(null);
    
    const { active, over } = event;
    
    if (!over) return;
    
    const activeJob = jobs.find(j => j.id === active.id);
    if (!activeJob) return;

    const overId = over.id as string;
    
    // Check if we're over a column
    if (['applied', 'interviewing', 'offer', 'rejected'].includes(overId)) {
      const newStatus = overId as JobStatus;
      if (activeJob.status !== newStatus) {
        moveJob(activeJob.id, newStatus);
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 h-full overflow-x-auto pb-6">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              color={column.color}
              jobs={getJobsByStatus(column.id)}
              onAddJob={addJob}
              onUpdateJob={updateJob}
              onDeleteJob={deleteJob}
            />
          ))}
        </div>
        
        {/* Drag overlay */}
        {activeJob && (
          <div className="fixed inset-0 pointer-events-none z-50">
            <Card className="absolute bg-card border shadow-2xl w-[280px] opacity-90">
              <div className="p-4">
                <h3 className="font-semibold text-card-foreground text-sm">{activeJob.company}</h3>
                <p className="text-muted-foreground text-xs">{activeJob.role}</p>
              </div>
            </Card>
          </div>
        )}
      </DndContext>
    </div>
  );
};