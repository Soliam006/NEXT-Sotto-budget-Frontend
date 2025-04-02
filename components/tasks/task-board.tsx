"use client"

import { useState, useEffect, useRef } from "react"
import { createSwapy, Swapy } from "swapy" // Asegúrate de que la ruta o paquete sea el correcto
import { TaskCard } from "@/components/tasks/task-card"
import { AddTaskDialog } from "@/components/tasks/add-task-dialog"
import { Button } from "@/components/ui/button"
import { PlusCircle, Save, Loader2 } from "lucide-react"

interface Task {
    id: string
    title: string
    description?: string
    assignee: string
    assigneeAvatar?: string
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED"
    created_at: string
    dueDate?: string
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
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        project_id: "1",
        worker_id: "5",
    },
]

export function TaskBoard({ initialTasks = [], projectId, dict, lang }: TaskBoardProps) {
    // Estado para las tareas y cambios
    const [tasks, setTasks] = useState<Task[]>(initialTasks.length > 0 ? initialTasks : exampleTasks)
    const [changedTasks, setChangedTasks] = useState<{ id: string; status: string }[]>([])
    const [isSaving, setIsSaving] = useState(false)

    // Usamos un único contenedor para Swapy
    const containerRef = useRef<HTMLDivElement>(null)
    const swapyRef = useRef<Swapy | null>(null)

    // Función para añadir una nueva tarea
    const handleAddTask = (newTask: Task) => {
        setTasks([...tasks, newTask])
    }

    // Función para simular el guardado de cambios
    const saveChanges = async () => {
        if (changedTasks.length === 0) {
            alert(`${dict.tasks?.noChanges || "No changes to save"}`)
            return
        }

        setIsSaving(true)
        console.log("Saving changes:", changedTasks)
        await new Promise((resolve) => setTimeout(resolve, 1500))
        alert(`${dict.tasks?.changesSaved || "Changes saved"},
            description: ${changedTasks.length} ${dict.tasks?.taskUpdated || "tasks updated"} successfully`)

        setChangedTasks([])
        setIsSaving(false)
    }

    // Función para leer el estado de cada slot y actualizar las tareas
    const updateTasksFromSwapy = () => {
        if (!containerRef.current) return
        // Recorremos cada slot (cada div con data-swapy-slot)
        const slotElements = containerRef.current.querySelectorAll("[data-swapy-slot]")
        // Creamos una copia de las tareas para actualizarlas
        let updatedTasks = [...tasks]
        slotElements.forEach((slotEl) => {
            const status = slotEl.getAttribute("data-status")
            // Buscamos el hijo que es el item
            const itemEl = slotEl.querySelector("[data-swapy-item]")
            if (itemEl && status) {
                const taskId = itemEl.getAttribute("data-swapy-item")
                if (taskId) {
                    updatedTasks = updatedTasks.map((task) => {
                        if (task.id === taskId && task.status !== status) {
                            // Registrar cambio si el status cambió
                            if (!changedTasks.find((c) => c.id === task.id)) {
                                setChangedTasks((prev) => [...prev, { id: task.id, status }])
                            }
                            return { ...task, status: status as "PENDING" | "IN_PROGRESS" | "COMPLETED" }
                        }
                        return task
                    })
                }
            }
        })
        setTasks(updatedTasks)
    }

    // Inicializamos Swapy en el contenedor y definimos sus callbacks
    useEffect(() => {
        if (containerRef.current) {
            swapyRef.current = createSwapy(containerRef.current, {
                swapMode: "drop",
                // Puedes agregar más opciones de configuración según la documentación de Swapy
            })

            swapyRef.current.onBeforeSwap((event) => {
                console.log("beforeSwap", event)
                return true
            })

            swapyRef.current.onSwapStart((event) => {
                console.log("swapStart", event)
            })

            swapyRef.current.onSwap((event) => {
                console.log("swap", event)
            })

            swapyRef.current.onSwapEnd((event) => {
                console.log("swapEnd", event)
                updateTasksFromSwapy()
                alert(`title: ${dict.tasks?.changesSaved || "Swapped"},
                    description: Task swap completed`)
            })
        }

        return () => {
            swapyRef.current?.destroy()
        }
        // Se reinicializa cuando cambian las tareas para reflejar la estructura
    }, [tasks])

    // Función auxiliar para asignar un color (o estilo) a cada status
    const statusColor = (status: string) => {
        switch (status) {
            case "PENDING":
                return "text-warning"
            case "IN_PROGRESS":
                return "text-info"
            case "COMPLETED":
                return "text-success"
            default:
                return "text-muted"
        }
    }

    // Filtrar tareas por estado
    const pendingTasks = tasks.filter((task) => task.status === "PENDING")
    const inProgressTasks = tasks.filter((task) => task.status === "IN_PROGRESS")
    const completedTasks = tasks.filter((task) => task.status === "COMPLETED")

    // Renderizamos cada columna con sus respectivos slots
    const renderColumn = (
        status: "PENDING" | "IN_PROGRESS" | "COMPLETED",
        tasksForStatus: Task[]
    ) => {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className={`font-medium ${statusColor(status)}`}>
                        {dict.tasks?.[`status${status}`] || status}
                    </h3>
                    <span className="text-xs bg-muted/20 px-2 py-1 rounded-full">{tasksForStatus.length}</span>
                </div>
                <div className="min-h-[200px] bg-muted/30 rounded-lg p-2 border border-border/30">
                    {tasksForStatus.length > 0 ? (
                        tasksForStatus.map((task, index) => (
                            <div
                                key={`${status}-${task.id}`}
                                className="slot mb-3 last:mb-0"
                                data-swapy-slot={`${status}-${index}`}
                                data-status={status}
                            >
                                <div data-swapy-item={task.id}>
                                    <TaskCard task={task} dict={dict} />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div
                            className="slot flex items-center justify-center h-[100px] text-muted-foreground"
                            data-swapy-slot={`${status}-empty`}
                            data-status={status}
                        >
                            <p className="text-sm">{dict.tasks?.dragHere || "Drag tasks here"}</p>
                        </div>
                    )}
                </div>
            </div>
        )
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
                        disabled={isSaving || changedTasks.length === 0}
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

            {/* Contenedor único para Swapy */}
            <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {renderColumn("PENDING", pendingTasks)}
                {renderColumn("IN_PROGRESS", inProgressTasks)}
                {renderColumn("COMPLETED", completedTasks)}
            </div>
        </div>
    )
}
