import { MainLayout } from '@/components/layout/MainLayout';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { ProjectOverview } from '@/components/dashboard/ProjectOverview';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { ActiveGoals } from '@/components/dashboard/ActiveGoals';
import { useApp } from '@/context/AppContext';

export default function Dashboard() {
  const { state } = useApp();

  return (
    <MainLayout 
      title={`Welcome back, ${state.currentUser?.name.split(' ')[0]}!`}
      subtitle="Here's what's happening in your workspace today."
      showNewTaskButton
      onNewTask={() => {
        // Handle new task creation
        console.log('Create new task');
      }}
    >
      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <StatsCards />
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Project Overview */}
          <ProjectOverview />
          
          {/* Recent Activity */}
          <RecentActivity />
        </div>
        
        {/* Goals Section */}
        <ActiveGoals />
      </div>
    </MainLayout>
  );
}