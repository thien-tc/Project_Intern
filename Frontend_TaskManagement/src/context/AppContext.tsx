import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { userApi } from '../api/userApi';
import { workspaceApi } from '../api/workspaceApi';
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
  currentUser: User | null;
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
  | { type: 'SET_CURRENT_USER'; payload: User | null }
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_SELECTED_PROJECT'; payload: string | null }
  | { type: 'START_TIME_TRACKING'; payload: { taskId: string } }
  | { type: 'STOP_TIME_TRACKING' }
  | { type: 'ADD_TIME_ENTRY'; payload: TimeEntry }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'SET_PROJECTS'; payload: Project[] };

const initialState: AppState = {
  theme: 'system',
  currentUser: null,
  tasks: [],
  projects: [],
  users: [],
  goals: [],
  timeEntries: [],
  activities: [],
  selectedProject: null,
  isTimeTracking: false,
  currentTrackingTask: null,
  trackingStartTime: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };

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
            userId: state.currentUser?.id || 'unknown',
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
    case 'UPDATE_USER':
      return {
        ...state,
        currentUser: action.payload,
        users: state.users.map(user =>
          user.id === action.payload.id ? action.payload : user
        )
      };

    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };

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

  // Fetch user to get User information
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await userApi.getProfile();
          const userData = response.data;

          // Map data từ backend về format User của fontend
          const user: User = {
            id: userData.id,
            name: userData.fullName,
            email: userData.email,
            avatar: userData.avatarUrl || '',
            role: userData.role || 'Member',
          };
          dispatch({ type: 'SET_CURRENT_USER', payload: user });
        } catch (error) {
          console.error(error);
        }
      }
    }
    fetchUser();
  }, []);

  // Fetch Workspaces (Mapped to Projects)
  useEffect(() => {
    const fetchWorkspaces = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await workspaceApi.getMyWorkspaces();
          const workspaces = response.data;
          if (workspaces && workspaces.length > 0) {
            // Use the first workspace for now
            const firstWorkspace = workspaces[0];
            if (firstWorkspace.spaces) {
              const mappedProjects: Project[] = firstWorkspace.spaces.map((space: any) => ({
                id: space.spaceId.toString(),
                name: space.name,
                description: space.description || '',
                color: space.color || '#808080',
                members: [], // Phase 2: fetch members
                lists: [],   // Phase 2: fetch lists
                progress: 0,
                totalTasks: 0,
                completedTasks: 0
              }));
              dispatch({ type: 'SET_PROJECTS', payload: mappedProjects });
            }
          }
        } catch (error) {
          console.error("Failed to fetch workspaces", error);
        }
      }
    };
    fetchWorkspaces();
  }, []);

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