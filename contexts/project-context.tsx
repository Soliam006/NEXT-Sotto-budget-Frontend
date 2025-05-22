"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Project } from "@/components/dashboard/projects-selector"
import { isEqual } from "lodash"
import {addProjectToBackend, fetchProjects, updateProjectToBackend} from "@/app/actions/project";
import {getCookie} from "cookies-next";

// Tipos para el contexto
interface ProjectContextType {
  projects: Project[]
  selectedProject: Project | null
  originalSelectedProject: Project | null
  setAllProjects: (projects: Project[]) => void
  setSelectedProjectById: (id: number) => void

  // Métodos para modificar el proyecto
  addProject: (project: Omit<Project, "id">) => Promise<void>
  addTeamMember: (member: any) => void
  addTask: (task: any) => void
  updateTask: (taskId: number, updatedTask: any) => void
  deleteTask: (taskId: number) => void
  updateTaskStatus: (taskId: number, newStatus: string) => void

  // Métodos para el inventario
  addInventoryItem: (item: any) => void
  updateInventoryItem: (itemId: number, updatedItem: any) => void
  deleteInventoryItem: (itemId: number) => void
  updateInventoryItemStatus: (itemId: number, newStatus: "Installed" | "Pending" | "In_Budget") => void

  // Métodos para guardar/descartar cambios
  hasChanges: boolean
  saveChanges: () => Promise<void>
  discardChanges: () => void
  // Métodos para cargar
  loadingState: boolean
  errorState: string | null

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
const getToken = () => {
  const token = getCookie('access_token');
  return token ? String(token) : null;
};

// Provider component
export function ProjectProvider({ children }: { children: ReactNode }) {

  const [projects, setProjects] = useState<Project[]>([])
  // Estado para el proyecto seleccionado y su versión original
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [originalSelectedProject, setOriginalSelectedProject] = useState<Project | null>(null)
  // Estado para rastrear cambios y guardado
  const [hasChanges, setHasChanges] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  function cargarProjectos() {
    setLoading(true) // Iniciar el estado de carga
    setError(null) // Reiniciar el error

    try {
      // Llamar a la API para obtener proyectos
      fetchProjects(getToken()).then((response) => {
        if (response.statusCode === 200) {
          console.log("Proyectos cargados con éxito:", response.data)
          setAllProjects(response.data)
          if (response.data.length > 0) {
            setSelectedProjectId(response.data[0].id)
          }
        } else {
          console.error("ERROR al cargar los proyectos:", response)
          setError("Error al cargar los proyectos")
        }
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      console.error("Error fetching projects:", err)
    } finally {
      setLoading(false)
    }
  }
  // Cargar de proyectos desde una API
  useEffect(() => {
    cargarProjectos()
  }, [])


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
    if (selectedProject && originalSelectedProject) {
      // Comparar el proyecto seleccionado con su versión original
      const projectChanged = !isEqual(selectedProject, originalSelectedProject)
      setHasChanges(projectChanged)
    }
  }, [selectedProject, originalSelectedProject])

  // Función para seleccionar un proyecto por ID
  const setSelectedProjectById = (id: number) => {
    setSelectedProjectId(id)
  }

  // Función para establecer todos los proyectos
  const setAllProjects = (projects: Project[]) => {
    setProjects(projects)
    setSelectedProjectId(projects[0].id)
  }

  // Función para añadir un nuevo proyecto
  const addProject = async (project: Omit<Project, "id">) => {
    setIsSaving(true)

    try {
      // Simular una llamada a la API
      await new Promise((resolve) => setTimeout(resolve, 1500))
      addProjectToBackend(getToken(), project).then((response) => {
        if (response.statusCode === 200) {
          console.log("Proyecto añadido con éxito:", response.data)

          const newProject = response.data;
          // Añadir el proyecto a la lista
          setProjects(prev => [...prev, newProject])
          // Seleccionar el nuevo proyecto
          setSelectedProjectId(newProject.id)
          return newProject
        } else {
          console.error("Error al añadir el proyecto:", response)
          throw new Error("Error al añadir el proyecto")
        }
      })

    } catch (error) {
      console.error("Error al añadir el proyecto:", error)
    } finally {
      setIsSaving(false)
    }
  }


  // Guardar cambios
  const saveChanges = async () => {
    if (!hasChanges || !selectedProject) return
    setIsSaving(true) // Iniciar el estado de guardado

    try {
      // Simular una llamada a la API
      const response = await updateProjectToBackend(getToken(), selectedProject)
      if (response.statusCode !== 200) {
          console.error("Error al guardar los cambios:", response)
          throw new Error("Error al guardar los cambios")
      }

      const updatedProject = response.data;

      console.log("Proyecto actualizado con éxito:", response.data)

      // Actualizar la lista de proyectos con el proyecto modificado
      setProjects(prev =>
          prev.map(p => p.id === updatedProject.id ? updatedProject : p)
      )

      // Actualizar la versión original del proyecto seleccionado
      setSelectedProject(updatedProject)
      setOriginalSelectedProject(updatedProject)
      console.log("Cambios guardados con éxito")
    } catch (error) {
      console.error("Error al guardar los cambios:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const addTeamMember = (member: any) => {
    setSelectedProject((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        team: [...(prev.team || []), member],
      };
    });
  }

    // Añadir una tarea
  const addTask = (task: any) => {
    setSelectedProject((prev) => {
      if (!prev) return prev;
      const newTasks = [...(prev.tasks || []), task];
      const progress = {
        ...prev.progress,
        todo: newTasks.filter((t: any) => t.status === "todo").length || 0,
        done: newTasks.filter((t: any) => t.status === "done").length || 0,
        inProgress: newTasks.filter((t: any) => t.status === "in_progress").length || 0,
      };
      return {
        ...prev,
        tasks: newTasks,
        progress,
      };
    });
  }

  // Actualizar una tarea
  const updateTask = (taskId: number, updatedTask: any) => {
    setSelectedProject((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        tasks: prev.tasks?.map((task: any) => (task.id === taskId ? { ...task, ...updatedTask } : task)),
      };
    });
  }

  // Eliminar una tarea
  const deleteTask = (taskId: number) => {
    setSelectedProject((prev) => {
      if (!prev) return prev;
      const newTasks = prev.tasks?.filter((task: any) => task.id !== taskId) || [];
      const progress = {
        ...prev.progress,
        todo: newTasks.filter((t: any) => t.status === "todo").length || 0,
        done: newTasks.filter((t: any) => t.status === "done").length || 0,
        inProgress: newTasks.filter((t: any) => t.status === "in_progress").length || 0,
      };
      return {
        ...prev,
        tasks: newTasks,
        progress,
      };
    });
  }

  // Actualizar el estado de una tarea
  const updateTaskStatus = (taskId: number, newStatus: string) => {
    setSelectedProject((prev) => {
      if (!prev) return prev;
      // Actualizar el estado de la tarea
      const updatedTasks = prev.tasks?.map((task: any) =>
          task.id === taskId ? { ...task, status: newStatus } : task
      ) || [];

      // Recalcular el progreso
      const progress = {
        ...prev.progress,
        todo: updatedTasks.filter((task: any) => task.status === "todo").length || 0,
        done: updatedTasks.filter((task: any) => task.status === "done").length || 0,
        inProgress: updatedTasks.filter((task: any) => task.status === "in_progress").length || 0,
      };

      return {
        ...prev,
        tasks: updatedTasks,
        progress,
      };
    });
  }

  // Métodos para gestionar el inventario -----------------------------------------------------------------------------

  // Añadir un item al inventario
  const addInventoryItem = (item: any) => {
    setSelectedProject((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        inventory: [
          ...(prev.inventory || []),
          {
            ...item,
            id: Math.max(0, ...(prev.inventory?.map(i => i.id ?? 0) || [])) + 1
          }
        ],
      };
    });
  }
  // Actualizar un item del inventario
  const updateInventoryItem = (itemId: number, updatedItem: any) => {
    setSelectedProject((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        inventory: prev.inventory?.map((item) =>
            item.id === itemId ? { ...item, ...updatedItem } : item
        ),
      };
    });
  }
  // Eliminar un item del inventario
  const deleteInventoryItem = (itemId: number) => {
    setSelectedProject((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            inventory: prev.inventory?.filter((item) => item.id !== itemId),
          }
        }
    )
  }

  // Actualizar el estado de un item del inventario
  const updateInventoryItemStatus =
      (itemId: number, newStatus: "Installed" | "Pending" | "In_Budget") => {
        setSelectedProject((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            inventory: prev.inventory?.map((item) =>
                item.id === itemId ? { ...item, status: newStatus } : item
            ),
          };
        })
  }


  // Descartar cambios
  const discardChanges = () => {
    // Restaurar el proyecto seleccionado a su versión original
    if (originalSelectedProject) {
      setSelectedProject({ ...originalSelectedProject })
    }
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
    loadingState : loading,
    errorState : error,
  }

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
}
