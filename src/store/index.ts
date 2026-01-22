import { create } from 'zustand';
import type { Client, Project, Ticket, ProjectStage } from '@/types';
import { MOCK_CLIENTS, MOCK_PROJECTS, MOCK_TICKETS } from '@/lib/mockData';

interface FormSubmission {
    id: string;
    clientId: string;
    type: 'project_request' | 'feedback' | 'general';
    data: Record<string, any>;
    submittedAt: string;
    status: 'pending' | 'reviewed' | 'archived';
}

interface AppState {
    // Data
    clients: Client[];
    projects: Project[];
    tickets: Ticket[];
    submissions: FormSubmission[];

    // Auth
    isAdminLoggedIn: boolean;
    currentClientId: string | null; // If client logged in

    // Actions
    loginAdmin: (password: string) => boolean;
    logoutAdmin: () => void;

    loginClient: (assignedId: string) => boolean;
    logoutClient: () => void;

    addClient: (client: Client) => void;
    updateClient: (clientId: string, data: Partial<Client>) => void;
    deleteClient: (clientId: string) => void;
    
    addProject: (project: Project) => void;
    updateProject: (projectId: string, data: Partial<Project>) => void;
    updateProjectProgress: (projectId: string, stageName: ProjectStage, progress: number) => void;
    markProjectComplete: (projectId: string) => void;
    
    addTicket: (ticket: Ticket) => void;
    updateTicketStatus: (ticketId: string, status: Ticket['status']) => void;
    respondToTicket: (ticketId: string, response: string) => void;
    
    addSubmission: (submission: FormSubmission) => void;
    updateSubmissionStatus: (submissionId: string, status: FormSubmission['status']) => void;
}

export const useStore = create<AppState>((set, get) => ({
    clients: MOCK_CLIENTS,
    projects: MOCK_PROJECTS,
    tickets: MOCK_TICKETS,
    submissions: [],

    isAdminLoggedIn: false,
    currentClientId: null,

    loginAdmin: (password) => {
        if (password === 'admin123') {
            set({ isAdminLoggedIn: true });
            return true;
        }
        return false;
    },

    logoutAdmin: () => set({ isAdminLoggedIn: false }),

    loginClient: (assignedId) => {
        const client = get().clients.find(c => c.assignedId === assignedId);
        if (client) {
            set({ currentClientId: client.id });
            return true;
        }
        return false;
    },

    logoutClient: () => set({ currentClientId: null }),

    addClient: (client) => set((state) => ({ clients: [...state.clients, client] })),
    
    updateClient: (clientId, data) => set((state) => ({
        clients: state.clients.map(c => c.id === clientId ? { ...c, ...data } : c)
    })),
    
    deleteClient: (clientId) => set((state) => ({
        clients: state.clients.filter(c => c.id !== clientId),
        projects: state.projects.filter(p => p.clientId !== clientId),
        tickets: state.tickets.filter(t => t.clientId !== clientId)
    })),

    addProject: (project) => set((state) => {
        // Also update client's projectIds
        const clients = state.clients.map(c => 
            c.id === project.clientId 
                ? { ...c, projectIds: [...c.projectIds, project.id] }
                : c
        );
        return { projects: [...state.projects, project], clients };
    }),
    
    updateProject: (projectId, data) => set((state) => ({
        projects: state.projects.map(p => p.id === projectId ? { ...p, ...data } : p)
    })),

    updateProjectProgress: (projectId, stageName, progress) => set((state) => {
        const projects = state.projects.map(p => {
            if (p.id !== projectId) return p;

            const newStages = p.stages.map(s => {
                if (s.name === stageName) {
                    return { ...s, completionPercentage: progress, status: progress === 100 ? 'completed' : progress > 0 ? 'in-progress' : 'pending' } as const;
                }
                return s;
            });

            const total = newStages.reduce((acc, s) => acc + s.completionPercentage, 0) / newStages.length;
            const isCompleted = newStages.every(s => s.completionPercentage === 100);

            return { ...p, stages: newStages, totalProgress: Math.round(total), isCompleted };
        });
        return { projects };
    }),
    
    markProjectComplete: (projectId) => set((state) => ({
        projects: state.projects.map(p => {
            if (p.id !== projectId) return p;
            const completedStages = p.stages.map(s => ({
                ...s,
                status: 'completed' as const,
                completionPercentage: 100
            }));
            return { ...p, stages: completedStages, totalProgress: 100, isCompleted: true, endDate: new Date().toISOString() };
        })
    })),

    addTicket: (ticket) => set((state) => ({ tickets: [...state.tickets, ticket] })),

    updateTicketStatus: (ticketId, status) => set((state) => ({
        tickets: state.tickets.map(t => t.id === ticketId ? { ...t, status, updatedAt: new Date().toISOString() } : t)
    })),
    
    respondToTicket: (ticketId, response) => set((state) => ({
        tickets: state.tickets.map(t => t.id === ticketId ? { ...t, response, status: 'resolved', updatedAt: new Date().toISOString() } : t)
    })),
    
    addSubmission: (submission) => set((state) => ({ submissions: [...state.submissions, submission] })),
    
    updateSubmissionStatus: (submissionId, status) => set((state) => ({
        submissions: state.submissions.map(s => s.id === submissionId ? { ...s, status } : s)
    })),
}));
