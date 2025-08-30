import { useState, useEffect } from 'react';
import { Job, JobStatus } from '@/types/job';

const STORAGE_KEY = 'job-tracker-data';

export const useJobStorage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const storedJobs = localStorage.getItem(STORAGE_KEY);
    if (storedJobs) {
      try {
        setJobs(JSON.parse(storedJobs));
      } catch (error) {
        console.error('Error parsing stored jobs:', error);
      }
    }
  }, []);

  const saveJobs = (newJobs: Job[]) => {
    setJobs(newJobs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newJobs));
  };

  const addJob = (job: Omit<Job, 'id' | 'lastUpdated'>) => {
    const newJob: Job = {
      ...job,
      id: `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      lastUpdated: new Date().toISOString(),
    };
    saveJobs([...jobs, newJob]);
    return newJob;
  };

  const updateJob = (id: string, updates: Partial<Job>) => {
    const updatedJobs = jobs.map(job =>
      job.id === id
        ? { ...job, ...updates, lastUpdated: new Date().toISOString() }
        : job
    );
    saveJobs(updatedJobs);
  };

  const deleteJob = (id: string) => {
    const filteredJobs = jobs.filter(job => job.id !== id);
    saveJobs(filteredJobs);
  };

  const moveJob = (jobId: string, newStatus: JobStatus) => {
    updateJob(jobId, { status: newStatus });
  };

  return {
    jobs,
    addJob,
    updateJob,
    deleteJob,
    moveJob,
  };
};