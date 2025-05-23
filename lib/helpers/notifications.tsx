
// Map backend activity types to UI notification types
import {Activity,ActivityType, Notification, UINotificationType} from "@/lib/types/notification";

const mapActivityTypeToUIType = (activityType: ActivityType): UINotificationType => {
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
const generateTitle = (activity: Activity, dictionary?: any): string => {
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
const generateDescription = (activity: Activity, dictionary?: any): string => {
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

// Generate navigation link
export const generateLink = (activity: Activity): string => {
    switch (activity.activity_type) {
        case "task_created":
        case "task_completed":
        case "task_updated":
        case "task_deleted":
            return "/dashboard/tasks"
        case "expense_added":
        case "expense_approved":
        case "expense_updated":
        case "expense_deleted":
            return "/dashboard/expenses"
        case "inventory_added":
        case "inventory_updated":
        case "inventory_deleted":
            return "/dashboard/inventory"
        default:
            return "/dashboard"
    }
}

// Convert backend activity to UI notification
export const convertToNotification = (activity: Activity, dictionary?: any): Notification => {
    return {
        id: activity.id.toString(),
        title: generateTitle(activity, dictionary),
        description: generateDescription(activity, dictionary),
        time: activity.created_at,
        type: mapActivityTypeToUIType(activity.activity_type),
        read: activity.is_read,
        link: generateLink(activity),
        details: generateDetails(activity, dictionary),
        project: activity.project,
        task: activity.task,
        expense: activity.expense,
        metadatas: activity.metadatas,
        activity_type: activity.activity_type,
    }
}

// Mock data for development (replace with actual API calls)
export const MOCK_BACKEND_ACTIVITIES: Activity[] = [
    {
        id: 1,
        activity_type: "task_created",
        title_project: "Modern Residential Complex",
        is_read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        project: { id: 1, title: "Modern Residential Complex" },
        task: { id: 1, title: "Foundation excavation" },
        metadatas: { assigned_to: "John Doe", priority: "high" },
    },
    {
        id: 2,
        activity_type: "expense_added",
        title_project: "Commercial Office Renovation",
        is_read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        project: { id: 2, title: "Commercial Office Renovation" },
        expense: { id: 1, title: "Construction materials" },
        metadatas: { amount: 15000, currency: "USD", category: "materials" },
    },
    {
        id: 3,
        activity_type: "task_completed",
        title_project: "Eco-Friendly School Building",
        is_read: true,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        project: { id: 3, title: "Eco-Friendly School Building" },
        task: { id: 2, title: "Foundation work" },
        metadatas: { completed_by: "Maria Rodriguez", duration_hours: 48 },
    },
    {
        id: 4,
        activity_type: "inventory_updated",
        title_project: "Hospital Wing Addition",
        is_read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        project: { id: 4, title: "Hospital Wing Addition" },
        metadatas: { item_name: "Kitchen cabinets", status: "delayed", delay_days: 3 },
    },
    {
        id: 5,
        activity_type: "expense_approved",
        title_project: "Modern Residential Complex",
        is_read: true,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        project: { id: 1, title: "Modern Residential Complex" },
        expense: { id: 2, title: "Electrical equipment" },
        metadatas: { approved_by: "Project Manager", amount: 8500, currency: "USD" },
    },
]
