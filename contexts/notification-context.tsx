"use client"

import type React from "react"
import {createContext, useCallback, useContext, useEffect, useState} from "react"
import {Activity, ActivityType, Notification, UINotificationType} from "@/lib/types/notification";
import {fetchNotificationsBD} from "@/app/actions/notifications";
import {getTokenFromStorage} from "@/contexts/UserProvider";
import Swal from 'sweetalert2';

interface NotificationContextType {
    notifications: Notification[]
    loading: boolean
    error: string | null
    markAsRead: (id: string) => void
    markAllAsRead: () => void
    selectedNotification: Notification | null
    setSelectedNotification: (notification: Notification | null) => void
    refreshNotifications: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

// Map backend activity types to UI notification types
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
const generateDetails = (activity: Activity, dictionary?: any): string => {
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
const generateLink = (activity: Activity): string => {
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
const convertToNotification = (activity: Activity, dictionary?: any): Notification => {
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

interface NotificationProviderProps {
    children: React.ReactNode
    dictionary?: any
}

export function NotificationProvider({ children, dictionary }: NotificationProviderProps) {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)

    // Fetch notifications from backend
    const fetchNotifications = useCallback(async () => {
        setLoading(true)
        try {
            const response = await fetchNotificationsBD(getTokenFromStorage())

            if (response.statusCode !== 200) {
                throw new Error(response.message || "Failed to fetch notifications")
            }
            const activities: Activity[] = response.data.activities || []
            // For now, use mock data
            //await new Promise((resolve) => setTimeout(resolve, 1000))
            const convertedNotifications = activities.map((activity) =>
                convertToNotification(activity, dictionary))

            setNotifications(convertedNotifications)
            setError(null)
        } catch (err) {
            setError(dictionary.notifications.failedToLoad || "Failed to load notifications")
            console.error("Error fetching notifications:", err)
        } finally {
            setLoading(false)
        }
    }, [])

    // Initial fetch
    useEffect(() => {
        fetchNotifications()
    }, [fetchNotifications])

    // Mark notification as read
    const markAsRead = useCallback(async (id: string) => {
        try {
            // TODO: Replace with actual API call
            // await fetch(`/api/activities/${id}/read`, { method: 'PATCH' })

            // For now, simulate API call
            await new Promise((resolve) => setTimeout(resolve, 50))

            setNotifications((prev) =>
                prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
            )
        } catch (err) {
            console.error("Error marking notification as read:", err)
        }
    }, [])

    // Mark all notifications as read
    const markAllAsRead = useCallback(async () => {
        try {
            // TODO: Replace with actual API call
            // await fetch('/api/activities/read-all', { method: 'PATCH' })

            // For now, simulate API call
            await new Promise((resolve) => setTimeout(resolve, 100))

            setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
        } catch (err) {
            console.error("Error marking all notifications as read:", err)
        }
    }, [])

    // Función para mostrar errores
    const showErrorAlert = useCallback((errorMessage: string) => {
        Swal.fire({
            title: dictionary?.common?.errorTitle || 'Error',
            text: errorMessage,
            icon: 'error',
            confirmButtonText: dictionary?.common.acept || 'Aceptar',
            footer: dictionary?.notifications?.urgentHelp || 'Si es urgente, contacte a soporte inmediatamente'
        });
    }, [dictionary]);

    // Efecto para mostrar errores cuando cambien
    useEffect(() => {
        if (error) {
            showErrorAlert(error);
        }
    }, [error, showErrorAlert]);

    const value = {
        notifications,
        loading,
        error,
        markAsRead,
        markAllAsRead,
        selectedNotification,
        setSelectedNotification,
        refreshNotifications: fetchNotifications,
    }

    return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export const useNotifications = () => {
    const context = useContext(NotificationContext)
    if (context === undefined) {
        throw new Error("useNotifications must be used within a NotificationProvider")
    }
    return context
}
