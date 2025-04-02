import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarIcon } from "lucide-react"

interface TaskCardProps {
    task: {
        id: string
        title: string
        description?: string
        assignee: string
        assigneeAvatar?: string
        status: "PENDING" | "IN_PROGRESS" | "COMPLETED"
        created_at: string
        updated_at: string
    }
    dict: any
}

export function TaskCard({ task, dict }: TaskCardProps) {
    // Obtener las iniciales del asignado
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
    }

    // Obtener el color del estado
    const getStatusColor = (status: string) => {
        switch (status) {
            case "COMPLETED":
                return "bg-success/20 text-success border-success/50"
            case "IN_PROGRESS":
                return "bg-info/20 text-info border-info/50"
            case "PENDING":
                return "bg-warning/20 text-warning border-warning/50"
            default:
                return "bg-muted/20 text-muted-foreground border-muted/50"
        }
    }

    // Obtener el texto del estado
    const getStatusText = (status: string) => {
        switch (status) {
            case "COMPLETED":
                return dict.tasks?.statusCompleted || "Completed"
            case "IN_PROGRESS":
                return dict.tasks?.statusInProgress || "In Progress"
            case "PENDING":
                return dict.tasks?.statusPending || "Pending"
            default:
                return status
        }
    }

    return (
        <Card className="bg-card/50 border-border/50 backdrop-blur-sm hover:bg-muted/20 transition-colors">
            <CardContent className="p-4">
                {/* Badge de estado en la parte superior */}
                <div className="flex justify-end mb-2">
                    <Badge className={getStatusColor(task.status)}>{getStatusText(task.status)}</Badge>
                </div>

                {/* Título completo sin truncar */}
                <h3 className="text-base font-medium mb-3">{task.title}</h3>

                {/* Descripción si existe */}
                {task.description && <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{task.description}</p>}
            </CardContent>

            <CardFooter className="p-4 pt-0 flex justify-between items-center border-t border-border/30">
                <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                        <AvatarImage src={task.assigneeAvatar} alt={task.assignee} />
                        <AvatarFallback className="bg-muted text-primary text-xs">{getInitials(task.assignee)}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">{task.assignee}</span>
                </div>

                <div className="flex items-center gap-1">
                    <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{new Date(task.created_at).toLocaleDateString()}</span>
                </div>
            </CardFooter>
        </Card>
    )
}

