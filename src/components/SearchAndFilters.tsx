import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { JobFilters } from '@/hooks/useJobFilters';
import { Search, Filter, X, Calendar, MapPin, Building2, ArrowUpDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface SearchAndFiltersProps {
  filters: JobFilters;
  onUpdateFilter: <K extends keyof JobFilters>(key: K, value: JobFilters[K]) => void;
  onResetFilters: () => void;
  uniqueCompanies: string[];
  uniqueLocations: string[];
  totalResults: number;
  totalJobs: number;
}

export const SearchAndFilters = ({
  filters,
  onUpdateFilter,
  onResetFilters,
  uniqueCompanies,
  uniqueLocations,
  totalResults,
  totalJobs,
}: SearchAndFiltersProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const hasActiveFilters = 
    filters.search ||
    filters.status !== 'all' ||
    filters.company ||
    filters.location ||
    filters.dateRange;

  const activeFilterCount = [
    filters.search,
    filters.status !== 'all',
    filters.company,
    filters.location,
    filters.dateRange,
  ].filter(Boolean).length;

  return (
    <Card className="p-4 mb-6">
      {/* Search Bar */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs, companies, roles..."
            value={filters.search}
            onChange={(e) => onUpdateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </CollapsibleTrigger>
        </Collapsible>

        {hasActiveFilters && (
          <Button variant="ghost" onClick={onResetFilters} className="gap-2">
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
        <span>
          Showing {totalResults.toLocaleString()} of {totalJobs.toLocaleString()} applications
        </span>
        
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4" />
          <Select 
            value={`${filters.sortBy}-${filters.sortOrder}`} 
            onValueChange={(value) => {
              const [sortBy, sortOrder] = value.split('-') as [typeof filters.sortBy, typeof filters.sortOrder];
              onUpdateFilter('sortBy', sortBy);
              onUpdateFilter('sortOrder', sortOrder);
            }}
          >
            <SelectTrigger className="w-auto">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lastUpdated-desc">Recently Updated</SelectItem>
              <SelectItem value="appliedDate-desc">Recently Applied</SelectItem>
              <SelectItem value="appliedDate-asc">Oldest First</SelectItem>
              <SelectItem value="company-asc">Company A-Z</SelectItem>
              <SelectItem value="company-desc">Company Z-A</SelectItem>
              <SelectItem value="role-asc">Role A-Z</SelectItem>
              <SelectItem value="role-desc">Role Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Advanced Filters */}
      <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <CollapsibleContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Status
              </Label>
              <Select value={filters.status} onValueChange={(value) => onUpdateFilter('status', value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="interviewing">Interviewing</SelectItem>
                  <SelectItem value="offer">Offer</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Company Filter */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Company
              </Label>
              <Select value={filters.company} onValueChange={(value) => onUpdateFilter('company', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Companies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Companies</SelectItem>
                  {uniqueCompanies.slice(0, 50).map((company) => (
                    <SelectItem key={company} value={company}>
                      {company}
                    </SelectItem>
                  ))}
                  {uniqueCompanies.length > 50 && (
                    <SelectItem value="" disabled>
                      ... and {uniqueCompanies.length - 50} more
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Location Filter */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </Label>
              <Select value={filters.location} onValueChange={(value) => onUpdateFilter('location', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Locations</SelectItem>
                  {uniqueLocations.slice(0, 50).map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                  {uniqueLocations.length > 50 && (
                    <SelectItem value="" disabled>
                      ... and {uniqueLocations.length - 50} more
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date Range
              </Label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={filters.dateRange?.start || ''}
                  onChange={(e) => {
                    const newRange = filters.dateRange || { start: '', end: '' };
                    onUpdateFilter('dateRange', e.target.value ? { ...newRange, start: e.target.value } : null);
                  }}
                  className="flex-1"
                />
                <Input
                  type="date"
                  value={filters.dateRange?.end || ''}
                  onChange={(e) => {
                    const newRange = filters.dateRange || { start: '', end: '' };
                    onUpdateFilter('dateRange', e.target.value ? { ...newRange, end: e.target.value } : null);
                  }}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};