"use client"

import React, {createContext, useContext, useState, useEffect, type ReactNode, useCallback} from "react"
import type { Project } from "@/components/projects/projects-selector"
import { isEqual } from "lodash"
import {addProjectToBackend, fetchProjects, updateProjectToBackend} from "@/app/actions/project";
import {getCookie} from "cookies-next";
import Swal from "sweetalert2";

// Tipos para el contexto
interface ProjectContextType {
  projects: Project[]
  selectedProject: Project | null
  originalSelectedProject: Project | null
  pendingChanges: Partial<Project> | null // Nuevo: cambios pendientes
  setAllProjects: (projects: Project[]) => void
  setSelectedProjectById: (id: number) => void

  // Métodos para modificar el proyecto
  addProject: (project: Partial<Project>) => Promise<void>
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

  // Métodos para los gastos
  addExpense: (expense: any) => void
  updateExpense: (expenseId: number, updatedExpense: any) => void
  deleteExpense: (expenseId: number) => void
  updateExpenseStatus: (expenseId: number, newStatus: "approved" | "pending" | "rejected") => void

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

interface ProjectProviderProps {
  children: React.ReactNode
  dictionary?: any
}
// Provider component
export function ProjectProvider({ children, dictionary }: ProjectProviderProps) {
  const [projects, setProjects] = useState<Project[]>([])
  // Estado para el proyecto seleccionado y su versión original
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [originalSelectedProject, setOriginalSelectedProject] = useState<Project | null>(null)
  const [pendingChanges, setPendingChanges] = useState<Partial<Project> | null>(null) // Nuevo: cambios pendientes
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
        } else if (response.statusCode === 500) {
          console.error("ERROR al cargar los proyectos:", response)
          setError("Error al cargar los proyectos")
        } else {
          setAllProjects([])
          console.warn("No projects found or error in response:", response)
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
      setPendingChanges(null) // Limpiar cambios pendientes al cambiar de proyecto
    }
  }, [selectedProjectId, projects])

  // Detectar cambios en el proyecto seleccionado
  useEffect(() => {
    if (pendingChanges) {
      setHasChanges(true)
    } else {
      setHasChanges(false)
    }
  }, [pendingChanges])

  // Función para seleccionar un proyecto por ID
  const setSelectedProjectById = (id: number) => {
    setSelectedProjectId(id)
  }

  // Función para establecer todos los proyectos
  const setAllProjects = (projects: Project[]) => {
    setProjects(projects)
    if (projects.length > 0) {
      setSelectedProjectId(projects[0].id)
    }
  }

  // Función para añadir un nuevo proyecto
  const addProject = async (project: Partial<Project>) => {
    setIsSaving(true)

    console.log("Añadiendo proyecto:", project)

    try {
      // Enviar el proyecto al backend
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
          setError(response.message || "Error al añadir el proyecto")
        }
      })
    } catch (error) {
      console.error("Error al añadir el proyecto:", error)
      setError(error instanceof Error ? error.message : "Error al añadir el proyecto")
    } finally {
      setIsSaving(false)
    }
  }

  // Guardar cambios
  const saveChanges = async () => {
    if (!hasChanges || !selectedProject || !pendingChanges) return
    setIsSaving(true) // Iniciar el estado de guardado

    try {
      // Crear el objeto con los cambios para enviar al backend
      const changesToSend = {
        id: selectedProject.id,
        ...pendingChanges
      };

      const response = await updateProjectToBackend(getToken(), changesToSend)
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
      setPendingChanges(null) // Limpiar cambios pendientes
      console.log("Cambios guardados con éxito")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al guardar los cambios")
      console.error("Error al guardar los cambios:", error)
    } finally {
      setIsSaving(false)
    }
  }

  // Helper function para actualizar cambios pendientes
  const updatePendingChanges = (updates: Partial<Project>) => {
    setPendingChanges(prev => ({
      ...prev,
      ...updates
    }));
  }

  const addTeamMember = (member: any) => {
    if (!selectedProject) return;

    const updatedTeam = [...(selectedProject.team || []), member];
    setSelectedProject(prev => prev ? {...prev, team: updatedTeam} : prev);

    updatePendingChanges({
      team: updatedTeam
    });
  }

  // Añadir una tarea
  const addTask = (task: any) => {
    if (!selectedProject) return;

    const newTasks = [...(selectedProject.tasks || []), task];
    const progress = {
      ...selectedProject.progress,
      todo: newTasks.filter((t: any) => t.status === "todo").length || 0,
      done: newTasks.filter((t: any) => t.status === "done").length || 0,
      inProgress: newTasks.filter((t: any) => t.status === "in_progress").length || 0,
    };

    setSelectedProject(prev => prev ? {
      ...prev,
      tasks: newTasks,
      progress,
    } : prev);

    updatePendingChanges({
      tasks: newTasks
    });
  }

  // Actualizar una tarea
  const updateTask = (taskId: number, updatedTask: any) => {
    if (!selectedProject) return;

    const updatedTasks = selectedProject.tasks?.map((task: any) =>
        task.id === taskId ? { ...task, ...updatedTask } : task
    ) || [];

    setSelectedProject(prev => prev ? {
      ...prev,
      tasks: updatedTasks,
    } : prev);

    updatePendingChanges({
      tasks: updatedTasks
    });
  }

  // Eliminar una tarea
  const deleteTask = (taskId: number) => {
    if (!selectedProject) return;

    const newTasks = selectedProject.tasks?.filter((task: any) => task.id !== taskId) || [];
    const progress = {
      ...selectedProject.progress,
      todo: newTasks.filter((t: any) => t.status === "todo").length || 0,
      done: newTasks.filter((t: any) => t.status === "done").length || 0,
      inProgress: newTasks.filter((t: any) => t.status === "in_progress").length || 0,
    };

    setSelectedProject(prev => prev ? {
      ...prev,
      tasks: newTasks,
      progress,
    } : prev);

    updatePendingChanges({
      tasks: newTasks
    });
  }

  // Actualizar el estado de una tarea
  const updateTaskStatus = (taskId: number, newStatus: string) => {
    if (!selectedProject) return;

    const updatedTasks = selectedProject.tasks?.map((task: any) =>
        task.id === taskId ? { ...task, status: newStatus } : task
    ) || [];

    const progress = {
      ...selectedProject.progress,
      todo: updatedTasks.filter((task: any) => task.status === "todo").length || 0,
      done: updatedTasks.filter((task: any) => task.status === "done").length || 0,
      inProgress: updatedTasks.filter((task: any) => task.status === "in_progress").length || 0,
    };

    setSelectedProject(prev => prev ? {
      ...prev,
      tasks: updatedTasks,
      progress,
    } : prev);

    updatePendingChanges({
      tasks: updatedTasks
    });
  }

  // Métodos para gestionar el inventario -----------------------------------------------------------------------------

  // Añadir un item al inventario
  const addInventoryItem = (item: any) => {
    if (!selectedProject) return;

    const newItem = {
      ...item,
      id: Math.max(0, ...(selectedProject.inventory?.map(i => i.id ?? 0) || [])) + 1
    };

    const updatedInventory = [...(selectedProject.inventory || []), newItem];

    setSelectedProject(prev => prev ? {
      ...prev,
      inventory: updatedInventory,
    } : prev);

    updatePendingChanges({
      inventory: updatedInventory
    });
  }

  // Actualizar un item del inventario
  const updateInventoryItem = (itemId: number, updatedItem: any) => {
    if (!selectedProject) return;

    const updatedInventory = selectedProject.inventory?.map((item) =>
        item.id === itemId ? { ...item, ...updatedItem } : item
    ) || [];

    setSelectedProject(prev => prev ? {
      ...prev,
      inventory: updatedInventory,
    } : prev);

    updatePendingChanges({
      inventory: updatedInventory
    });
  }

  // Eliminar un item del inventario
  const deleteInventoryItem = (itemId: number) => {
    if (!selectedProject) return;

    const updatedInventory = selectedProject.inventory?.filter((item) => item.id !== itemId) || [];

    setSelectedProject(prev => prev ? {
      ...prev,
      inventory: updatedInventory,
    } : prev);

    updatePendingChanges({
      inventory: updatedInventory
    });
  }

  // Actualizar el estado de un item del inventario
  const updateInventoryItemStatus = (itemId: number, newStatus: "Installed" | "Pending" | "In_Budget") => {
    if (!selectedProject) return;

    const updatedInventory = selectedProject.inventory?.map((item) =>
        item.id === itemId ? { ...item, status: newStatus } : item
    ) || [];

    setSelectedProject(prev => prev ? {
      ...prev,
      inventory: updatedInventory,
    } : prev);

    updatePendingChanges({
      inventory: updatedInventory
    });
  }

  // Añadir un gasto
  const addExpense = (expense: any) => {
    if (!selectedProject) return;

    const newExpense = {
      ...expense,
      id: Math.max(0, ...(selectedProject.expenses?.map(e => e.id ?? 0) || [])) + 1
    };

    const updatedExpenses = [...(selectedProject.expenses || []), newExpense];

    // Calcular nuevo currentSpent
    const newCurrentSpent = updatedExpenses
        .filter(e => e.status === 'approved')
        .reduce((sum, e) => sum + (e.amount || 0), 0);

    // Actualizar categorías de gastos
    const updatedExpenseCategories = { ...selectedProject.expenseCategories };
    if (expense.category) {
      updatedExpenseCategories[expense.category] =
          (updatedExpenseCategories[expense.category] || 0) + (expense.amount || 0);
    }

    setSelectedProject(prev => prev ? {
      ...prev,
      expenses: updatedExpenses,
      currentSpent: newCurrentSpent,
      expenseCategories: updatedExpenseCategories
    } : prev);

    updatePendingChanges({
      expenses: updatedExpenses
    });
  }

// Actualizar un gasto
  const updateExpense = (expenseId: number, updatedExpense: any) => {
    if (!selectedProject) return;

    const updatedExpenses = selectedProject.expenses?.map((expense) =>
        expense.id === expenseId ? { ...expense, ...updatedExpense } : expense
    ) || [];

    // Recalcular currentSpent y categorías si cambió el amount o status
    let newCurrentSpent = selectedProject.currentSpent;
    let updatedExpenseCategories = { ...selectedProject.expenseCategories };

    if (updatedExpense.amount || updatedExpense.status || updatedExpense.category) {
      newCurrentSpent = updatedExpenses
          .filter(e => e.status === 'approved')
          .reduce((sum, e) => sum + (e.amount || 0), 0);

      // Recalcular todas las categorías desde cero
      updatedExpenseCategories = {};
      updatedExpenses.forEach(expense => {
        if (expense.category && expense.amount) {
          updatedExpenseCategories[expense.category] =
              (updatedExpenseCategories[expense.category] || 0) + expense.amount;
        }
      });
    }

    setSelectedProject(prev => prev ? {
      ...prev,
      expenses: updatedExpenses,
      currentSpent: newCurrentSpent,
      expenseCategories: updatedExpenseCategories
    } : prev);

    updatePendingChanges({
      expenses: updatedExpenses
    });
  }

// Eliminar un gasto
  const deleteExpense = (expenseId: number) => {
    if (!selectedProject) return;

    const expenseToDelete = selectedProject.expenses?.find(e => e.id === expenseId);
    const updatedExpenses = selectedProject.expenses?.filter((expense) => expense.id !== expenseId) || [];

    // Calcular nuevo currentSpent
    const newCurrentSpent = updatedExpenses
        .filter(e => e.status === 'approved')
        .reduce((sum, e) => sum + (e.amount || 0), 0);

    // Actualizar categorías de gastos
    const updatedExpenseCategories = { ...selectedProject.expenseCategories };
    if (expenseToDelete?.category && expenseToDelete.amount) {
      updatedExpenseCategories[expenseToDelete.category] =
          Math.max(0, (updatedExpenseCategories[expenseToDelete.category] || 0) - expenseToDelete.amount);
    }

    setSelectedProject(prev => prev ? {
      ...prev,
      expenses: updatedExpenses,
      currentSpent: newCurrentSpent,
      expenseCategories: updatedExpenseCategories
    } : prev);

    updatePendingChanges({
      expenses: updatedExpenses
    });
  }

// Actualizar el estado de un gasto
  const updateExpenseStatus = (expenseId: number, newStatus: "approved" | "pending" | "rejected") => {
    if (!selectedProject) return;

    const updatedExpenses = selectedProject.expenses?.map((expense) =>
        expense.id === expenseId ? { ...expense, status: newStatus } : expense
    ) || [];

    // Recalcular currentSpent basado en gastos aprobados
    const newCurrentSpent = updatedExpenses
        .filter(e => e.status === 'approved')
        .reduce((sum, e) => sum + (e.amount || 0), 0);

    setSelectedProject(prev => prev ? {
      ...prev,
      expenses: updatedExpenses,
      currentSpent: newCurrentSpent
    } : prev);

    updatePendingChanges({
      expenses: updatedExpenses
    });
  }


  // Función para mostrar errores
  const showErrorAlert = useCallback((errorMessage: string) => {
    Swal.fire({
      title: dictionary?.common?.errorTitle || 'Error',
      text: errorMessage,
      icon: 'error',
      confirmButtonText: dictionary?.common.acept || 'Aceptar',
      footer: dictionary?.notifications?.urgentHelp || 'Si es urgente, contacte a soporte inmediatamente'
    });
  }, [dictionary]);

  // Efecto para mostrar errores cuando cambien
  useEffect(() => {
    if (error) {
      showErrorAlert(error);
    }
  }, [error, showErrorAlert]);

  // Descartar cambios
  const discardChanges = () => {
    // Restaurar el proyecto seleccionado a su versión original
    if (originalSelectedProject) {
      setSelectedProject({ ...originalSelectedProject })
      setPendingChanges(null)
    }
  }

  // Valor del contexto
  const value = {
    projects,
    setAllProjects,
    selectedProject,
    originalSelectedProject,
    pendingChanges, // Exponer cambios pendientes
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
    // Métodos para los gastos
    addExpense,
    updateExpense,
    deleteExpense,
    updateExpenseStatus,
    // Métodos para guardar/descartar cambios
    saveChanges,
    discardChanges,
    isSaving,
    loadingState: loading,
    errorState: error,
  }

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
}