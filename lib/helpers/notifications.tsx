
// Map backend activity types to UI notification types
import {Activity,ActivityType, Notification, UINotificationType} from "@/lib/types/notification";

export const mapActivityTypeToUIType = (activityType: ActivityType): UINotificationType => {
    switch (activityType) {
        case "task_completed":
        case "expense_approved":
            return "success"
        case "task_deleted":
        case "expense_deleted":
        case "inventory_deleted":
            return "error"
        case "expense_added":
        case "expense_updated":
            return "warning"
        case "task_created":
        case "task_updated":
        case "inventory_added":
        case "inventory_updated":
            return "update"
        default:
            return "info"
    }
}

// Generate title based on activity type
export const generateTitle = (activity: Activity, dictionary?: any): string => {
    const dict = dictionary?.notifications || {}

    switch (activity.activity_type) {
        case "task_created":
            return dict.taskCreated || "New task created"
        case "task_completed":
            return dict.taskCompleted || "Task completed"
        case "task_updated":
            return dict.taskUpdated || "Task updated"
        case "task_deleted":
            return dict.taskDeleted || "Task deleted"
        case "expense_added":
            return dict.expenseAdded || "New expense added"
        case "expense_approved":
            return dict.expenseApproved || "Expense approved"
        case "expense_updated":
            return dict.expenseUpdated || "Expense updated"
        case "expense_deleted":
            return dict.expenseDeleted || "Expense deleted"
        case "inventory_added":
            return dict.inventoryAdded || "Inventory item added"
        case "inventory_updated":
            return dict.inventoryUpdated || "Inventory item updated"
        case "inventory_deleted":
            return dict.inventoryDeleted || "Inventory item deleted"
        default:
            return dict.activityUpdate || "Activity update"
    }
}

// Generate description based on activity type
export const generateDescription = (activity: Activity, dictionary?: any): string => {
    const dict = dictionary?.notifications || {}
    const itemName = activity.task?.title || activity.expense?.title || activity.metadatas?.item_name || ""
    const projectName = activity.title_project

    switch (activity.activity_type) {
        case "task_created":
            return `${dict.taskCreatedDesc || "Task"} "${itemName}" ${dict.createdInProject || "created in project"} "${projectName}"`
        case "task_completed":
            return `${dict.taskCompletedDesc || "Task"} "${itemName}" ${dict.completedInProject || "completed in project"} "${projectName}"`
        case "task_updated":
            return `${dict.taskUpdatedDesc || "Task"} "${itemName}" ${dict.updatedInProject || "updated in project"} "${projectName}"`
        case "task_deleted":
            return `${dict.taskDeletedDesc || "Task"} "${itemName}" ${dict.deletedFromProject || "deleted from project"} "${projectName}"`
        case "expense_added":
            return `${dict.expenseAddedDesc || "Expense"} "${itemName}" ${dict.addedToProject || "added to project"} "${projectName}"`
        case "expense_approved":
            return `${dict.expenseApprovedDesc || "Expense"} "${itemName}" ${dict.approvedInProject || "approved in project"} "${projectName}"`
        case "expense_updated":
            return `${dict.expenseUpdatedDesc || "Expense"} "${itemName}" ${dict.updatedInProject || "updated in project"} "${projectName}"`
        case "expense_deleted":
            return `${dict.expenseDeletedDesc || "Expense"} "${itemName}" ${dict.deletedFromProject || "deleted from project"} "${projectName}"`
        case "inventory_added":
            return `${dict.inventoryAddedDesc || "Item"} "${itemName}" ${dict.addedToInventory || "added to inventory for project"} "${projectName}"`
        case "inventory_updated":
            return `${dict.inventoryUpdatedDesc || "Item"} "${itemName}" ${dict.updatedInInventory || "updated in inventory for project"} "${projectName}"`
        case "inventory_deleted":
            return `${dict.inventoryDeletedDesc || "Item"} "${itemName}" ${dict.deletedFromInventory || "deleted from inventory for project"} "${projectName}"`
        default:
            return `${dict.activityInProject || "Activity in project"} "${projectName}"`
    }
}

// Generate detailed information
export const generateDetails = (activity: Activity, dictionary?: any): string => {
    const dict = dictionary?.notifications || {}
    let details = ""

    // Basic information
    details += `${dict.project || "Project"}: ${activity.title_project}\n`
    details += `${dict.activityType || "Activity Type"}: ${activity.activity_type}\n`
    details += `${dict.date || "Date"}: ${new Date(activity.created_at).toLocaleString()}\n\n`

    // Item-specific information
    if (activity.task) {
        details += `${dict.task || "Task"}: ${activity.task.title}\n`
    }

    if (activity.expense) {
        details += `${dict.expense || "Expense"}: ${activity.expense.title}\n`
    }

    // Metadata information
    if (activity.metadatas && Object.keys(activity.metadatas).length > 0) {
        details += `\n${dict.additionalInfo || "Additional Information"}:\n`
        Object.entries(activity.metadatas).forEach(([key, value]) => {
            details += `${key}: ${value}\n`
        })
    }

    return details
}