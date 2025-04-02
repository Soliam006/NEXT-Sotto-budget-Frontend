"use client"

import { useState, useEffect } from "react"
import { TaskCard } from "@/components/tasks/task-card"
import { AddTaskDialog } from "@/components/tasks/add-task-dialog"
import { Button } from "@/components/ui/button"
import { PlusCircle, Save, Loader2 } from "lucide-react"
import { isEqual } from "lodash"

interface Task {
    id: string
    title: string
    description?: string
    assignee: string
    assigneeAvatar?: string
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED"
    dueDate?: string
    created_at: string
    updated_at: string
    project_id?: string | number
    worker_id?: string
}

interface TaskBoardProps {
    initialTasks?: Task[]
    projectId?: string | number
    dict: any
    lang: string
}

// Datos de ejemplo para mostrar en el tablero
const exampleTasks: Task[] = [
    {
        id: "task-1",
        title: "Instalar ventanas en el segundo piso",
        description: "Completar la instalación de todas las ventanas del segundo piso según las especificaciones",
        assignee: "Mike Johnson",
        dueDate: new Date().toISOString(),
        status: "PENDING",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        project_id: "1",
        worker_id: "3",
    },
    {
        id: "task-2",
        title: "Revisar instalación eléctrica",
        description: "Verificar que todos los circuitos funcionan correctamente",
        assignee: "Sarah Williams",
        status: "IN_PROGRESS",
        dueDate: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        project_id: "1",
        worker_id: "4",
    },
    {
        id: "task-3",
        title: "Pintar paredes de la sala principal",
        description: "Usar la pintura aprobada por el cliente",
        assignee: "David Smith",
        status: "COMPLETED",
        dueDate: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        project_id: "1",
        worker_id: "5",
    },
]

export function TaskBoard({ initialTasks = [], projectId, dict, lang }: TaskBoardProps) {
    // Estado para las tareas y cambios
    const [tasks, setTasks] = useState<Task[]>(initialTasks.length > 0 ? initialTasks : exampleTasks)
    const [originalTasks, setOriginalTasks] = useState<Task[]>(initialTasks.length > 0 ? initialTasks : exampleTasks)
    const [changedTasks, setChangedTasks] = useState<{ id: string; status: string }[]>([])
    const [isSaving, setIsSaving] = useState(false)
    const [hasChanges, setHasChanges] = useState(false)

    // Comprobar si hay cambios en las tareas
    useEffect(() => {
        // Verificar si las tareas actuales son diferentes de las originales
        const tasksChanged = !isEqual(
          tasks.map((t) => ({
              id: t.id,
              title: t.title,
              description: t.description,
              assignee: t.assignee,
              status: t.status,
              dueDate: t.dueDate,
          })),
          originalTasks.map((t) => ({
              id: t.id,
              title: t.title,
              description: t.description,
              assignee: t.assignee,
              status: t.status,
              dueDate: t.dueDate,
          })),
        )

        // Verificar si hay tareas nuevas (no presentes en las originales)
        const hasNewTasks = tasks.some((task) => !originalTasks.find((t) => t.id === task.id))

        setHasChanges(tasksChanged || hasNewTasks || changedTasks.length > 0)
    }, [tasks, originalTasks, changedTasks])

    // Función para añadir una nueva tarea
    const handleAddTask = (newTask: Task) => {
        setTasks((prevTasks) => [...prevTasks, newTask])
    }

    // Función para editar una tarea existente
    const handleEditTask = (taskId: string, updatedTask: Partial<Task>) => {
        setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? { ...task, ...updatedTask } : task)))
    }

    // Función para eliminar una tarea
    const handleDeleteTask = (taskId: string) => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
    }

    // Función para manejar el cambio de estado de una tarea
    const handleStatusChange = (taskId: string, newStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED") => {
        // Actualizar el estado de la tarea
        setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))

        // Registrar el cambio para guardar
        setChangedTasks((prev) => {
            // Verificar si ya existe un cambio para esta tarea
            const existingIndex = prev.findIndex((item) => item.id === taskId)
            if (existingIndex >= 0) {
                // Actualizar el cambio existente
                const updated = [...prev]
                updated[existingIndex] = { id: taskId, status: newStatus }
                return updated
            } else {
                // Añadir nuevo cambio
                return [...prev, { id: taskId, status: newStatus }]
            }
        })
    }

    // Función para guardar los cambios
    const saveChanges = async () => {
        if (!hasChanges) {
            console.log("No changes to save")
            return
        }

        setIsSaving(true)

        // Simular envío al backend
        console.log("Saving changes:", {
            updatedTasks: tasks,
            statusChanges: changedTasks,
        })

        // Simular delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Simular éxito
        console.log("Changes saved successfully")

        // Actualizar las tareas originales con el estado actual
        setOriginalTasks([...tasks])

        // Limpiar cambios
        setChangedTasks([])
        setIsSaving(false)
    }

    // Filtrar tareas por estado
    const pendingTasks = tasks.filter((task) => task.status === "PENDING")
    const inProgressTasks = tasks.filter((task) => task.status === "IN_PROGRESS")
    const completedTasks = tasks.filter((task) => task.status === "COMPLETED")

    return (
      <div className="space-y-6">
          <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{dict.tasks?.taskBoard || "Task Board"}</h2>
              <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={saveChanges}
                    disabled={isSaving || !hasChanges}
                    className={hasChanges ? "animate-pulse font-bold cursor-pointer" : ""}
                  >
                      {isSaving ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            {dict.tasks?.saving || "Saving..."}
                        </>
                      ) : (
                        <>
                            <Save className="h-4 w-4 mr-2" />
                            {dict.tasks?.saveChanges || "Save Changes"}
                            {changedTasks.length > 0 && ` (${changedTasks.length})`}
                        </>
                      )}
                  </Button>
                  <AddTaskDialog dict={dict} lang={lang} onAddTask={handleAddTask} projectId={projectId} />
              </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Columna Pendiente */}
              <div className="space-y-4">
                  <div className="flex items-center justify-between">
                      <h3 className="font-medium text-warning">{dict.tasks?.statusPending || "Pending"}</h3>
                      <span className="text-xs bg-warning/20 text-warning px-2 py-1 rounded-full">{pendingTasks.length}</span>
                  </div>

                  <div className="min-h-[200px] bg-muted/30 rounded-lg p-2 border border-border/30 space-y-3">
                      {pendingTasks.map((task) => (
                        <div key={`pending-${task.id}`}>
                            <TaskCard
                              task={task}
                              dict={dict}
                              lang={lang}
                              onStatusChange={handleStatusChange}
                              onEditTask={handleEditTask}
                              onDeleteTask={handleDeleteTask}
                            />
                        </div>
                      ))}

                      {pendingTasks.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-[100px] text-muted-foreground">
                            <p className="text-sm mb-2">{dict.tasks?.noTasks || "No tasks yet"}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs"
                              onClick={() => {
                                  const newTask:any = {
                                      id: `task-${Date.now()}`,
                                      title: dict.tasks?.newTask || "New Task",
                                      assignee: "Unassigned",
                                      status: "PENDING",
                                      created_at: new Date().toISOString(),
                                      updated_at: new Date().toISOString(),
                                  }
                                  handleAddTask(newTask)
                              }}
                            >
                                <PlusCircle className="h-4 w-4 mr-1" />
                                {dict.tasks?.addTask || "Add Task"}
                            </Button>
                        </div>
                      )}
                  </div>
              </div>

              {/* Columna En Progreso */}
              <div className="space-y-4">
                  <div className="flex items-center justify-between">
                      <h3 className="font-medium text-info">{dict.tasks?.statusInProgress || "In Progress"}</h3>
                      <span className="text-xs bg-info/20 text-info px-2 py-1 rounded-full">{inProgressTasks.length}</span>
                  </div>

                  <div className="min-h-[200px] bg-muted/30 rounded-lg p-2 border border-border/30 space-y-3">
                      {inProgressTasks.map((task) => (
                        <div key={`progress-${task.id}`}>
                            <TaskCard
                              task={task}
                              dict={dict}
                              lang={lang}
                              onStatusChange={handleStatusChange}
                              onEditTask={handleEditTask}
                              onDeleteTask={handleDeleteTask}
                            />
                        </div>
                      ))}

                      {inProgressTasks.length === 0 && (
                        <div className="flex items-center justify-center h-[100px] text-muted-foreground">
                            <p className="text-sm">{dict.tasks?.noTasksInProgress || "No tasks in progress"}</p>
                        </div>
                      )}
                  </div>
              </div>

              {/* Columna Completado */}
              <div className="space-y-4">
                  <div className="flex items-center justify-between">
                      <h3 className="font-medium text-success">{dict.tasks?.statusCompleted || "Completed"}</h3>
                      <span className="text-xs bg-success/20 text-success px-2 py-1 rounded-full">{completedTasks.length}</span>
                  </div>

                  <div className="min-h-[200px] bg-muted/30 rounded-lg p-2 border border-border/30 space-y-3">
                      {completedTasks.map((task) => (
                        <div key={`completed-${task.id}`}>
                            <TaskCard
                              task={task}
                              dict={dict}
                              lang={lang}
                              onStatusChange={handleStatusChange}
                              onEditTask={handleEditTask}
                              onDeleteTask={handleDeleteTask}
                            />
                        </div>
                      ))}

                      {completedTasks.length === 0 && (
                        <div className="flex items-center justify-center h-[100px] text-muted-foreground">
                            <p className="text-sm">{dict.tasks?.noTasksCompleted || "No completed tasks"}</p>
                        </div>
                      )}
                  </div>
              </div>
          </div>
      </div>
    )
}