"use client"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarIcon, CheckCircle, Clock, PenToolIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EditTaskDialog } from "./edit-task-dialog"
import {Task} from "@/lib/types/tasks";

interface TaskCardProps {
    task: Task
    dict: any
    lang: string
    onStatusChange: (taskId: number, newStatus: "todo" | "in_progress" | "done") => void
    onEditTask: (taskId: number, updatedTask: Partial<TaskCardProps["task"]>) => void
    onDeleteTask: (taskId: number) => void
    team: any
}

export function TaskCard({ task, dict, lang, onStatusChange, onEditTask, onDeleteTask, team }: TaskCardProps) {
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
            case "done":
                return "bg-success/20 text-success border-success/50"
            case "in_progress":
                return "bg-info/20 text-info border-info/50"
            case "todo":
                return "bg-warning/20 text-warning border-warning/50"
            default:
                return "bg-muted/20 text-muted-foreground border-muted/50"
        }
    }

    // Obtener el texto del estado
    const getStatusText = (status: string) => {
        switch (status) {
            case "done":
                return dict.tasks?.statusCompleted || "Completed"
            case "in_progress":
                return dict.tasks?.statusInProgress || "In Progress"
            case "todo":
                return dict.tasks?.statusPending || "Pending"
            default:
                return status
        }
    }

    // Obtener el icono según el estado
    const getStatusIcon = (status: string) => {
        switch (status) {
            case "done":
                return <CheckCircle className="h-4 w-4 mr-1" />
            case "in_progress":
                return <Clock className="h-4 w-4 mr-1" />
            case "todo":
                return <PenToolIcon className="h-4 w-4 mr-1" />
            default:
                return <PenToolIcon className="h-4 w-4 mr-1" />
        }
    }

    // Manejar el cambio de estado
    const handleStatusChange = (value: string) => {
        onStatusChange(task.id, value as "todo" | "in_progress" | "done")
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
                          <SelectItem value="todo" className={getStatusColor("todo")}>
                              <div className="flex items-center">
                                  {getStatusIcon("todo")}
                                  <span>{getStatusText("todo")}</span>
                              </div>
                          </SelectItem>
                          <SelectItem value="in_progress" className={getStatusColor("in_progress")}>
                              <div className="flex items-center">
                                  {getStatusIcon("in_progress")}
                                  <span>{getStatusText("in_progress")}</span>
                              </div>
                          </SelectItem>
                          <SelectItem value="done" className={getStatusColor("done")}>
                              <div className="flex items-center">
                                  {getStatusIcon("done")}
                                  <span>{getStatusText("done")}</span>
                              </div>
                          </SelectItem>
                      </SelectContent>
                  </Select>
              </div>
              <EditTaskDialog
                task={task}
                dict={dict}
                lang={lang}
                onEditTask={onEditTask}
                onDeleteTask={onDeleteTask}
                team={team}
              />
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
                      <AvatarFallback className="bg-muted text-primary text-xs">{getInitials(task.assignee)}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">{task.assignee}</span>
              </div>

              <div className="flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
            {task.due_date ? formatDate(task.due_date) : formatDate(task.created_at)}
          </span>
              </div>
          </CardFooter>
      </Card>
    )
}