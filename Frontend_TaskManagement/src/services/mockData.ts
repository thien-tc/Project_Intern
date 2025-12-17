export interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: string;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    status: 'todo' | 'in_progress' | 'review' | 'completed';
    priority: 'urgent' | 'high' | 'normal' | 'low';
    assignees: string[];
    watchers: string[];
    dueDate: string;
    startDate: string;
    tags: string[];
    subtasks: Subtask[];
    comments: Comment[];
    timeTracked: number; // in minutes
    estimatedTime: number; // in minutes
    sprintPoints: number;
    customFields: Record<string, string | number | boolean>;
    attachments: Attachment[];
    dependencies: string[];
    listId: string;
    projectId: string;
    createdAt: string;
    updatedAt: string;
}

export interface Subtask {
    id: string;
    title: string;
    completed: boolean;
    assigneeId?: string;
}

export interface Comment {
    id: string;
    content: string;
    authorId: string;
    createdAt: string;
    mentions: string[];
}

export interface Attachment {
    id: string;
    name: string;
    url: string;
    type: 'file' | 'link';
    size?: number;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    color: string;
    members: string[];
    lists: TaskList[];
    progress: number;
    totalTasks: number;
    completedTasks: number;
}

export interface TaskList {
    id: string;
    name: string;
    projectId: string;
    taskCount: number;
}

export interface Goal {
    id: string;
    title: string;
    description: string;
    progress: number;
    targetDate: string;
    linkedTasks: string[];
}

export interface TimeEntry {
    id: string;
    taskId: string;
    userId: string;
    description: string;
    duration: number; // in minutes
    date: string;
    billable: boolean;
}

// Mock Users
export const mockUsers: User[] = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
        role: 'Project Manager'
    },
    {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
        role: 'Developer'
    },
    {
        id: '3',
        name: 'Mike Johnson',
        email: 'mike@example.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
        role: 'Designer'
    }
];

// Mock Projects
export const mockProjects: Project[] = [
    {
        id: '1',
        name: 'Product Development',
        description: 'All product-related projects',
        color: '#3b82f6',
        members: ['1', '2', '3'],
        lists: [
            { id: '1', name: 'React Components', projectId: '1', taskCount: 3 },
            { id: '2', name: 'API Integration', projectId: '1', taskCount: 2 }
        ],
        progress: 65,
        totalTasks: 8,
        completedTasks: 5
    },
    {
        id: '2',
        name: 'Marketing',
        description: 'Marketing campaigns and content',
        color: '#10b981',
        members: ['1', '3'],
        lists: [
            { id: '3', name: 'Content Creation', projectId: '2', taskCount: 4 }
        ],
        progress: 40,
        totalTasks: 6,
        completedTasks: 2
    }
];

// Mock Tasks
export const mockTasks: Task[] = [
    {
        id: '1',
        title: 'Setup Authentication',
        description: 'Implement user authentication system with JWT tokens',
        status: 'in_progress',
        priority: 'urgent',
        assignees: ['1', '2'],
        watchers: ['3'],
        dueDate: '2024-01-15',
        startDate: '2024-01-10',
        tags: ['backend', 'security'],
        subtasks: [
            { id: '1', title: 'Setup JWT middleware', completed: true },
            { id: '2', title: 'Create login endpoint', completed: true },
            { id: '3', title: 'Add password hashing', completed: false }
        ],
        comments: [
            {
                id: '1',
                content: 'Started working on JWT implementation',
                authorId: '2',
                createdAt: '2024-01-10T10:00:00Z',
                mentions: ['1']
            }
        ],
        timeTracked: 240,
        estimatedTime: 480,
        sprintPoints: 8,
        customFields: {
            'Epic': 'User Management',
            'Environment': 'Development'
        },
        attachments: [
            {
                id: '1',
                name: 'auth-flow-diagram.png',
                url: '#',
                type: 'file',
                size: 1024000
            }
        ],
        dependencies: [],
        listId: '2',
        projectId: '1',
        createdAt: '2024-01-10T09:00:00Z',
        updatedAt: '2024-01-10T15:30:00Z'
    },
    {
        id: '2',
        title: 'Create Header Component',
        description: 'Design and implement the main header component',
        status: 'completed',
        priority: 'low',
        assignees: ['3'],
        watchers: ['1'],
        dueDate: '2024-01-12',
        startDate: '2024-01-08',
        tags: ['frontend', 'component'],
        subtasks: [
            { id: '4', title: 'Design mockup', completed: true },
            { id: '5', title: 'Implement component', completed: true },
            { id: '6', title: 'Add responsive design', completed: true }
        ],
        comments: [],
        timeTracked: 180,
        estimatedTime: 240,
        sprintPoints: 3,
        customFields: {
            'Component Type': 'Layout',
            'Browser Support': 'All modern browsers'
        },
        attachments: [],
        dependencies: [],
        listId: '1',
        projectId: '1',
        createdAt: '2024-01-08T09:00:00Z',
        updatedAt: '2024-01-12T16:00:00Z'
    },
    {
        id: '3',
        title: 'Write Product Launch Blog Post',
        description: 'Create engaging blog post for product launch',
        status: 'todo',
        priority: 'normal',
        assignees: ['2'],
        watchers: ['1', '3'],
        dueDate: '2024-01-20',
        startDate: '2024-01-15',
        tags: ['content', 'marketing'],
        subtasks: [
            { id: '7', title: 'Research competitors', completed: false },
            { id: '8', title: 'Write first draft', completed: false },
            { id: '9', title: 'Review and edit', completed: false }
        ],
        comments: [],
        timeTracked: 0,
        estimatedTime: 360,
        sprintPoints: 5,
        customFields: {
            'Content Type': 'Blog Post',
            'Target Audience': 'Developers'
        },
        attachments: [],
        dependencies: [],
        listId: '3',
        projectId: '2',
        createdAt: '2024-01-10T11:00:00Z',
        updatedAt: '2024-01-10T11:00:00Z'
    }
];

// Mock Goals
export const mockGoals: Goal[] = [
    {
        id: '1',
        title: 'Complete Q1 Development',
        description: 'Finish all planned development tasks for Q1',
        progress: 65,
        targetDate: '2024-03-31',
        linkedTasks: ['1', '2']
    }
];

// Mock Time Entries
export const mockTimeEntries: TimeEntry[] = [
    {
        id: '1',
        taskId: '1',
        userId: '2',
        description: 'Working on JWT implementation',
        duration: 120,
        date: '2024-01-10',
        billable: true
    },
    {
        id: '2',
        taskId: '1',
        userId: '2',
        description: 'Testing authentication flow',
        duration: 90,
        date: '2024-01-10',
        billable: true
    }
];

// Activity Feed
export interface Activity {
    id: string;
    type: 'task_created' | 'task_updated' | 'task_completed' | 'comment_added';
    userId: string;
    taskId: string;
    description: string;
    timestamp: string;
    priority?: 'urgent' | 'high' | 'normal' | 'low';
}

export const mockActivities: Activity[] = [
    {
        id: '1',
        type: 'task_created',
        userId: '2',
        taskId: '3',
        description: 'created task "Write Product Launch Blog Post"',
        timestamp: '2024-01-10T11:00:00Z',
        priority: 'normal'
    },
    {
        id: '2',
        type: 'task_updated',
        userId: '1',
        taskId: '1',
        description: 'created task "Setup Authentication"',
        timestamp: '2024-01-10T10:30:00Z',
        priority: 'urgent'
    },
    {
        id: '3',
        type: 'task_created',
        userId: '1',
        taskId: '2',
        description: 'created task "Create Header Component"',
        timestamp: '2024-01-10T10:00:00Z',
        priority: 'low'
    }
];