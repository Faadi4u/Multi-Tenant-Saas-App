import { z } from "zod";

export const createProjectSchema = z.object({
    body: z.object({
        name: z.string().min(2),
        description: z.string().optional(),
    }),
});

export const createTaskSchema = z.object({
    body: z.object({
        title: z.string().min(2),
        projectId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Project ID"),
        status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
        priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
        assignedTo: z.string().optional(),
    }),
});