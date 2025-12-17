import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { Task } from '@/services/mockData';


interface TaskCalendarProps {
  onTaskClick: (task: Task) => void;
}

export function TaskCalendar({ onTaskClick }: TaskCalendarProps) {
  const { state } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getTasksForDate = (date: Date | null) => {
    if (!date) return [];

    const dateStr = date.toISOString().split('T')[0];
    return state.tasks.filter(task =>
      task.dueDate === dateStr || task.startDate === dateStr
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const days = getDaysInMonth(currentDate);

  return (
    <div className="h-full">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
        {/* Day Headers */}
        {dayNames.map(day => (
          <div key={day} className="bg-muted p-3 text-center text-sm font-medium">
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {days.map((date, index) => {
          const tasks = getTasksForDate(date);
          const isToday = date &&
            date.toDateString() === new Date().toDateString();

          return (
            <div
              key={index}
              className={`bg-background min-h-[120px] p-2 ${date ? 'hover:bg-muted/50 cursor-pointer' : ''
                } ${isToday ? 'ring-2 ring-primary' : ''}`}
            >
              {date && (
                <>
                  <div className={`text-sm font-medium mb-2 ${isToday ? 'text-primary' : 'text-foreground'
                    }`}>
                    {date.getDate()}
                  </div>

                  <div className="space-y-1">
                    {tasks.slice(0, 3).map(task => (
                      <div
                        key={task.id}
                        className="text-xs p-1 rounded bg-primary/10 hover:bg-primary/20 cursor-pointer truncate"
                        onClick={() => onTaskClick(task)}
                      >
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${task.priority === 'urgent' ? 'bg-red-500' :
                            task.priority === 'high' ? 'bg-orange-500' :
                              task.priority === 'normal' ? 'bg-blue-500' : 'bg-gray-500'
                            }`} />
                          <span className="truncate">{task.title}</span>
                        </div>
                      </div>
                    ))}

                    {tasks.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{tasks.length - 3} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}