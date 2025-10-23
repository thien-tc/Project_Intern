import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/context/AppContext';

export function ProjectOverview() {
  const { state } = useApp();
  
  // Get the first project for detailed view
  const mainProject = state.projects[0];
  
  if (!mainProject) return null;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: mainProject.color }}
            />
            <div>
              <CardTitle className="text-lg">{mainProject.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{mainProject.description}</p>
            </div>
          </div>
          <Badge variant="secondary">{mainProject.lists.length} Lists</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Project Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{mainProject.totalTasks}</p>
            <p className="text-xs text-muted-foreground">Total Tasks</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{mainProject.progress}%</p>
            <p className="text-xs text-muted-foreground">Completion Rate</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{mainProject.members.length}</p>
            <p className="text-xs text-muted-foreground">Team Members</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">0</p>
            <p className="text-xs text-muted-foreground">Overdue Tasks</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Project Progress</span>
            <span>{mainProject.progress}%</span>
          </div>
          <Progress value={mainProject.progress} className="h-2" />
        </div>

        {/* Lists Overview */}
        <div>
          <h4 className="font-semibold mb-3">Lists Overview</h4>
          <div className="space-y-2">
            {mainProject.lists.map((list) => (
              <div key={list.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm font-medium">{list.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{list.taskCount}/3 tasks</span>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}