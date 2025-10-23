import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  mockTasks, 
  mockProjects, 
  mockUsers, 
  mockGoals, 
  mockTimeEntries,
  mockActivities 
} from '../services/mockData';
import type { 
  Task,
  Project, 
  User, 
  Goal, 
  TimeEntry, 
  Activity 

} from '../services/mockData';

type Theme = 'light' | 'dark' | 'system';

interface AppState {
  theme: Theme;
  currentUser: User;
  tasks: Task[];
  projects: Project[];
  users: User[];
  goals: Goal[];
  timeEntries: TimeEntry[];
  activities: Activity[];
  selectedProject: string | null;
  isTimeTracking: boolean;
  currentTrackingTask: string | null;
  trackingStartTime: Date | null;
}

type AppAction = 
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_SELECTED_PROJECT'; payload: string | null }
  | { type: 'START_TIME_TRACKING'; payload: { taskId: string } }
  | { type: 'STOP_TIME_TRACKING' }
  | { type: 'ADD_TIME_ENTRY'; payload: TimeEntry };

const initialState: AppState = {
  theme: 'system',
  currentUser: mockUsers[0],
  tasks: mockTasks,
  projects: mockProjects,
  users: mockUsers,
  goals: mockGoals,
  timeEntries: mockTimeEntries,
  activities: mockActivities,
  selectedProject: null,
  isTimeTracking: false,
  currentTrackingTask: null,
  trackingStartTime: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    
    case 'ADD_TASK':
      return { 
        ...state, 
        tasks: [...state.tasks, action.payload],
        activities: [
          {
            id: Date.now().toString(),
            type: 'task_created',
            userId: state.currentUser.id,
            taskId: action.payload.id,
            description: `created task "${action.payload.title}"`,
            timestamp: new Date().toISOString(),
            priority: action.payload.priority
          },
          ...state.activities
        ]
      };
    
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, ...action.payload.updates }
            : task
        )
      };
    
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };
    
    case 'SET_SELECTED_PROJECT':
      return { ...state, selectedProject: action.payload };
    
    case 'START_TIME_TRACKING':
      return {
        ...state,
        isTimeTracking: true,
        currentTrackingTask: action.payload.taskId,
        trackingStartTime: new Date()
      };
    
    case 'STOP_TIME_TRACKING':
      return {
        ...state,
        isTimeTracking: false,
        currentTrackingTask: null,
        trackingStartTime: null
      };
    
    case 'ADD_TIME_ENTRY':
      return {
        ...state,
        timeEntries: [...state.timeEntries, action.payload]
      };
    
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    if (state.theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.toggle('dark', systemTheme === 'dark');
    } else {
      root.classList.toggle('dark', state.theme === 'dark');
    }
  }, [state.theme]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}