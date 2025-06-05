
// Backend types matching your ActivityOut model
import type React from "react";

export interface ActivityItemProps {
    id: string
    icon?: React.ReactNode
    title: string
    description: string
    time: string
    type: "info" | "warning" | "error" | "success" | "update"
    read: boolean
    onClick?: (id: string) => void
}
export type ActivityType =
    | "task_created" | "task_updated" | "task_completed" | "task_deleted"
    | "expense_added" | "expense_updated" | "expense_approved" | "expense_deleted"
    | "inventory_added" | "inventory_updated" | "inventory_deleted"

export interface BasicInfo {
    id: number
    title: string
}

export interface Activity {
    id: number
    activity_type: ActivityType
    title_project: string
    is_read: boolean
    created_at: string // ISO string
    project: BasicInfo
    task?: BasicInfo
    expense?: BasicInfo
    inventory_item?: BasicInfo
    metadatas: {

        // Data Updated
        changes?: {
            [key: string]: {
                old: any
                new: any
            }
        }

        // Task created
        assignee?: string
        due_date?: string
        task_title?: string

        // Task deleted
        deleted_task?: {
            id: number
            title: string
            status: string
        }

        // Expense added
        id?: number
        date?: string
        title?: string
        amount?: number
        status?: string
        category?: string
        description?: string

        // Expense deleted
        deleted_expense?: {
            id: number
            title: string
            amount: number
            category: string
        }

        // Inventory added
        unit?: string
        quantity?: number
        item_name?: string
        unit_cost?: number

        // Inventory deleted
        deleted_item?: {
            name: string
            unit: string
            used: number
            total: number
            unit_cost: number
        }
    }
}

// UI types for display
export type UINotificationType = "info" | "warning" | "error" | "success" | "update"

export interface Notification {
    id: string
    title: string
    description: string
    time: string // ISO string
    type: UINotificationType
    read: boolean
    icon?: React.ReactNode
    link?: string
    details?: string
    project: BasicInfo
    task?: BasicInfo
    expense?: BasicInfo
    metadatas: Record<string, any>
    activity_type: ActivityType
}

