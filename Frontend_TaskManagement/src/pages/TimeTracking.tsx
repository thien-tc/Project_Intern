import { MainLayout } from '@/components/layout/MainLayout';
import { TimeTracker } from '@/components/time/TimeTracker';
import { TimeEntries } from '@/components/time/TimeEntries';

export default function TimeTracking() {
  return (
    <MainLayout 
      title="Time Tracking"
      subtitle="Monitor time spent on tasks and projects."
    >
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TimeTracker />
          <div className="lg:col-span-1">
            <TimeEntries />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}