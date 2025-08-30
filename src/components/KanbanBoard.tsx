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
import { VirtualizedKanbanColumn } from './VirtualizedKanbanColumn';
import { SearchAndFilters } from './SearchAndFilters';
import { useIndexedDbStorage } from '@/hooks/useIndexedDbStorage';
import { useJobFilters } from '@/hooks/useJobFilters';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const columns: KanbanColumnType[] = [
  { id: 'applied', title: 'Applied', color: 'blue', jobs: [] },
  { id: 'interviewing', title: 'Interviewing', color: 'orange', jobs: [] },
  { id: 'offer', title: 'Offer', color: 'green', jobs: [] },
  { id: 'rejected', title: 'Rejected', color: 'red', jobs: [] },
];

interface KanbanBoardProps {
  searchComponent?: React.ReactNode;
}

export const KanbanBoard = ({ searchComponent }: KanbanBoardProps) => {
  const { jobs, isLoading, error, addJob, updateJob, deleteJob, moveJob } = useIndexedDbStorage();
  const {
    filters,
    filteredAndSortedJobs,
    updateFilter,
    resetFilters,
    getFilteredJobsByStatus,
    uniqueCompanies,
    uniqueLocations,
    totalFilteredJobs,
  } = useJobFilters(jobs);
  const [activeJob, setActiveJob] = useState<Job | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const getJobsByStatus = (status: JobStatus): Job[] => {
    return getFilteredJobsByStatus(status);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const job = filteredAndSortedJobs.find(j => j.id === active.id);
    setActiveJob(job || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeJob = filteredAndSortedJobs.find(j => j.id === active.id);
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
    
    const activeJob = filteredAndSortedJobs.find(j => j.id === active.id);
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

  // Calculate column height for virtualization
  const columnHeight = 600; // Fixed height for better performance

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading applications...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="p-6 text-center">
          <p className="text-destructive mb-2">Error loading applications</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Search and Filters */}
      {searchComponent || (
        <SearchAndFilters
          filters={filters}
          onUpdateFilter={updateFilter}
          onResetFilters={resetFilters}
          uniqueCompanies={uniqueCompanies}
          uniqueLocations={uniqueLocations}
          totalResults={totalFilteredJobs}
          totalJobs={jobs.length}
        />
      )}
      
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 h-full overflow-x-auto pb-6">
          {columns.map((column) => (
            <VirtualizedKanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              color={column.color}
              jobs={getJobsByStatus(column.id)}
              onAddJob={addJob}
              onUpdateJob={updateJob}
              onDeleteJob={deleteJob}
              height={columnHeight}
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