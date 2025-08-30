export type JobStatus = 'applied' | 'interviewing' | 'offer' | 'rejected';

export interface Job {
  id: string;
  company: string;
  role: string;
  location?: string;
  salary?: string;
  appliedDate: string;
  status: JobStatus;
  jobPostingUrl?: string;
  recruiterName?: string;
  recruiterEmail?: string;
  notes?: string;
  resumeUsed?: string;
  lastUpdated: string;
}

export interface KanbanColumn {
  id: JobStatus;
  title: string;
  color: string;
  jobs: Job[];
}