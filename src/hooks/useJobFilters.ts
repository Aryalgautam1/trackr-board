import { useState, useMemo, useCallback } from 'react';
import { Job, JobStatus } from '@/types/job';
import Fuse from 'fuse.js';

export interface JobFilters {
  search: string;
  status: JobStatus | 'all';
  dateRange: {
    start: string;
    end: string;
  } | null;
  company: string;
  location: string;
  sortBy: 'appliedDate' | 'lastUpdated' | 'company' | 'role';
  sortOrder: 'asc' | 'desc';
}

const defaultFilters: JobFilters = {
  search: '',
  status: 'all',
  dateRange: null,
  company: '',
  location: '',
  sortBy: 'lastUpdated',
  sortOrder: 'desc',
};

const fuseOptions = {
  keys: [
    { name: 'company', weight: 0.3 },
    { name: 'role', weight: 0.3 },
    { name: 'location', weight: 0.2 },
    { name: 'recruiterName', weight: 0.1 },
    { name: 'notes', weight: 0.1 },
  ],
  threshold: 0.3,
  includeScore: true,
};

export const useJobFilters = (jobs: Job[]) => {
  const [filters, setFilters] = useState<JobFilters>(defaultFilters);

  const fuse = useMemo(() => new Fuse(jobs, fuseOptions), [jobs]);

  const filteredAndSortedJobs = useMemo(() => {
    let filtered = [...jobs];

    // Text search using Fuse.js for fuzzy matching
    if (filters.search.trim()) {
      const searchResults = fuse.search(filters.search.trim());
      filtered = searchResults.map(result => result.item);
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(job => job.status === filters.status);
    }

    // Company filter
    if (filters.company.trim()) {
      const companySearch = filters.company.trim().toLowerCase();
      filtered = filtered.filter(job => 
        job.company.toLowerCase().includes(companySearch)
      );
    }

    // Location filter
    if (filters.location.trim()) {
      const locationSearch = filters.location.trim().toLowerCase();
      filtered = filtered.filter(job => 
        job.location?.toLowerCase().includes(locationSearch)
      );
    }

    // Date range filter
    if (filters.dateRange) {
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      
      filtered = filtered.filter(job => {
        const jobDate = new Date(job.appliedDate);
        return jobDate >= startDate && jobDate <= endDate;
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (filters.sortBy) {
        case 'appliedDate':
          aValue = new Date(a.appliedDate).getTime();
          bValue = new Date(b.appliedDate).getTime();
          break;
        case 'lastUpdated':
          aValue = new Date(a.lastUpdated).getTime();
          bValue = new Date(b.lastUpdated).getTime();
          break;
        case 'company':
          aValue = a.company.toLowerCase();
          bValue = b.company.toLowerCase();
          break;
        case 'role':
          aValue = a.role.toLowerCase();
          bValue = b.role.toLowerCase();
          break;
        default:
          aValue = new Date(a.lastUpdated).getTime();
          bValue = new Date(b.lastUpdated).getTime();
      }

      if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [jobs, filters, fuse]);

  const updateFilter = useCallback(<K extends keyof JobFilters>(
    key: K,
    value: JobFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const getFilteredJobsByStatus = useCallback((status: JobStatus) => {
    return filteredAndSortedJobs.filter(job => job.status === status);
  }, [filteredAndSortedJobs]);

  // Get unique values for filter dropdowns
  const uniqueCompanies = useMemo(() => {
    const companies = [...new Set(jobs.map(job => job.company))].sort();
    return companies;
  }, [jobs]);

  const uniqueLocations = useMemo(() => {
    const locations = [...new Set(jobs.map(job => job.location).filter(Boolean))].sort();
    return locations as string[];
  }, [jobs]);

  return {
    filters,
    filteredAndSortedJobs,
    updateFilter,
    resetFilters,
    getFilteredJobsByStatus,
    uniqueCompanies,
    uniqueLocations,
    totalFilteredJobs: filteredAndSortedJobs.length,
  };
};