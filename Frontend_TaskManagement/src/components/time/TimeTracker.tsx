import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Play, Pause, Square } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function TimeTracker() {
  const { state, dispatch } = useApp();
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [description, setDescription] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);

  // Update elapsed time when tracking
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (state.isTimeTracking && state.trackingStartTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - state.trackingStartTime!.getTime()) / 1000);
        setElapsedTime(diff);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.isTimeTracking, state.trackingStartTime]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTimer = () => {
    if (!selectedTask) return;
    
    dispatch({
      type: 'START_TIME_TRACKING',
      payload: { taskId: selectedTask }
    });
    setElapsedTime(0);
  };

  const handleStopTimer = () => {
    if (state.isTimeTracking && state.trackingStartTime) {
      const duration = Math.floor((new Date().getTime() - state.trackingStartTime.getTime()) / 60000); // in minutes
      
      // Add time entry
      dispatch({
        type: 'ADD_TIME_ENTRY',
        payload: {
          id: Date.now().toString(),
          taskId: state.currentTrackingTask!,
          userId: state.currentUser.id,
          description: description || 'Time tracking',
          duration,
          date: new Date().toISOString().split('T')[0],
          billable: true
        }
      });
    }
    
    dispatch({ type: 'STOP_TIME_TRACKING' });
    setElapsedTime(0);
    setDescription('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5" />
          Time Tracker
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Timer Display */}
        <div className="text-center">
          <div className="text-6xl font-mono font-bold text-primary mb-2">
            {formatTime(elapsedTime)}
          </div>
          <p className="text-sm text-muted-foreground">
            {state.isTimeTracking ? 'Timer is running' : 'No time entries for today.'}
          </p>
        </div>

        {/* Task Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Task</label>
          <Select 
            value={selectedTask} 
            onValueChange={setSelectedTask}
            disabled={state.isTimeTracking}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a task to track time" />
            </SelectTrigger>
            <SelectContent>
              {state.tasks.map((task) => (
                <SelectItem key={task.id} value={task.id}>
                  {task.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Description (optional)</label>
          <Textarea
            placeholder="What are you working on?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={state.isTimeTracking}
            rows={3}
          />
        </div>

        {/* Timer Controls */}
        <div className="flex gap-2">
          {!state.isTimeTracking ? (
            <Button 
              onClick={handleStartTimer}
              disabled={!selectedTask}
              className="flex-1 gap-2"
            >
              <Play className="h-4 w-4" />
              Start Timer
            </Button>
          ) : (
            <Button 
              onClick={handleStopTimer}
              variant="destructive"
              className="flex-1 gap-2"
            >
              <Square className="h-4 w-4" />
              Stop Timer
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}