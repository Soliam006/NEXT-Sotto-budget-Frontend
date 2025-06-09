"use client"

import type React from "react"
import {createContext, useCallback, useContext, useEffect, useState} from "react"
import {Activity, Notification } from "@/lib/types/notification";
import {fetchNotificationsBD} from "@/app/actions/notifications";
import {getTokenFromStorage, useUser} from "@/contexts/UserProvider";
import {generateTitle, generateDescription, mapActivityTypeToUIType, generateDetails} from "@/lib/helpers/notifications";
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

// Genera el enlace de navegación incluyendo el parámetro de idioma
const generateLink = (activity: Activity): string => {

    const prefix = "/es"
    switch (activity.activity_type) {
        case "task_created":
        case "task_completed":
        case "task_updated":
        case "task_deleted":
            return `${prefix}/dashboard/tasks`;
        case "expense_added":
        case "expense_approved":
        case "expense_updated":
        case "expense_deleted":
            return `${prefix}/dashboard/expenses`;
        case "inventory_added":
        case "inventory_updated":
        case "inventory_deleted":
            return `${prefix}/dashboard/inventory`;
        default:
            return `${prefix}/dashboard`;
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
    const { user, token } = useUser(); // <-- Obtener user y token del UserProvider

    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)

    // Fetch notifications from backend
    const fetchNotifications = useCallback(async () => {
        setLoading(true)
        try {
            const response = await fetchNotificationsBD(getTokenFromStorage())

            if (response.statusCode === 500) {
                console.log("Error fetching notifications:", response)
                throw new Error(response.message || "Failed to fetch notifications")
            }
            if(!response.data){
                console.log("No notifications found")
                setNotifications([])
                return
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
        if(!user?.id || !token) return // Ensure user and token are available
        fetchNotifications()
    }, [user?.id, token])

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
