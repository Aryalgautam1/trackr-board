import { useState, useEffect, useCallback } from 'react';
import { Job, JobStatus } from '@/types/job';
import { jobTrackerDB, IDBJob } from '@/utils/indexedDb';

// Migration function to move data from localStorage to IndexedDB
const migrateFromLocalStorage = async (): Promise<void> => {
  const STORAGE_KEY = 'job-tracker-data';
  const storedJobs = localStorage.getItem(STORAGE_KEY);
  
  if (storedJobs) {
    try {
      const jobs: Job[] = JSON.parse(storedJobs);
      
      // Check if IndexedDB is empty
      const existingJobs = await jobTrackerDB.getAllJobs();
      if (existingJobs.length === 0 && jobs.length > 0) {
        // Migrate data
        for (const job of jobs) {
          await jobTrackerDB.addJob(job);
        }
        
        // Clear localStorage after successful migration
        localStorage.removeItem(STORAGE_KEY);
        console.log(`Migrated ${jobs.length} jobs from localStorage to IndexedDB`);
      }
    } catch (error) {
      console.error('Error migrating from localStorage:', error);
    }
  }
};

export const useIndexedDbStorage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize database and load jobs
  useEffect(() => {
    let isMounted = true;

    const initializeAndLoad = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        await jobTrackerDB.init();
        await migrateFromLocalStorage();
        
        if (isMounted) {
          const loadedJobs = await jobTrackerDB.getAllJobs();
          setJobs(loadedJobs);
        }
      } catch (err) {
        console.error('Error initializing database:', err);
        if (isMounted) {
          setError('Failed to initialize database');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAndLoad();

    return () => {
      isMounted = false;
    };
  }, []);

  const refreshJobs = useCallback(async () => {
    try {
      const loadedJobs = await jobTrackerDB.getAllJobs();
      setJobs(loadedJobs);
    } catch (err) {
      console.error('Error refreshing jobs:', err);
      setError('Failed to refresh jobs');
    }
  }, []);

  const addJob = useCallback(async (job: Omit<Job, 'id' | 'lastUpdated'>) => {
    try {
      const newJob: Job = {
        ...job,
        id: `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        lastUpdated: new Date().toISOString(),
      };
      
      await jobTrackerDB.addJob(newJob);
      await refreshJobs();
      return newJob;
    } catch (err) {
      console.error('Error adding job:', err);
      setError('Failed to add job');
      throw err;
    }
  }, [refreshJobs]);

  const updateJob = useCallback(async (id: string, updates: Partial<Job>) => {
    try {
      const existingJob = jobs.find(job => job.id === id);
      if (!existingJob) {
        throw new Error('Job not found');
      }

      const updatedJob: Job = {
        ...existingJob,
        ...updates,
        lastUpdated: new Date().toISOString(),
      };

      await jobTrackerDB.updateJob(updatedJob);
      await refreshJobs();
    } catch (err) {
      console.error('Error updating job:', err);
      setError('Failed to update job');
      throw err;
    }
  }, [jobs, refreshJobs]);

  const deleteJob = useCallback(async (id: string) => {
    try {
      await jobTrackerDB.deleteJob(id);
      await refreshJobs();
    } catch (err) {
      console.error('Error deleting job:', err);
      setError('Failed to delete job');
      throw err;
    }
  }, [refreshJobs]);

  const moveJob = useCallback(async (jobId: string, newStatus: JobStatus) => {
    try {
      await updateJob(jobId, { status: newStatus });
    } catch (err) {
      console.error('Error moving job:', err);
      setError('Failed to move job');
      throw err;
    }
  }, [updateJob]);

  const getJobsByStatus = useCallback((status: JobStatus): Job[] => {
    return jobs.filter(job => job.status === status);
  }, [jobs]);

  const clearAllJobs = useCallback(async () => {
    try {
      await jobTrackerDB.clearAll();
      await refreshJobs();
    } catch (err) {
      console.error('Error clearing jobs:', err);
      setError('Failed to clear jobs');
      throw err;
    }
  }, [refreshJobs]);

  return {
    jobs,
    isLoading,
    error,
    addJob,
    updateJob,
    deleteJob,
    moveJob,
    getJobsByStatus,
    clearAllJobs,
    refreshJobs,
  };
};