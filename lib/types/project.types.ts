import {Task, TaskBackend} from "@/lib/types/tasks";
import {Expenses, ExpensesBackend} from "@/lib/types/expenses";
import {InventoryItem, InventoryItemBackend} from "@/lib/types/inventory-item";
import {WorkerData, WorkerDataBackend} from "@/lib/types/user.types";

export interface Project {
    id: number
    title: string
    description: string
    admin: string
    limit_budget: number
    currentSpent: number
    progress: {
        done: number
        inProgress: number
        todo: number
    }
    location: string
    start_date: string
    end_date: string
    status: string
    clients_ids?: number[]
    clients?: {
        id: number
        name: string
        username: string
        role: string
        avatar?: string
    }[]
    tasks?: Task []
    team?: WorkerData[]
    expenses: Expenses[]
    expenseCategories?: {
        [key: string]: number
    }
    inventory: InventoryItem[]
}

export interface ProjectBackend {
    id: number
    title: string
    description: string
    limit_budget: number
    location: string
    start_date: string
    end_date: string
    status: string
    clients_ids?: number[]
    clients?: {
        id: number
        name: string
        username: string
        role: string
        avatar?: string
    }[]
    tasks?: TaskBackend []
    team?: WorkerDataBackend[]
    workers?: any
    expenses: ExpensesBackend[]
    inventory: InventoryItemBackend[]
}