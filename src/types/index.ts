export type ProjectStage =
    | 'Requirements Analysis'
    | 'Design & Prototyping'
    | 'Development'
    | 'Testing & QA'
    | 'Deployment'
    | 'Handover & Training';

export interface StageStatus {
    name: ProjectStage;
    status: 'pending' | 'in-progress' | 'completed';
    completionPercentage: number; // 0-100
    updatedAt?: string;
}

export interface Project {
    id: string;
    clientId: string;
    title: string;
    description: string;
    stages: StageStatus[];
    totalProgress: number; // Calculated from stages
    startDate: string;
    endDate?: string;
    isCompleted: boolean;
}

export interface Client {
    id: string;
    assignedId: string; // The unique ID for login (e.g., C-101)
    name: string;
    email: string;
    phone: string;
    companyName?: string;
    projectIds: string[];
    createdAt: string;
    submissions?: FormSubmission[];
}

export interface FormSubmission {
    id: string;
    clientId: string;
    submittedAt: string;
    data: Record<string, any>; // Flexible form data
}

export interface Ticket {
    id: string;
    clientId: string;
    projectId?: string;
    subject: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    status: 'open' | 'in-progress' | 'resolved';
    createdAt: string;
    updatedAt: string;
    response?: string;
}

export interface AdminUser {
    id: string;
    username: string; // e.g., 'admin'
    password?: string; // In real app, hashed. checking mock
    role: 'admin';
}
