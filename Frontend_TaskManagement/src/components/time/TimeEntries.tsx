import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock, DollarSign } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function TimeEntries() {
  const { state } = useApp();
  
  const todayEntries = state.timeEntries.filter(entry => {
    const today = new Date().toISOString().split('T')[0];
    return entry.date === today;
  });

  const totalToday = todayEntries.reduce((sum, entry) => sum + entry.duration, 0);
  const billableEntries = todayEntries.filter(entry => entry.billable).length;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getTaskTitle = (taskId: string) => {
    const task = state.tasks.find(t => t.id === taskId);
    return task?.title || 'Unknown Task';
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-600">{formatDuration(totalToday)}</p>
                <p className="text-sm text-muted-foreground">Today's Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">{todayEntries.length}</p>
                <p className="text-sm text-muted-foreground">Entries Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-orange-600">{billableEntries}</p>
                <p className="text-sm text-muted-foreground">Billable Entries</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Entries List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Time Entries</CardTitle>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Manual Entry
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {todayEntries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No time entries for today</p>
              <p className="text-sm">Start tracking time to see entries here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayEntries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{getTaskTitle(entry.taskId)}</h4>
                    <p className="text-xs text-muted-foreground">{entry.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge variant={entry.billable ? "default" : "secondary"}>
                      {entry.billable ? "Billable" : "Non-billable"}
                    </Badge>
                    <span className="font-mono text-sm font-medium">
                      {formatDuration(entry.duration)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}