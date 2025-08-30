import { useState } from 'react';
import { KanbanBoard } from '@/components/KanbanBoard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AddJobForm } from '@/components/AddJobForm';
import { useJobStorage } from '@/hooks/useJobStorage';
import { Plus, Target, TrendingUp, Users, CheckCircle } from 'lucide-react';

const Index = () => {
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const { jobs, addJob } = useJobStorage();

  const handleAddJob = (job: Parameters<typeof addJob>[0]) => {
    addJob(job);
    setIsAddFormOpen(false);
  };

  const stats = {
    total: jobs.length,
    applied: jobs.filter(j => j.status === 'applied').length,
    interviewing: jobs.filter(j => j.status === 'interviewing').length,
    offers: jobs.filter(j => j.status === 'offer').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Job Tracker</h1>
                <p className="text-sm text-muted-foreground">Manage your job applications</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Quick Stats */}
              <div className="hidden md:flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-applied rounded-full"></div>
                  <span>{stats.applied} Applied</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-interviewing rounded-full"></div>
                  <span>{stats.interviewing} Interviewing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-offer rounded-full"></div>
                  <span>{stats.offers} Offers</span>
                </div>
              </div>
              
              <Button onClick={() => setIsAddFormOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Application
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        {jobs.length === 0 ? (
          /* Empty State */
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="max-w-md w-full p-8 text-center">
              <div className="mb-6">
                <div className="h-16 w-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Start Tracking Applications</h2>
                <p className="text-muted-foreground">
                  Organize your job search with our Kanban-style board. Track applications from start to finish.
                </p>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 bg-applied rounded-full"></div>
                  <span>Track applications you've submitted</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 bg-interviewing rounded-full"></div>
                  <span>Monitor interview progress</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 bg-offer rounded-full"></div>
                  <span>Celebrate offers received</span>
                </div>
              </div>
              
              <Button onClick={() => setIsAddFormOpen(true)} className="w-full gap-2">
                <Plus className="h-4 w-4" />
                Add Your First Application
              </Button>
            </Card>
          </div>
        ) : (
          /* Kanban Board */
          <div className="h-[calc(100vh-12rem)]">
            <KanbanBoard />
          </div>
        )}
      </main>

      {/* Add Job Modal */}
      <Dialog open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Job Application</DialogTitle>
          </DialogHeader>
          <AddJobForm 
            onSubmit={handleAddJob} 
            onCancel={() => setIsAddFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
