import { useState } from 'react';
import { Job } from '@/types/job';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { EditJobForm } from './EditJobForm';
import { CalendarDays, MapPin, DollarSign, ExternalLink, Mail, FileText, Trash2, Edit3 } from 'lucide-react';
import { format } from 'date-fns';

interface JobCardProps {
  job: Job;
  onUpdate: (id: string, updates: Partial<Job>) => void;
  onDelete: (id: string) => void;
}

export const JobCard = ({ job, onUpdate, onDelete }: JobCardProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleUpdate = (updates: Partial<Job>) => {
    onUpdate(job.id, updates);
    setIsEditOpen(false);
  };

  const formattedDate = format(new Date(job.appliedDate), 'MMM dd, yyyy');

  return (
    <>
      <Card className="group cursor-pointer bg-gradient-to-br from-card to-card/50 border-border hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
        <div className="p-4 space-y-3" onClick={() => setIsDetailOpen(true)}>
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <h3 className="font-semibold text-card-foreground text-sm">{job.company}</h3>
              <p className="text-muted-foreground text-xs">{job.role}</p>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditOpen(true);
                }}
              >
                <Edit3 className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(job.id);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarDays className="h-3 w-3" />
            <span>{formattedDate}</span>
          </div>

          {job.location && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{job.location}</span>
            </div>
          )}

          {job.salary && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <DollarSign className="h-3 w-3" />
              <span>{job.salary}</span>
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <Badge variant="secondary" className="text-xs">
              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            </Badge>
            {(job.jobPostingUrl || job.recruiterEmail) && (
              <div className="flex gap-1">
                {job.jobPostingUrl && <ExternalLink className="h-3 w-3 text-muted-foreground" />}
                {job.recruiterEmail && <Mail className="h-3 w-3 text-muted-foreground" />}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span>{job.role} at {job.company}</span>
              <Badge variant="secondary">{job.status.charAt(0).toUpperCase() + job.status.slice(1)}</Badge>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Applied:</span>
                  <span>{formattedDate}</span>
                </div>
                
                {job.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Location:</span>
                    <span>{job.location}</span>
                  </div>
                )}
                
                {job.salary && (
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Salary:</span>
                    <span>{job.salary}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                {job.recruiterName && (
                  <div className="text-sm">
                    <span className="font-medium">Recruiter:</span>
                    <span className="ml-2">{job.recruiterName}</span>
                  </div>
                )}
                
                {job.recruiterEmail && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${job.recruiterEmail}`} className="text-primary hover:underline">
                      {job.recruiterEmail}
                    </a>
                  </div>
                )}
                
                {job.resumeUsed && (
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Resume:</span>
                    <span>{job.resumeUsed}</span>
                  </div>
                )}
              </div>
            </div>

            {job.jobPostingUrl && (
              <div>
                <span className="font-medium text-sm">Job Posting:</span>
                <a 
                  href={job.jobPostingUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline text-sm mt-1"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Original Posting
                </a>
              </div>
            )}

            {job.notes && (
              <div>
                <span className="font-medium text-sm">Notes:</span>
                <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{job.notes}</p>
              </div>
            )}

            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={() => setIsEditOpen(true)} variant="outline" className="flex-1">
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Application
              </Button>
              <Button 
                onClick={() => {
                  onDelete(job.id);
                  setIsDetailOpen(false);
                }} 
                variant="destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Application</DialogTitle>
          </DialogHeader>
          <EditJobForm job={job} onSubmit={handleUpdate} onCancel={() => setIsEditOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};