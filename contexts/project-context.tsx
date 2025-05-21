"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Project } from "@/components/dashboard/projects-selector"
import { isEqual } from "lodash"

// Datos de ejemplo para proyectos
const MOCK_PROJECTS:Project[] = [
  {
    id: 1,
    title: "Modern Residential Complex",
    description: "A luxury residential complex with 50 apartments and amenities",
    admin: "Alex Johnson",
    limitBudget: 2500000,
    currentSpent: 1750000,
    progress: {
      done: 1,
      inProgress: 0,
      todo: 0,
    },
    location: "Downtown, New York",
    startDate: "2023-01-15",
    endDate: "2024-06-30",
    status: "In Progress",
    clients: [
      {
        id: "client-1",
        name: "Acme Corporation",
        username: "acmecorp",
        role: "Corporate Client",
        avatar: "/favicon.ico",
      },
    ],
    team: [
      {
        id: "1",
        name: "John Smith",
        role: "Senior Architect",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      },
    ],
    tasks: [
      {
        id: "task-1",
        title: "Foundation inspection",
        description: "Inspect the foundation for any cracks or issues",
        assignee: "David Lee",
        assigneeAvatar: "https://randomuser.me/api/portraits/men/3.jpg",
        worker_id: "3",
        status: "COMPLETED",
        dueDate: "2023-03-15",
        created_at: "2023-02-01T10:00:00Z",
        updated_at: "2023-03-10T15:30:00Z",
      },
    ],
    materials: [
      {
        id: 1,
        name: "Concrete (High Grade)",
        quantity: 500,
        unit: "tons",
        cost: 75000,
        status: "Delivered",
      },
    ],
    expenses: [
      {
        id: 1,
        date: "2023-02-15",
        category: "Materials",
        description: "Concrete purchase",
        amount: 750000,
        status: "Approved",
      },
    ],
    inventory: [],
    expenseCategories: {
      Materials: 750000,
      Labor: 650000,
      Equipment: 200000,
      Permits: 100000,
      Other: 50000,
    },
  },
  {
    id: 2,
    title: "Commercial Office Tower",
    description: "A 30-story office tower in the business district",
    admin: "Maria Garcia",
    limitBudget: 5000000,
    currentSpent: 2000000,
    progress: {
      done: 20,
      inProgress: 25,
      todo: 40,
    },
    location: "Financial District, Chicago",
    startDate: "2023-03-10",
    endDate: "2025-07-15",
    status: "In Progress",
    clients: [
      {
        id: "client-3",
        name: "Initech LLC",
        username: "initech",
        role: "Corporate Client",
        avatar: "/favicon.ico",
      },
    ],
    team: [
      {
        id: "4",
        name: "Michael Brown",
        role: "Lead Engineer",
        avatar: "https://randomuser.me/api/portraits/men/4.jpg",
      },
    ],
    tasks: [
      {
        id: "task-4",
        title: "Structural analysis review",
        description: "Review structural analysis reports for floors 15-30",
        assignee: "Michael Brown",
        assigneeAvatar: "https://randomuser.me/api/portraits/men/4.jpg",
        worker_id: "4",
        status: "IN_PROGRESS",
        dueDate: "2023-05-15",
        created_at: "2023-04-01T10:00:00Z",
        updated_at: "2023-04-10T15:30:00Z",
      },
    ],
    materials: [
      {
        id: 5,
        name: "Structural Steel",
        quantity: 1500,
        unit: "tons",
        cost: 600000,
        status: "Partially Delivered",
      },
    ],
    expenses: [
      {
        id: 6,
        date: "2023-03-20",
        category: "Permits",
        description: "Building permits and approvals",
        amount: 150000,
        status: "Approved",
      },
    ],
    expenseCategories: {
      Materials: 1200000,
      Labor: 500000,
      Equipment: 150000,
      Permits: 150000,
      Other: 0,
    },
    inventory: [
      {
        id: 1,
        name: "Azulejos de baño",
        category: "Materiales",
        total: 200,
        used: 150,
        remaining: 50,
        unit: "m²",
        unitCost: 35,
        supplier: "Azulejos Premium",
        status: "Installed",
        project: "Reforma Casa Moderna",
      },
      {
        id: 2,
        name: "Instalación eléctrica",
        category: "Servicios",
        total: 1,
        used: 0.7,
        remaining: 0.3,
        unit: "servicio",
        unitCost: 5000,
        supplier: "Electricidad Total",
        status: "Pending",
        project: "Reforma Casa Moderna",
      },
    ],
  },
]

// Tipos para el contexto
interface ProjectContextType {
  projects: Project[]
  setAllProjects: (projects: Project[]) => void
  selectedProject: Project
  originalSelectedProject: Project
  hasChanges: boolean
  setSelectedProjectById: (id: number) => void

  // Métodos para modificar el proyecto
  addProject: (project: Omit<Project, "id">) => Promise<Project>
  addTeamMember: (member: any) => void
  addTask: (task: any) => void
  updateTask: (taskId: string, updatedTask: any) => void
  deleteTask: (taskId: string) => void
  updateTaskStatus: (taskId: string, newStatus: string) => void

  // Métodos para el inventario
  addInventoryItem: (item: any) => void
  updateInventoryItem: (itemId: number, updatedItem: any) => void
  deleteInventoryItem: (itemId: number) => void
  updateInventoryItemStatus: (itemId: number, newStatus: "Installed" | "Pending" | "in_budget") => void

  // Métodos para guardar/descartar cambios
  saveChanges: () => Promise<void>
  discardChanges: () => void

  // Estado de guardado
  isSaving: boolean
}

// Crear el contexto
const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

// Hook personalizado para usar el contexto
export function useProject() {
  const context = useContext(ProjectContext)
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider")
  }
  return context
}

// Provider component
export function ProjectProvider({ children }: { children: ReactNode }) {
  // Estado para todos los proyectos
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS)

  // Estado para el proyecto seleccionado y su versión original
  const [selectedProjectId, setSelectedProjectId] = useState<number>(1)
  const [selectedProject, setSelectedProject] = useState<Project>(projects[0])
  const [originalSelectedProject, setOriginalSelectedProject] = useState<Project>(projects[0])

  // Estado para rastrear cambios y guardado
  const [hasChanges, setHasChanges] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)

  // Actualizar el proyecto seleccionado cuando cambia el ID
  useEffect(() => {
    const project = projects.find((p) => p.id === selectedProjectId)
    if (project) {
      // Crear copias profundas para evitar referencias compartidas
      const projectCopy = JSON.parse(JSON.stringify(project))
      setSelectedProject(projectCopy)
      setOriginalSelectedProject(projectCopy)
    }
  }, [selectedProjectId, projects])

  // Detectar cambios en el proyecto seleccionado
  useEffect(() => {
    // Comparar el proyecto seleccionado con su versión original
    const projectChanged = !isEqual(selectedProject, originalSelectedProject)
    setHasChanges(projectChanged)
  }, [selectedProject, originalSelectedProject])

  // Función para seleccionar un proyecto por ID
  const setSelectedProjectById = (id: number) => {
    setSelectedProjectId(id)
  }

  // Función para añadir un nuevo proyecto
  const addProject = async (project: Omit<Project, "id">) => {
    setIsSaving(true)

    try {
      // Simular una llamada a la API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generar un nuevo ID (en una aplicación real, esto vendría del backend)
      const newId = Math.max(...projects.map((p) => p.id)) + 1

      // Crear el nuevo proyecto con ID
      const newProject: Project = {
        id: newId,
        ...project,
      }

      // Añadir el proyecto a la lista
      setProjects((prev) => [...prev, newProject])

      // Seleccionar el nuevo proyecto
      setSelectedProjectId(newId)

      console.log("Proyecto añadido con éxito:", newProject)
      return newProject
    } catch (error) {
      console.error("Error al añadir el proyecto:", error)
      throw error
    } finally {
      setIsSaving(false)
    }
  }
  const setAllProjects = (projects: Project[]) => {
    setProjects(projects)
    setSelectedProjectId(projects[0].id)
  }

  // Métodos para modificar el proyecto seleccionado

  // Añadir un miembro al equipo
  const addTeamMember = (member: any) => {
    setSelectedProject((prev) => ({
      ...prev,
      team: [...(prev.team || []), member],
    }))
  }

    // Añadir una tarea
  const addTask = (task: any) => {
    setSelectedProject((prev) => {
      const newTasks = [...(prev.tasks || []), task]
      const progress = {
        ...prev.progress,
        todo: newTasks.filter((t: any) => t.status === "PENDING").length || 0,
        done: newTasks.filter((t: any) => t.status === "COMPLETED").length || 0,
        inProgress: newTasks.filter((t: any) => t.status === "IN_PROGRESS").length || 0,
      }
      return {
        ...prev,
        tasks: newTasks,
        progress,
      }
    })
  }

  // Actualizar una tarea
  const updateTask = (taskId: string, updatedTask: any) => {
    setSelectedProject((prev) => ({
      ...prev,
      tasks: prev.tasks?.map((task: any) => (task.id === taskId ? { ...task, ...updatedTask } : task)),
    }))
  }

  // Eliminar una tarea
  const deleteTask = (taskId: string) => {
    setSelectedProject((prev) => {
      const newTasks = prev.tasks?.filter((task: any) => task.id !== taskId) || [];
      const progress = {
        ...prev.progress,
        todo: newTasks.filter((t: any) => t.status === "PENDING").length || 0,
        done: newTasks.filter((t: any) => t.status === "COMPLETED").length || 0,
        inProgress: newTasks.filter((t: any) => t.status === "IN_PROGRESS").length || 0,
      };
      return {
        ...prev,
        tasks: newTasks,
        progress,
      };
    });
  }

  // Actualizar el estado de una tarea
  const updateTaskStatus = (taskId: string, newStatus: string) => {
    setSelectedProject((prev) => {
      // Actualizar el estado de la tarea
      const updatedTasks = prev.tasks?.map((task: any) =>
          task.id === taskId ? { ...task, status: newStatus } : task
      ) || [];

      // Recalcular el progreso
      const progress = {
        ...prev.progress,
        todo: updatedTasks.filter((task: any) => task.status === "PENDING").length || 0,
        done: updatedTasks.filter((task: any) => task.status === "COMPLETED").length || 0,
        inProgress: updatedTasks.filter((task: any) => task.status === "IN_PROGRESS").length || 0,
      };

      return {
        ...prev,
        tasks: updatedTasks,
        progress,
      };
    });
  }

  // Métodos para gestionar el inventario

  // Añadir un item al inventario
  const addInventoryItem = (item: any) => {
    setSelectedProject((prev) => ({
      ...prev,
      inventory: [...(prev.inventory || []), {
        ...item,
        id: Math.max(0, ...(prev.inventory?.map(i => i.id) || [])) + 1
      }],
    }))
  }

  // Actualizar un item del inventario
  const updateInventoryItem = (itemId: number, updatedItem: any) => {
    setSelectedProject((prev) => ({
      ...prev,
      inventory: prev.inventory?.map((item) =>
          item.id === itemId ? { ...item, ...updatedItem } : item
      ),
    }))
  }

  // Eliminar un item del inventario
  const deleteInventoryItem = (itemId: number) => {
    setSelectedProject((prev) => ({
      ...prev,
      inventory: prev.inventory?.filter((item) => item.id !== itemId),
    }))
  }

  // Actualizar el estado de un item del inventario
  const updateInventoryItemStatus =
      (itemId: number, newStatus: "Installed" | "Pending" | "in_budget") => {
    setSelectedProject((prev) => ({
      ...prev,
      inventory: prev.inventory?.map((item) =>
          item.id === itemId ? { ...item, status: newStatus } : item
      ),
    }))
  }

  // Guardar cambios
  const saveChanges = async () => {
    if (!hasChanges) return

    setIsSaving(true)

    try {
      // Simular una llamada a la API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Actualizar la lista de proyectos con el proyecto modificado
      setProjects((prev) =>
        prev.map((project) => (project.id === selectedProject.id ? { ...selectedProject } : project)),
      )

      // Actualizar la versión original del proyecto seleccionado
      setOriginalSelectedProject({ ...selectedProject })

      console.log("Cambios guardados con éxito")
    } catch (error) {
      console.error("Error al guardar los cambios:", error)
    } finally {
      setIsSaving(false)
    }
  }

  // Descartar cambios
  const discardChanges = () => {
    // Restaurar el proyecto seleccionado a su versión original
    setSelectedProject({ ...originalSelectedProject })
  }

  // Valor del contexto
  const value = {
    projects,
    setAllProjects,
    selectedProject,
    originalSelectedProject,
    hasChanges,
    setSelectedProjectById,
    addProject,
    addTeamMember,
    // Métodos para las tareas
    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    // Métodos para el inventario
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    updateInventoryItemStatus,
    // Métodos para guardar/descartar cambios
    saveChanges,
    discardChanges,
    isSaving,
  }

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
}
