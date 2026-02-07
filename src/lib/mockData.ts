import type { Client, Project, Ticket } from "@/types";

export const MOCK_CLIENTS: Client[] = [
    {
        id: "1",
        assignedId: "RED-001",
        name: "John Doe",
        email: "john@example.com",
        phone: "123-456-7890",
        companyName: "Tech Corp",
        projectIds: ["p1"],
        createdAt: new Date().toISOString(),
    },
    {
        id: "2",
        assignedId: "RED-002",
        name: "Jane Smith",
        email: "jane@design.studio",
        phone: "987-654-3210",
        companyName: "Design Studio",
        projectIds: ["p2"],
        createdAt: new Date().toISOString(),
    }
];

export const MOCK_PROJECTS: Project[] = [
    {
        id: "p1",
        clientId: "1",
        title: "E-commerce Platform Redesign",
        description: "Complete overhaul of the legacy web store.",
        stages: [
            { name: 'Requirements Analysis', status: 'completed', completionPercentage: 100 },
            { name: 'Design & Prototyping', status: 'in-progress', completionPercentage: 60 },
            { name: 'Development', status: 'pending', completionPercentage: 0 },
            { name: 'Testing & QA', status: 'pending', completionPercentage: 0 },
            { name: 'Deployment', status: 'pending', completionPercentage: 0 },
            { name: 'Handover & Training', status: 'pending', completionPercentage: 0 },
        ],
        totalProgress: 26, // (100 + 60) / 600 * 100 roughly
        startDate: new Date().toISOString(),
        isCompleted: false,
    },
    {
        id: "p2",
        clientId: "2",
        title: "Portfolio Website",
        description: "Personal portfolio for photography.",
        stages: [
            { name: 'Requirements Analysis', status: 'completed', completionPercentage: 100 },
            { name: 'Design & Prototyping', status: 'completed', completionPercentage: 100 },
            { name: 'Development', status: 'completed', completionPercentage: 100 },
            { name: 'Testing & QA', status: 'completed', completionPercentage: 100 },
            { name: 'Deployment', status: 'completed', completionPercentage: 100 },
            { name: 'Handover & Training', status: 'completed', completionPercentage: 100 },
        ],
        totalProgress: 100,
        startDate: new Date(Date.now() - 10000000).toISOString(),
        isCompleted: true,
    }
];

export const MOCK_TICKETS: Ticket[] = [
    {
        id: "t1",
        clientId: "2",
        projectId: "p2",
        subject: "Image Gallery Loading Issue",
        description: "Images take too long to load on mobile.",
        priority: "medium",
        status: "open",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
];
