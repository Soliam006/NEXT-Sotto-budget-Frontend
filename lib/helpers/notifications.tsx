
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
        case "task_created":
        case "inventory_added":
            return "info"
        case "expense_updated":
        case "task_updated":
        case "inventory_updated":
            return "warning"
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
    const itemName = getItemName(activity)
    const projectName = activity.title_project

    const actionMap = {
        task_created:  `${dict.taskCreatedDesc || "Task"} "${itemName}" ${dict.createdInProject || "created in project"} "${projectName}"`,
        task_completed: `${dict.taskCompletedDesc || "Task"} "${itemName}" ${dict.completedInProject || "completed in project"} "${projectName}"`,
        task_updated:  `${dict.taskUpdatedDesc || "Task"} "${itemName}" ${dict.updatedInProject || "updated in project"} "${projectName}"`,
        task_deleted:  `${dict.taskDeletedDesc || "Task"} "${itemName}" ${dict.deletedFromProject || "deleted from project"} "${projectName}"`,
        expense_added:  `${dict.expenseAddedDesc || "Expense"} "${itemName}" ${dict.addedInProject || "added in project"} "${projectName}"`,
        expense_approved: `${dict.expenseApprovedDesc || "Expense"} "${itemName}" ${dict.approvedInProject || "approved in project"} "${projectName}"`,
        expense_updated:  `${dict.expenseUpdatedDesc || "Expense"} "${itemName}" ${dict.updatedInProject || "updated in project"} "${projectName}"`,
        expense_deleted:  `${dict.expenseDeletedDesc || "Expense"} "${itemName}" ${dict.deletedFromProject || "deleted from project"} "${projectName}"`,
        inventory_added:  `${dict.inventoryAddedDesc || "Item"} "${itemName}" ${dict.addedInProject || "added in project"} "${projectName}"`,
        inventory_updated:  `${dict.inventoryUpdatedDesc || "Item"} "${itemName}" ${dict.updatedInProject || "updated in project"} "${projectName}"`,
        inventory_deleted:  `${dict.inventoryDeletedDesc || "Item"} "${itemName}" ${dict.deletedFromProject || "deleted from project"} "${projectName}"`
    }

    const defaultDescription = dict.activityInProject || "Activity in project"

    return `${actionMap[activity.activity_type] || defaultDescription} "${projectName}"`
}

const getItemName = (activity: Activity): string => {
    if (activity.metadatas) {
        return activity.metadatas.task_title ||
            activity.metadatas.title ||
            activity.metadatas.item_name ||
            activity.metadatas.deleted_task?.title ||
            activity.metadatas.deleted_expense?.title ||
            activity.metadatas.deleted_item?.name ||
            ""
    }
    return ""
}

// Generate detailed information
export const generateDetails = (activity: Activity, dictionary?: any): string => {
    const dict = dictionary?.notifications || {}
    let details = []

    // Información básica
    details.push(`${dict.project || "Project"}: ${activity.title_project}`)
    details.push(`${dict.activityType || "Activity Type"}: ${activity.activity_type}`)

    // Manejo específico por tipo de actividad
    switch (activity.activity_type) {
        case "task_created":
            details.push(`${dict.task || "Task"}: ${activity.metadatas?.title}`)
            details.push(`${dict.assignee || "Assignee"}: ${activity.metadatas?.assignee}`)
            details.push(`${dict.dueDate || "Due Date"}: ${formatDate(activity.metadatas?.due_date ?? "")}`)
            break

        case "task_updated":
            addDetailsChanges (activity, details, dict)
            break

        case "task_deleted":
            details.push(`${dict.deletedTask || "Deleted Task"}: ${activity.metadatas?.deleted_task?.title}`)
            details.push(`${dict.status || "Status"}: ${activity.metadatas?.deleted_task?.status}`)
            break

        case "expense_added":
            details.push(`${dict.title || "Title"}: ${activity.metadatas?.title}`)
            details.push(`${dict.amount || "Amount"}: ${activity.metadatas?.amount}`)
            details.push(`${dict.category || "Category"}: ${activity.metadatas?.category}`)
            details.push(`${dict.date || "Date"}: ${formatDate(activity.metadatas?.date ?? "")}`)
            break
        case "expense_updated":
            addDetailsChanges (activity, details, dict)
            break
        case "expense_deleted":
            details.push(`${dict.deletedExpense || "Deleted Expense"}: ${activity.metadatas?.deleted_expense?.title}`)
            details.push(`${dict.amount || "Amount"}: ${activity.metadatas?.deleted_expense?.amount}`)
            details.push(`${dict.category || "Category"}: ${activity.metadatas?.deleted_expense?.category}`)
            break

        case "inventory_added":
            details.push(`${dict.itemName || "Item"}: ${activity.metadatas?.title}`)
            details.push(`${dict.quantity || "Quantity"}: ${activity.metadatas?.quantity}`)
            details.push(`${dict.unit || "Unit"}: ${activity.metadatas?.unit}`)
            details.push(`${dict.unitCost || "Unit Cost"}: ${activity.metadatas?.unit_cost}`)
            break

        case "inventory_updated":
            addDetailsChanges (activity, details, dict)
            break

        case "inventory_deleted":
            details.push(`${dict.deletedItem || "Deleted Item"}: ${activity.metadatas?.deleted_item?.name}`)
            details.push(`${dict.quantity || "Quantity"}: ${activity.metadatas?.deleted_item?.total}`)
            details.push(`${dict.unit || "Unit"}: ${activity.metadatas?.deleted_item?.unit}`)
            details.push(`${dict.unitCost || "Unit Cost"}: ${activity.metadatas?.deleted_item?.unit_cost}`)
            break
    }

    return details.join('\n')
}
const addDetailsChanges = (activity: Activity, details: string[], dict: any) => {
    if (activity.metadatas?.changes) {
        details.push(`${dict.changes || "Changes"}:`)
        Object.entries(activity.metadatas.changes).forEach(([field, change]) => {
            const fieldLabel = `${field.charAt(0).toUpperCase() + field.slice(1)}`
            details.push(`${fieldLabel}: ${change.old} → ${change.new}`)
        })
    }
}

// Función auxiliar para formatear fechas
const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}


// Format relative time
export const formatRelativeTime = (dateString: string, dictionary: any): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
        return `${diffInSeconds}s ago`
    } else if (diffInSeconds < 3600) {
        const diffInMinutes = Math.floor(diffInSeconds / 60)
        return dictionary.time?.minutesAgo?.replace("{minutes}", diffInMinutes.toString()) || `${diffInMinutes}m ago`
    } else if (diffInSeconds < 86400) {
        const diffInHours = Math.floor(diffInSeconds / 3600)
        return dictionary.time?.hoursAgo?.replace("{hours}", diffInHours.toString()) || `${diffInHours}h ago`
    } else if (diffInSeconds < 604800) {
        const diffInDays = Math.floor(diffInSeconds / 86400)
        return dictionary.time?.daysAgo?.replace("{days}", diffInDays.toString()) || `${diffInDays}d ago`
    } else {
        return date.toLocaleDateString()
    }
}