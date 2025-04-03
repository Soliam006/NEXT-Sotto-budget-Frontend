"use client"
import { TaskCard } from "@/components/tasks/task-card"
import { AddTaskDialog } from "@/components/tasks/add-task-dialog"
import { Button } from "@/components/ui/button"
import { PlusCircle, Save, Loader2 } from "lucide-react"
import { useProject } from "@/contexts/project-context"

interface TaskBoardProps {
    dict: any
    lang: string
}

export function TaskBoard({ dict, lang }: TaskBoardProps) {
    const { selectedProject, addTask, updateTask, deleteTask, updateTaskStatus, saveChanges, hasChanges, isSaving } =
      useProject()

    // Filtrar tareas por estado
    const pendingTasks = selectedProject.tasks?.filter((task:any) => task.status === "PENDING") || []
    const inProgressTasks = selectedProject.tasks?.filter((task:any) => task.status === "IN_PROGRESS") || []
    const completedTasks = selectedProject.tasks?.filter((task:any) => task.status === "COMPLETED") || []

    // Función para manejar el cambio de estado de una tarea
    const handleStatusChange = (taskId: string, newStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED") => {
        updateTaskStatus(taskId, newStatus)
    }

    // Función para editar una tarea existente
    const handleEditTask = (taskId: string, updatedTask: Partial<any>) => {
        updateTask(taskId, updatedTask)
    }

    // Función para eliminar una tarea
    const handleDeleteTask = (taskId: string) => {
        deleteTask(taskId)
    }

    // Función para añadir una nueva tarea
    const handleAddTask = (newTask: any) => {
        addTask(newTask)
    }

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
                        </>
                      )}
                  </Button>
                  <AddTaskDialog dict={dict} lang={lang} onAddTask={handleAddTask} teamMembers={selectedProject.team || []} />
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
                      {pendingTasks.map((task:any) => (
                        <div key={`pending-${task.id}`}>
                            <TaskCard
                              task={task}
                              dict={dict}
                              lang={lang}
                              onStatusChange={handleStatusChange}
                              onEditTask={handleEditTask}
                              onDeleteTask={handleDeleteTask}
                              team={selectedProject.team}
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
                                  const newTask = {
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
                      {inProgressTasks.map((task:any) => (
                        <div key={`progress-${task.id}`}>
                            <TaskCard
                              task={task}
                              dict={dict}
                              lang={lang}
                              onStatusChange={handleStatusChange}
                              onEditTask={handleEditTask}
                              onDeleteTask={handleDeleteTask}
                              team={selectedProject.team}
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
                      {completedTasks.map((task:any) => (
                        <div key={`completed-${task.id}`}>
                            <TaskCard
                              task={task}
                              dict={dict}
                              lang={lang}
                              onStatusChange={handleStatusChange}
                              onEditTask={handleEditTask}
                              onDeleteTask={handleDeleteTask}
                              team={selectedProject.team}
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

