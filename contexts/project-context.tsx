"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Project } from "@/components/dashboard/projects-selector"
import { isEqual } from "lodash"

// Datos de ejemplo para proyectos
const MOCK_PROJECTS = [
  {
    id: 1,
    title: "Modern Residential Complex",
    description: "A luxury residential complex with 50 apartments and amenities",
    admin: "Alex Johnson",
    limitBudget: 2500000,
    currentSpent: 1750000,
    progress: {
      done: 35,
      inProgress: 15,
      todo: 20,
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
      {
        id: "client-2",
        name: "Globex Industries",
        username: "globex",
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
      {
        id: "2",
        name: "Sarah Johnson",
        role: "Project Manager",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      },
      {
        id: "3",
        name: "David Lee",
        role: "Civil Engineer",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
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
      {
        id: "task-2",
        title: "Electrical wiring for floor 1",
        description: "Complete electrical wiring for all units on floor 1",
        assignee: "Sarah Johnson",
        assigneeAvatar: "https://randomuser.me/api/portraits/women/2.jpg",
        worker_id: "2",
        status: "IN_PROGRESS",
        dueDate: "2023-04-20",
        created_at: "2023-03-01T09:00:00Z",
        updated_at: "2023-03-15T11:45:00Z",
      },
      {
        id: "task-3",
        title: "Design review for common areas",
        description: "Review and finalize designs for lobby and recreational areas",
        assignee: "John Smith",
        assigneeAvatar: "https://randomuser.me/api/portraits/men/1.jpg",
        worker_id: "1",
        status: "PENDING",
        dueDate: "2023-04-30",
        created_at: "2023-03-10T14:00:00Z",
        updated_at: "2023-03-10T14:00:00Z",
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
      {
        id: 2,
        name: "Steel Reinforcement",
        quantity: 300,
        unit: "tons",
        cost: 120000,
        status: "Partially Delivered",
      },
      {
        id: 3,
        name: "Glass Panels",
        quantity: 200,
        unit: "panels",
        cost: 80000,
        status: "Ordered",
      },
      {
        id: 4,
        name: "Electrical Wiring",
        quantity: 10000,
        unit: "meters",
        cost: 35000,
        status: "Pending",
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
      {
        id: 2,
        date: "2023-03-01",
        category: "Labor",
        description: "Foundation team - February",
        amount: 650000,
        status: "Approved",
      },
      {
        id: 3,
        date: "2023-03-15",
        category: "Equipment",
        description: "Crane rental - 2 weeks",
        amount: 200000,
        status: "Approved",
      },
      {
        id: 4,
        date: "2023-04-01",
        category: "Permits",
        description: "Permits and approvals",
        amount: 100000,
        status: "Approved",
      },
      {
        id: 5,
        date: "2023-04-10",
        category: "Other",
        description: "Miscellaneous expenses",
        amount: 50000,
        status: "Approved",
      },
    ],
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
      {
        id: "5",
        name: "Emily Davis",
        role: "Interior Designer",
        avatar: "https://randomuser.me/api/portraits/women/5.jpg",
      },
      {
        id: "6",
        name: "Robert Wilson",
        role: "Safety Manager",
        avatar: "https://randomuser.me/api/portraits/men/6.jpg",
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
      {
        id: "task-5",
        title: "Lobby design finalization",
        description: "Finalize materials and layout for main lobby",
        assignee: "Emily Davis",
        assigneeAvatar: "https://randomuser.me/api/portraits/women/5.jpg",
        worker_id: "5",
        status: "PENDING",
        dueDate: "2023-05-30",
        created_at: "2023-04-05T09:00:00Z",
        updated_at: "2023-04-05T09:00:00Z",
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
      {
        id: 6,
        name: "Glass Curtain Wall",
        quantity: 15000,
        unit: "sq meters",
        cost: 900000,
        status: "Ordered",
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
      {
        id: 7,
        date: "2023-04-01",
        category: "Materials",
        description: "Initial steel delivery",
        amount: 1200000,
        status: "Approved",
      },
      {
        id: 8,
        date: "2023-04-10",
        category: "Labor",
        description: "Labor costs for setup",
        amount: 500000,
        status: "Approved",
      },
      {
        id: 9,
        date: "2023-04-15",
        category: "Equipment",
        description: "Equipment rental",
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
    setSelectedProject((prev) => ({
      ...prev,
      tasks: [...(prev.tasks || []), task],
    }))
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
    setSelectedProject((prev) => ({
      ...prev,
      tasks: prev.tasks?.filter((task: any) => task.id !== taskId),
    }))
  }

  // Actualizar el estado de una tarea
  const updateTaskStatus = (taskId: string, newStatus: string) => {
    setSelectedProject((prev) => ({
      ...prev,
      tasks: prev.tasks?.map((task: any) => (task.id === taskId ? { ...task, status: newStatus } : task)),
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
    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    saveChanges,
    discardChanges,
    isSaving,
  }

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
}
