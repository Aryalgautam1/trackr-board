import { useState } from 'react';
import { Job, JobStatus } from '@/types/job';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EditJobFormProps {
  job: Job;
  onSubmit: (updates: Partial<Job>) => void;
  onCancel: () => void;
}

export const EditJobForm = ({ job, onSubmit, onCancel }: EditJobFormProps) => {
  const [formData, setFormData] = useState({
    company: job.company,
    role: job.role,
    location: job.location || '',
    salary: job.salary || '',
    appliedDate: job.appliedDate.split('T')[0],
    status: job.status,
    jobPostingUrl: job.jobPostingUrl || '',
    recruiterName: job.recruiterName || '',
    recruiterEmail: job.recruiterEmail || '',
    notes: job.notes || '',
    resumeUsed: job.resumeUsed || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company || !formData.role) return;
    
    onSubmit({
      ...formData,
      status: formData.status as JobStatus,
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="company">Company *</Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => handleChange('company', e.target.value)}
            placeholder="Google, Microsoft, etc."
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="role">Role *</Label>
          <Input
            id="role"
            value={formData.role}
            onChange={(e) => handleChange('role', e.target.value)}
            placeholder="Software Engineer, Product Manager, etc."
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="San Francisco, CA / Remote"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="salary">Salary Range</Label>
          <Input
            id="salary"
            value={formData.salary}
            onChange={(e) => handleChange('salary', e.target.value)}
            placeholder="$120k - $180k"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="appliedDate">Applied Date</Label>
          <Input
            id="appliedDate"
            type="date"
            value={formData.appliedDate}
            onChange={(e) => handleChange('appliedDate', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interviewing">Interviewing</SelectItem>
              <SelectItem value="offer">Offer</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="jobPostingUrl">Job Posting URL</Label>
        <Input
          id="jobPostingUrl"
          type="url"
          value={formData.jobPostingUrl}
          onChange={(e) => handleChange('jobPostingUrl', e.target.value)}
          placeholder="https://company.com/careers/job-123"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="recruiterName">Recruiter Name</Label>
          <Input
            id="recruiterName"
            value={formData.recruiterName}
            onChange={(e) => handleChange('recruiterName', e.target.value)}
            placeholder="Jane Smith"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="recruiterEmail">Recruiter Email</Label>
          <Input
            id="recruiterEmail"
            type="email"
            value={formData.recruiterEmail}
            onChange={(e) => handleChange('recruiterEmail', e.target.value)}
            placeholder="jane.smith@company.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="resumeUsed">Resume Version Used</Label>
        <Input
          id="resumeUsed"
          value={formData.resumeUsed}
          onChange={(e) => handleChange('resumeUsed', e.target.value)}
          placeholder="Software Engineer Resume v2.1"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Application notes, interview feedback, etc."
          rows={3}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1">
          Update Application
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};