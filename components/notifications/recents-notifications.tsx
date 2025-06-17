"use client"

import { useState } from "react"
import {Activity, Bell} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ActivityItem } from "./activity-item"
import { useNotifications } from "@/contexts/notification-context"
import { NotificationDialog } from "./notification-dialog"
import {formatRelativeTime} from "@/lib/helpers/notifications";

interface NotificationsOverviewProps {
    dictionary: any
}

export function NotificationsOverview({ dictionary }: NotificationsOverviewProps) {
    const { notifications } = useNotifications()
    const [dialogOpen, setDialogOpen] = useState(false)

    // Obtener las 4 notificaciones más recientes
    const recentNotifications = [...notifications]
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 4)

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-cyan-500"/>
                    {dictionary.notifications.recentNotifications || "Recent Activity"}
                </h3>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDialogOpen(true)}
                    className="text-xs text-primary hover:text-primary/80 cursor-pointer"
                >
                    {dictionary.common?.viewAll || "View All"}
                </Button>
            </div>

            {/* Lista de notificaciones */}
            <div className="space-y-2">
                {recentNotifications.length > 0 ? (
                    recentNotifications.map((notification) => (
                        <ActivityItem
                            key={notification.id}
                            id={notification.id}
                            title={notification.title}
                            description={notification.description}
                            time={formatRelativeTime(notification.time, dictionary)}
                            type={notification.type}
                            read={notification.read}
                        />
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        {dictionary.notifications?.noNotifications || "No recent notifications"}
                    </p>
                )}
            </div>

            {/* Diálogo de notificaciones completo */}
            <NotificationDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                dictionary={dictionary}
            />
        </div>
    )
}