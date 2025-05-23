"use client"

import type React from "react"
import { CheckCircle2, AlertCircle, Info, Activity } from "lucide-react"
import { cn } from "@/lib/utils"
import {ActivityItemProps} from "@/lib/types/notification";

export function ActivityItem({ id, icon, title, description, time, type, read, onClick }: ActivityItemProps) {
    const getTypeStyles = () => {
        switch (type) {
            case "info":
                return { color: "text-info bg-info/10 border-info/30" }
            case "warning":
                return { color: "text-warning bg-warning/10 border-warning/30" }
            case "error":
                return { color: "text-destructive bg-destructive/10 border-destructive/30" }
            case "success":
                return { color: "text-success bg-success/10 border-success/30" }
            case "update":
                return { color: "text-primary bg-primary/10 border-primary/30" }
            default:
                return { color: "text-info bg-info/10 border-info/30" }
        }
    }

    const getDefaultIcon = () => {
        switch (type) {
            case "info":
                return <Info className={`h-4 w-4 ${color.split(" ")[0]}`} />
            case "warning":
                return <AlertCircle className={`h-4 w-4 ${color.split(" ")[0]}`} />
            case "error":
                return <AlertCircle className={`h-4 w-4 ${color.split(" ")[0]}`} />
            case "success":
                return <CheckCircle2 className={`h-4 w-4 ${color.split(" ")[0]}`} />
            case "update":
                return <Activity className={`h-4 w-4 ${color.split(" ")[0]}`} />
            default:
                return <Info className={`h-4 w-4 ${color.split(" ")[0]}`} />
        }
    }

    const { color } = getTypeStyles()
    const displayIcon = icon || getDefaultIcon()

    return (
        <div
            className={cn(
                "flex items-start space-x-3 p-3 rounded-lg transition-colors",
                read ? "opacity-70" : "opacity-100",
                onClick ? "cursor-pointer hover:bg-secondary/50" : "",
            )}
            onClick={() => onClick?.(id)}
        >
            <div className={`mt-0.5 p-1.5 rounded-full ${color.split(" ")[1]} ${color.split(" ")[2]}`}>{displayIcon}</div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <div className={cn("text-sm font-medium", !read && "font-semibold")}>{title}</div>
                    <div className="ml-2 text-xs text-muted-foreground whitespace-nowrap">{time}</div>
                </div>
                <div className="text-xs text-muted-foreground line-clamp-2">{description}</div>
            </div>
            {!read && <div className="w-2 h-2 rounded-full bg-cyan-500 flex-shrink-0 mt-2"></div>}
        </div>
    )
}
