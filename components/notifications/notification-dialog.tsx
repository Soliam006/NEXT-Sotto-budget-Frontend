"use client"

import { useState, useEffect } from "react"
import { Bell, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ActivityItem } from "./activity-item"
import { useNotifications } from "@/contexts/notification-context"
import { CheckCircle2, AlertCircle, Info, Activity } from "lucide-react"

// Helper functions for notification styling
const getNotificationTypeStyles = (type: string) => {
    switch (type) {
        case "info":
            return { bgColor: "bg-blue-500/10 border-blue-500/30", iconColor: "text-blue-500" }
        case "warning":
            return { bgColor: "bg-yellow-500/10 border-yellow-500/30", iconColor: "text-yellow-500" }
        case "error":
            return { bgColor: "bg-red-500/10 border-red-500/30", iconColor: "text-red-500" }
        case "success":
            return { bgColor: "bg-green-500/10 border-green-500/30", iconColor: "text-green-500" }
        case "update":
            return { bgColor: "bg-cyan-500/10 border-cyan-500/30", iconColor: "text-cyan-500" }
        default:
            return { bgColor: "bg-gray-500/10 border-gray-500/30", iconColor: "text-gray-500" }
    }
}

const getNotificationTypeIcon = (type: string) => {
    const styles = getNotificationTypeStyles(type)
    switch (type) {
        case "info":
            return <Info className={`h-4 w-4 ${styles.iconColor}`} />
        case "warning":
            return <AlertCircle className={`h-4 w-4 ${styles.iconColor}`} />
        case "error":
            return <AlertCircle className={`h-4 w-4 ${styles.iconColor}`} />
        case "success":
            return <CheckCircle2 className={`h-4 w-4 ${styles.iconColor}`} />
        case "update":
            return <Activity className={`h-4 w-4 ${styles.iconColor}`} />
        default:
            return <Bell className={`h-4 w-4 ${styles.iconColor}`} />
    }
}

interface NotificationDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    dictionary: any
}

export function NotificationDialog({ open, onOpenChange, dictionary }: NotificationDialogProps) {
    const { notifications, markAsRead, markAllAsRead, selectedNotification, setSelectedNotification } = useNotifications()
    const [activeTab, setActiveTab] = useState<string>("all")

    // Reset selected notification when dialog closes
    useEffect(() => {
        if (!open) {
            setSelectedNotification(null)
        }
    }, [open, setSelectedNotification])

    const unreadCount = notifications.filter((n) => !n.read).length
    const allNotifications = notifications
    const unreadNotifications = notifications.filter((n) => !n.read)

    const handleNotificationClick = (id: string) => {
        const notification = notifications.find((n) => n.id === id)
        if (notification) {
            setSelectedNotification(notification)
            markAsRead(id)
        }
    }

    // Format relative time
    const formatRelativeTime = (dateString: string) => {
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className={
                `sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] xl:max-w-[60vw] 
            ${selectedNotification ? "w-full max-w-[95vw] h-[95vh]" : ""} 
            max-h-[95vh] flex flex-col`
            }>
            { /* If a notification is selected, show its details */ }
            {selectedNotification ? (
                <div className="flex flex-col h-full">
                    {/* Header */}

                    {/* Content - Scrollable area */}
                    <ScrollArea className="max-h-[75vh] flex-1">
                    <div className="flex items-center justify-between p-4 md:p-6 border-b border-border/50">
                        <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-full ${getNotificationTypeStyles(selectedNotification.type).bgColor}`}>
                                {getNotificationTypeIcon(selectedNotification.type)}
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-semibold">
                                    {dictionary.notifications?.detail || "Notification Detail"}
                                </DialogTitle>
                                <p className="text-sm text-muted-foreground">{formatRelativeTime(selectedNotification.time)}</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedNotification(null)}
                            className="h-8 w-8 hover:bg-secondary/80"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                        <div className="p-4 md:p-6 space-y-6">
                            {/* Main notification card */}
                            <div className="bg-gradient-to-r from-secondary/30 to-secondary/10 rounded-lg p-4 border border-border/50">
                                <h3 className="font-semibold text-base mb-2">{selectedNotification.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{selectedNotification.description}</p>
                            </div>

                            {/* Details section */}
                            {selectedNotification.details && selectedNotification.details !== selectedNotification.description && (
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <div className="h-px bg-gradient-to-r from-border to-transparent flex-1" />
                                        <h4 className="text-sm font-medium text-muted-foreground px-3">
                                            {dictionary.notifications?.details || "Details"}
                                        </h4>
                                        <div className="h-px bg-gradient-to-l from-border to-transparent flex-1" />
                                    </div>
                                    <div className="bg-muted/30 rounded-lg p-4 border border-border/30">
                                        <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
                                            {selectedNotification.details}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Metadata */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-card/50 rounded-lg p-3 border border-border/30">
                                    <p className="text-xs text-muted-foreground mb-1">
                                        {dictionary.notifications?.activityType || "Type"}
                                    </p>
                                    <p className="text-sm font-medium capitalize">{selectedNotification.type}</p>
                                </div>
                                <div className="bg-card/50 rounded-lg p-3 border border-border/30">
                                    <p className="text-xs text-muted-foreground mb-1">{dictionary.notifications?.date || "Date"}</p>
                                    <p className="text-sm font-medium">{new Date(selectedNotification.time).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>

                    {/* Footer */}
                    {selectedNotification.link && (
                        <div className="p-4 md:p-6 border-t border-border/50 bg-secondary/20">
                            <Button
                                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg"
                                onClick={() => {
                                    window.location.href = selectedNotification.link!
                                    onOpenChange(false)
                                }}
                            >
                                <Bell className="mr-2 h-4 w-4" />
                                {dictionary.notifications?.viewRelated || "View Related Content"}
                            </Button>
                        </div>
                    )}
                </div>
            ) : (
                // List of notifications
                <>
                    <DialogHeader>
                        <div className="flex items-center justify-between">
                            <DialogTitle className="text-xl flex items-center">
                                <Bell className="mr-2 h-5 w-5 text-cyan-500" />
                                {dictionary.notifications?.title || "Notifications"}
                            </DialogTitle>
                            {unreadCount > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={markAllAsRead}
                                    className="text-xs text-cyan-400 hover:text-cyan-300"
                                >
                                    {dictionary.notifications?.markAllRead || "Mark all as read"}
                                </Button>
                            )}
                        </div>
                    </DialogHeader>

                    <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mt-2">
                        <TabsList className="grid grid-cols-2 mb-4">
                            <TabsTrigger value="all">
                                {dictionary.notifications?.all || "All"}
                                <span className="ml-1 text-xs">({allNotifications.length})</span>
                            </TabsTrigger>
                            <TabsTrigger value="unread">
                                {dictionary.notifications?.unread || "Unread"}
                                <span className="ml-1 text-xs">({unreadNotifications.length})</span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="all" className="mt-0">
                            <ScrollArea className="h-[400px] pr-4">
                                <div className="space-y-1">
                                    {allNotifications.length > 0 ? (
                                        allNotifications.map((notification) => (
                                            <ActivityItem
                                                key={notification.id}
                                                id={notification.id}
                                                title={notification.title}
                                                description={notification.description}
                                                time={formatRelativeTime(notification.time)}
                                                type={notification.type}
                                                read={notification.read}
                                                onClick={handleNotificationClick}
                                            />
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <p>{dictionary.notifications?.noNotifications || "No notifications"}</p>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </TabsContent>

                        <TabsContent value="unread" className="mt-0">
                            <ScrollArea className="h-[400px] pr-4">
                                <div className="space-y-1">
                                    {unreadNotifications.length > 0 ? (
                                        unreadNotifications.map((notification) => (
                                            <ActivityItem
                                                key={notification.id}
                                                id={notification.id}
                                                title={notification.title}
                                                description={notification.description}
                                                time={formatRelativeTime(notification.time)}
                                                type={notification.type}
                                                read={notification.read}
                                                onClick={handleNotificationClick}
                                            />
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <p>{dictionary.notifications?.noUnread || "No unread notifications"}</p>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                </>
            )}
        </DialogContent>
    </Dialog>
  )
}