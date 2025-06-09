
export interface Task {
    id: number
    title: string
    description: string
    assignee: string
    worker_id: number
    status: "todo" | "in_progress" | "done"
    created_at: string
    updated_at: string
    due_date: string
}


export interface TaskBackend {
    id: number
    title: string
    description: string
    assignee: string
    worker_id: number
    status: "todo" | "in_progress" | "done"
    created_at: string
    updated_at: string
    due_date: string
    deleted?: boolean
    updated?: boolean
    created?: boolean
}