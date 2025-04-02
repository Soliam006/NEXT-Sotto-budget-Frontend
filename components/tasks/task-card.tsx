"use client"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarIcon, CheckCircle, Clock, PenToolIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EditTaskDialog } from "./edit-task-dialog"

interface TaskCardProps {
    task: {
        id: string
        title: string
        description?: string
        assignee: string
        assigneeAvatar?: string
        status: "PENDING" | "IN_PROGRESS" | "COMPLETED"
        dueDate?: string
        created_at: string
        updated_at: string
    }
    dict: any
    lang: string
    onStatusChange: (taskId: string, newStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED") => void
    onEditTask: (taskId: string, updatedTask: Partial<TaskCardProps["task"]>) => void
    onDeleteTask: (taskId: string) => void
}

export function TaskCard({ task, dict, lang, onStatusChange, onEditTask, onDeleteTask }: TaskCardProps) {
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

    // Obtener el icono según el estado
    const getStatusIcon = (status: string) => {
        switch (status) {
            case "COMPLETED":
                return <CheckCircle className="h-4 w-4 mr-1" />
            case "IN_PROGRESS":
                return <Clock className="h-4 w-4 mr-1" />
            case "PENDING":
                return <PenToolIcon className="h-4 w-4 mr-1" />
            default:
                return <PenToolIcon className="h-4 w-4 mr-1" />
        }
    }

    // Manejar el cambio de estado
    const handleStatusChange = (value: string) => {
        onStatusChange(task.id, value as "PENDING" | "IN_PROGRESS" | "COMPLETED")
    }

    // Formatear fecha
    const formatDate = (dateString?: string) => {
        if (!dateString) return null
        return new Date(dateString).toLocaleDateString()
    }

    return (
      <Card className="bg-card/50 border-border/50 backdrop-blur-sm hover:bg-muted/20 transition-colors">
          <CardHeader className="p-2 pb-0 flex flex-row justify-between items-start">
              {/* Dropdown para cambiar el estado */}
              <div className="flex justify-between mb-3">
                  <Select defaultValue={task.status} onValueChange={handleStatusChange}>
                      <SelectTrigger className={`w-[140px] h-8 ${getStatusColor(task.status)}`}>
                          <SelectValue placeholder={getStatusText(task.status)}>
                              <div className="flex items-center">
                                  {getStatusIcon(task.status)}
                                  <span className="text-xs">{getStatusText(task.status)}</span>
                              </div>
                          </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="PENDING" className={getStatusColor("PENDING")}>
                              <div className="flex items-center">
                                  {getStatusIcon("PENDING")}
                                  <span>{getStatusText("PENDING")}</span>
                              </div>
                          </SelectItem>
                          <SelectItem value="IN_PROGRESS" className={getStatusColor("IN_PROGRESS")}>
                              <div className="flex items-center">
                                  {getStatusIcon("IN_PROGRESS")}
                                  <span>{getStatusText("IN_PROGRESS")}</span>
                              </div>
                          </SelectItem>
                          <SelectItem value="COMPLETED" className={getStatusColor("COMPLETED")}>
                              <div className="flex items-center">
                                  {getStatusIcon("COMPLETED")}
                                  <span>{getStatusText("COMPLETED")}</span>
                              </div>
                          </SelectItem>
                      </SelectContent>
                  </Select>
              </div>
              <EditTaskDialog task={task} dict={dict} lang={lang} onEditTask={onEditTask} onDeleteTask={onDeleteTask} />
          </CardHeader>
          <CardContent className="px-4">
              <div className="">
                  <h3 className="text-base font-medium">{task.title}</h3>
              </div>

              {/* Descripción si existe */}
              {task.description && <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{task.description}</p>}
          </CardContent>

          <CardFooter className="p-4 pt-0 flex flex-row justify-between items-center border-t border-border/30">
              <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                      <AvatarImage src={task.assigneeAvatar} alt={task.assignee} />
                      <AvatarFallback className="bg-muted text-primary text-xs">{getInitials(task.assignee)}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">{task.assignee}</span>
              </div>

              <div className="flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
            {task.dueDate ? formatDate(task.dueDate) : formatDate(task.created_at)}
          </span>
              </div>
          </CardFooter>
      </Card>
    )
}