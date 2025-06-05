"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState } from "react"
import { NotificationDialog } from "./notification-dialog"
import { useNotifications } from "@/contexts/notification-context"

interface NotificationButtonProps {
    dictionary: any
}

export function NotificationButton({ dictionary }: NotificationButtonProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const { notifications } = useNotifications()

    const unreadCount = notifications.filter((n) => !n.read).length

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative text-muted-foreground hover:text-foreground cursor-pointer"
                            onClick={() => setIsDialogOpen(true)}
                        >
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex items-center justify-center">
                  {unreadCount > 9 ? (
                      <span className="bg-cyan-500 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center">
                      9+
                    </span>
                  ) : (
                      <span className="bg-cyan-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </span>
                            )}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{dictionary.nav?.notifications || "Notifications"}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <NotificationDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} dictionary={dictionary} />
        </>
    )
}
