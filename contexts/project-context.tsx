"use client"

import React, {createContext, useContext, useState, useEffect, type ReactNode, useCallback} from "react"
import {addProjectToBackend, fetchProjects, updateProjectToBackend} from "@/app/actions/project";
import {getCookie} from "cookies-next";
import Swal from "sweetalert2";
import {Project, ProjectBackend} from "@/lib/types/project.types";
import {InventoryItem, InventoryItemBackend} from "@/lib/types/inventory-item";
import {useUser} from "@/contexts/UserProvider";
import {WorkerData, WorkerDataBackend} from "@/lib/types/user.types";
import {Task, TaskBackend} from "@/lib/types/tasks";
import {Expenses, ExpensesBackend} from "@/lib/types/expenses";

// Tipos para el contexto
interface ProjectContextType {
  projects: Project[]
  selectedProject: Project | null
  originalSelectedProject: Project | null
  pendingChanges: Partial<ProjectBackend> | null // Nuevo: cambios pendientes
  setAllProjects: (projects: Project[]) => void
  setSelectedProjectById: (id: number) => void

  // Métodos para modificar el proyecto
  addProject: (project: Partial<Project>) => Promise<void>
  addTeamMember: (member: WorkerData) => void
  addTask: (task: Task) => void
  updateTask: (taskId: number, updatedTask: any) => void
  deleteTask: (taskId: number) => void
  updateTaskStatus: (taskId: number, newStatus:  "todo" | "in_progress" | "done") => void

  // Métodos para el inventario
  addInventoryItem: (item: any) => void
  updateInventoryItem: (itemId: number, updatedItem: any) => void
  deleteInventoryItem: (itemId: number) => void
  updateInventoryItemStatus: (itemId: number, newStatus: "Installed" | "Pending" | "In_Budget") => void

  // Métodos para los gastos
  addExpense: (expense: any) => void
  updateExpense: (expenseId: number, updatedExpense: any) => void
  deleteExpense: (expenseId: number) => void
  updateExpenseStatus: (expenseId: number, newStatus: "Approved" | "Pending" | "Rejected") => void

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
  const { user, token } = useUser(); // <-- Obtener user y token del UserProvider


  const [projects, setProjects] = useState<Project[]>([])
  // Estado para el proyecto seleccionado y su versión original
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [originalSelectedProject, setOriginalSelectedProject] = useState<Project | null>(null)
  const [pendingChanges, setPendingChanges] = useState<Partial<ProjectBackend> | null>(null) // Nuevo: cambios pendientes
  // Estado para rastrear cambios y guardado
  const [hasChanges, setHasChanges] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  function cargarProjectos() {
    setLoading(true) // Iniciar el estado de carga
    setError(null) // Reiniciar el error
    setAllProjects([])
    setSelectedProjectId(null)
    setSelectedProject(null)
    setOriginalSelectedProject(null)
    setPendingChanges(null)
    setHasChanges(false) // No hay cambios pendientes si no hay proyectos

    try {
      // Llamar a la API para obtener proyectos
      fetchProjects(getToken()).then((response) => {
        if (response.statusCode === 200) {
          console.log("RESPONSE: ", response)
          if (!response.data || response.data.length === 0) {
            setInfo("¡No hay proyectos disponibles!")

            return
          }

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
  }, [user?.id, token])

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
    console.log("ACTUALIZANDO PENDING CHANGES : ", pendingChanges)
      if ((pendingChanges?.team && pendingChanges.team.length > 0) ||
            (pendingChanges?.tasks && pendingChanges.tasks.length > 0) ||
            (pendingChanges?.inventory && pendingChanges.inventory.length > 0) ||
            (pendingChanges?.expenses && pendingChanges.expenses.length > 0)) {
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

        console.log("Guardando cambios para el proyecto:", changesToSend)

        const response = await updateProjectToBackend(getToken(), changesToSend)

          console.log("Response from backend:", response)
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

        setInfo( dictionary?.info?.changesSaved || "Changes saved successfully")

      } catch (error) {
        setError(error instanceof Error ? error.message : "Error al guardar los cambios")
        console.error("Error al guardar los cambios:", error)
      } finally {
        setIsSaving(false)
      }
  }

  // Helper function para actualizar cambios pendientes
  const updatePendingChanges = (updates: Partial<ProjectBackend>) => {
      setPendingChanges(prev => ({
        ...prev,
        ...updates
      }));
  }

  const addTeamMember = (member: WorkerData) => {
      if (!selectedProject) return;

      const updatedTeam = [...(selectedProject.team || []), member];
      setSelectedProject(prev => prev ? {...prev, team: updatedTeam} : prev);

      const workerback: WorkerDataBackend = {
          ...member,
          projects: [selectedProject.title], // Asegurarse de que el proyecto esté asociado
          updated: false, // Indica que no ha sido actualizado
          deleted: false, // Indica que no está eliminado
          created: true // Indica que es un nuevo miembro
      }
      // Filtrar duplicados en pendingChanges
      const filteredPendingTeam = (pendingChanges?.team || []).filter(
            (m: WorkerDataBackend) => m.id !== member.id
      );

      updatePendingChanges({
            team: [...(filteredPendingTeam || []), workerback]
      });
  }

  // Añadir una tarea
  const addTask = (task: Task) => {
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

      const newTask: TaskBackend = {
          ...task,
          deleted: false,
          updated: false,
          created: true // Indica que es una nueva tarea
      }

      updatePendingChanges({
          tasks: [...(pendingChanges?.tasks || []), newTask]
      });
  }

  // Actualizar una tarea
  const updateTask = (taskId: number, updatedTask: Task) => {
      if (!selectedProject) return;

      const updatedTasks = selectedProject.tasks?.map((task: Task) =>
          task.id === taskId ? { ...task, ...updatedTask } : task
      ) || [];

      setSelectedProject(prev => prev ? {
        ...prev,
        tasks: updatedTasks,
      } : prev);

      const originalTaskList = originalSelectedProject?.tasks
      const taskToUpdate = originalTaskList?.find((task: Task) => task.id === taskId);
      if (!taskToUpdate) {
        // Si la tarea existe en el original, creamos una versión actualizada
        const updatedTaskWithId: TaskBackend = {
          ...updatedTask,
          id: taskId,
          updated: false ,
          created: true, // Si no estaba en el original, la consideramos creada
          deleted: false // No está eliminada
        };

        // Filtramos las tareas pendientes para evitar duplicados
        const filteredPendingTasks = (pendingChanges?.tasks || []).filter(
            (task: TaskBackend) => task.id !== taskId
        );

        updatePendingChanges({
          tasks: [...filteredPendingTasks, updatedTaskWithId]
        });
      } else {
        // En cambio, si ya estaba en el Original, debo actualizar el Backend
        const taskWithUpdated: TaskBackend = {
          ...taskToUpdate,
          ...updatedTask,
          updated: true, // Indica que la tarea ha sido actualizada
          created: false,
          deleted: false
        }

        // Filtramos las tareas pendientes para evitar duplicados
        const filteredPendingTasks = (pendingChanges?.tasks || []).filter(
            (task: TaskBackend) => task.id !== taskId
        );

        updatePendingChanges({
          tasks: [...filteredPendingTasks , taskWithUpdated]
        });
      }
  }

  // Eliminar una tarea
  const deleteTask = (taskId: number) => {
      if (!selectedProject) return;

      const newTasks = selectedProject.tasks?.filter((task: Task) => task.id !== taskId) || [];
      const progress = {
        ...selectedProject.progress,
        todo: newTasks.filter((t: any) => t.status === "todo").length || 0,
        done: newTasks.filter((t: any) => t.status === "done").length || 0,
        inProgress: newTasks.filter((t: any) => t.status === "in_progress").length || 0,
      };

      const originalTaskList = originalSelectedProject?.tasks
      const taskToDelete = originalTaskList?.find((task: Task) => task.id === taskId);

      if (!taskToDelete) {
        //Filtrar tareas pendientes para eliminar la tarea
        const updatedPendingTasks = pendingChanges?.tasks?.filter((task: Task) => task.id !== taskId) || [];

        updatePendingChanges({
          tasks: [...(updatedPendingTasks || [])]
        })
      } else {
        // Crear el task con deleted true y guardar los cambios pendientes
        const taskWithDeleted: TaskBackend = {
          ...taskToDelete,
          deleted: true, // Indica que la tarea ha sido eliminada
          updated: false,
          created: false
        }

        // Filtramos las tareas pendientes para evitar duplicados
        const filteredPendingTasks = (pendingChanges?.tasks || []).filter(
            (task: TaskBackend) => task.id !== taskId
        );

        updatePendingChanges({
          tasks: [...filteredPendingTasks, taskWithDeleted]
        });
      }

      // Actualizar el estado del proyecto seleccionado
      setSelectedProject(prev => prev ? {
          ...prev,
          tasks: newTasks,
          progress,
      } : prev);
  }

  // Actualizar el estado de una tarea
  const updateTaskStatus = (taskId: number, newStatus: "todo" | "in_progress" | "done") => {
      if (!selectedProject) return;

      // Actualiza el estado de la tarea en la lista de tareas
      const updatedTasks = selectedProject.tasks?.map((task: Task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      ) || [];

      // Recalcula el progreso
      const progress = {
        ...selectedProject.progress,
        todo: updatedTasks.filter((task: Task) => task.status === "todo").length,
        done: updatedTasks.filter((task: Task) => task.status === "done").length,
        inProgress: updatedTasks.filter((task: Task) => task.status === "in_progress").length,
      };

      setSelectedProject(prev => prev ? {
        ...prev,
        tasks: updatedTasks,
        progress,
      } : prev);

      // Busca la tarea original para saber si es nueva o existente
      const taskInOriginal = (originalSelectedProject?.tasks || [])
                  .find((task: Task) => task.id === taskId);

      // Prepara la tarea para pendingChanges
      let updatedTaskBackend: TaskBackend;
      if (taskInOriginal) {
        updatedTaskBackend = {
          ...taskInOriginal,
          status: newStatus,
          updated: true,
          created: false,
          deleted: false,
        };
      } else {
        const newTask = updatedTasks.find((task: Task) => task.id === taskId);
        updatedTaskBackend = {
          ...(newTask as Task),
          updated: false,
          created: true,
          deleted: false,
        };
      }

      // Filtra duplicados en pendingChanges
      const filteredPendingTasks = (pendingChanges?.tasks || []).filter(
        (task: TaskBackend) => task.id !== taskId
      );

      updatePendingChanges({
        tasks: [...filteredPendingTasks, updatedTaskBackend],
      });
  }

  // Métodos para gestionar el inventario -----------------------------------------------------------------------------

  // Añadir un item al inventario
  const addInventoryItem = (item: any) => {
      if (!selectedProject) return;

      try {
        const newItem = {
          ...item,
          id: Math.max(0, ...(selectedProject.inventory?.map(i => i.id ?? 0) || [])) + 1
        };

        const updatedInventory = [...(selectedProject.inventory || []), newItem];

        setSelectedProject(prev => prev ? {
          ...prev,
          inventory: updatedInventory,
        } : prev);

        // Verificar si ya existia en el Original
        const itemInOriginal = (originalSelectedProject?.inventory || [])
              .find((i: InventoryItem) => i.id === newItem.id);

        // Preparar el item para pendingChanges
        let updatedItemBackend: InventoryItemBackend;
          if (itemInOriginal) {
              updatedItemBackend  = {
                  ...newItem,
                  project_id: selectedProject.id, // Asegurarse de que el project_id esté presente
                  updated: true, // Es una actualización
                  created: false,
                  deleted: false
              };
          } else {
              updatedItemBackend = {
                  ...newItem,
                  project_id: selectedProject.id,
                  updated: false, // No es una actualización
                  created: true, // Es un nuevo item
                  deleted: false // No está eliminado
              };
          }
            // Filtrar duplicados en pendingChanges
        const filteredPendingInventory = (pendingChanges?.inventory || []).filter(
            (i: InventoryItemBackend) => i.id !== newItem.id);

        // Actualizar los cambios pendientes
        updatePendingChanges({
          inventory: [...filteredPendingInventory, updatedItemBackend]
        });

      } catch (error) {
          console.error("Error al añadir el item al inventario:", error);
          setError(error instanceof Error ? error.message : "Error al añadir el item al inventario");
      }
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

        // Verificar si ya existia en el Original
        const itemInOriginal = (originalSelectedProject?.inventory || [])
              .find((i: InventoryItem) => i.id === itemId);

        // Preparar el item para pendingChanges
        let itemWithUpdated: InventoryItemBackend;
        if (itemInOriginal) {
            itemWithUpdated = {
                ...itemInOriginal,
                ...updatedItem,
                project_id: selectedProject.id, // Asegurarse de que el project_id esté presente
                updated: true, // Es una actualización
                created: false,
                deleted: false
            };
        } else {
            itemWithUpdated = {
                ...updatedItem,
                id: itemId,
                project_id: selectedProject.id, // Asegurarse de que el project_id esté presente
                updated: false, // No es una actualización
                created: true, // Es un nuevo item
                deleted: false // No está eliminado
            };
        }
        // Filtrar duplicados en pendingChanges
        const filteredPendingInventory = (pendingChanges?.inventory || []).filter(
            (i: InventoryItemBackend) => i.id !== itemId);

        // Actualizar los cambios pendientes
        updatePendingChanges({
          inventory: [...filteredPendingInventory, itemWithUpdated]
        });
  }

  // Eliminar un item del inventario
  const deleteInventoryItem = (itemId: number) => {
        if (!selectedProject) return;

        const updatedInventory = selectedProject.inventory?.filter((item) => item.id !== itemId) || [];

        // Verificar si el item existe en el original
        const itemToDelete = (originalSelectedProject?.inventory || [])
            .find((i: InventoryItem) => i.id === itemId);

        // Si el item no existe en el original, no hacemos nada
        if (!itemToDelete) {
            // Filtrar duplicados en pendingChanges
            const filteredPendingInventory = (pendingChanges?.inventory || []).filter(
                (i: InventoryItemBackend) => i.id !== itemId
            );
            // Actualizar los cambios pendientes
            updatePendingChanges({
              inventory: [...filteredPendingInventory]
            });
        } else {
          // Si el item existe en el original, lo marcamos como eliminado
            const itemWithDeleted: InventoryItemBackend = {
                ...itemToDelete,
                project_id: selectedProject.id, // Asegurarse de que el project_id esté presente
                deleted: true, // Indica que el item ha sido eliminado
                updated: false,
                created: false
            };
            // Filtrar duplicados en pendingChanges
            const filteredPendingInventory = (pendingChanges?.inventory || []).filter(
                (i: InventoryItemBackend) => i.id !== itemId
            );
            // Actualizar los cambios pendientes
            updatePendingChanges({
              inventory: [...filteredPendingInventory, itemWithDeleted]
            });
        }
        // Actualizar el estado del proyecto seleccionado
        setSelectedProject(prev => prev ? {
          ...prev,
          inventory: updatedInventory,
        } : prev);

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

        // Verificar si ya existia en el Original
        const itemInOriginal = (originalSelectedProject?.inventory || [])
            .find((i: InventoryItem) => i.id === itemId);
        // Preparar el item para pendingChanges
        let itemWithUpdatedStatus: InventoryItemBackend;
        if (itemInOriginal) {
            itemWithUpdatedStatus = {
                ...itemInOriginal,
                status: newStatus,
                project_id: selectedProject.id, // Asegurarse de que el project_id esté presente
                updated: true, // Es una actualización
                created: false,
                deleted: false
            };
        } else {
            const newItem = updatedInventory.find((item: InventoryItem) => item.id === itemId);
            itemWithUpdatedStatus = {
                ...(newItem as InventoryItem),
                status: newStatus,
                project_id: selectedProject.id, // Asegurarse de que el project_id esté presente
                updated: false, // No es una actualización
                created: true, // Es un nuevo item
                deleted: false // No está eliminado
            };
        }
        // Filtrar duplicados en pendingChanges
        const filteredPendingInventory = (pendingChanges?.inventory || []).filter(
            (i: InventoryItemBackend) => i.id !== itemId
        );
        // Actualizar los cambios pendientes
        updatePendingChanges({
          inventory: [...filteredPendingInventory, itemWithUpdatedStatus]
        });
  }

  // Añadir un gasto
  const addExpense = (expense: Expenses) => {
        if (!selectedProject) return;

        const newExpense = {
          ...expense,
          id: Math.max(0, ...(selectedProject.expenses?.map(e => e.id ?? 0) || [])) + 1
        };

        const updatedExpenses = [...(selectedProject.expenses || []), newExpense];

        // Calcular nuevo currentSpent
        const newCurrentSpent = updatedExpenses
            .filter(e => e.status === 'Approved')
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

        // Preparar el gasto para pendingChanges
        const expenseWithCreated: ExpensesBackend = {
          ...newExpense,
          approved_by: newExpense.project_info.approved_by || "", // Asegurarse de que approved_by esté presente
          notes: newExpense.project_info.notes || "", // Asegurarse de que notes esté presente
          updated: false, // Indica que no ha sido actualizado
          deleted: false, // Indica que no está eliminado
          created: true // Indica que es un nuevo gasto
        };
        // Filtrar duplicados en pendingChanges
        const filteredPendingExpenses = (pendingChanges?.expenses || []).filter(
            (e: any) => e.id !== newExpense.id
        );
        // Actualizar los cambios pendientes
        updatePendingChanges({
          expenses: [...filteredPendingExpenses, expenseWithCreated]
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
              .filter(e => e.status === 'Approved')
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

        // Preparar el gasto para pendingChanges
        const originalExpense = originalSelectedProject?.expenses?.find(e => e.id === expenseId);
        let expenseWithUpdated: ExpensesBackend;
        if (originalExpense) {
          expenseWithUpdated = {
            ...originalExpense,
            ...updatedExpense,
            updated: true, // Indica que el gasto ha sido actualizado
            created: false, // No es un nuevo gasto
            deleted: false // No está eliminado
          };
        } else {
          expenseWithUpdated = {
            ...updatedExpense,
            id: expenseId,
            updated: false, // No es una actualización
            created: true, // Es un nuevo gasto
            deleted: false // No está eliminado
          };
        }
        // Filtrar duplicados en pendingChanges
        const filteredPendingExpenses = (pendingChanges?.expenses || []).filter(
            (e: ExpensesBackend) => e.id !== expenseId
        );
        // Actualizar los cambios pendientes
        updatePendingChanges({
          expenses: [...filteredPendingExpenses, expenseWithUpdated]
        });
  }

// Eliminar un gasto
  const deleteExpense = (expenseId: number) => {
      if (!selectedProject) return;

      // Buscar el gasto a eliminar
      const expenseToDelete = selectedProject.expenses?.find(e => e.id === expenseId);
      if (!expenseToDelete) return;

      // Actualizar la lista de gastos
      const updatedExpenses = selectedProject.expenses?.filter(e => e.id !== expenseId) || [];

      // Recalcular currentSpent y categorías de gastos
      const newCurrentSpent = updatedExpenses
          .filter(e => e.status === 'Approved')
          .reduce((sum, e) => sum + (e.amount || 0), 0);

      const updatedExpenseCategories = {...selectedProject.expenseCategories};
      if (expenseToDelete.category && expenseToDelete.amount) {
          updatedExpenseCategories[expenseToDelete.category] = Math.max(
              0,
              (updatedExpenseCategories[expenseToDelete.category] || 0) - expenseToDelete.amount
          );
      }

      setSelectedProject(prev => prev ? {
          ...prev,
          expenses: updatedExpenses,
          currentSpent: newCurrentSpent,
          expenseCategories: updatedExpenseCategories
      } : prev);

      // Verificar si el gasto existe en el original
      const expenseInOriginal = (originalSelectedProject?.expenses || []).find(e => e.id === expenseId);

      const filteredPendingExpenses = (pendingChanges?.expenses || []).filter(e => e.id !== expenseId);

      if (expenseInOriginal) {
          // Si existe en el original, marcar como eliminado
          const expenseWithDeleted: ExpensesBackend = {
              ...expenseInOriginal,
              approved_by : expenseInOriginal.project_info?.approved_by || "", // Asegurarse de que approved_by esté presente
                notes: expenseInOriginal.project_info?.notes || "", // Asegurarse de que notes esté presente
              deleted: true,
              updated: false,
              created: false
          };
          updatePendingChanges({
              expenses: [...filteredPendingExpenses, expenseWithDeleted]
          });
      } else {
          // Si no existe en el original, solo actualizar los cambios pendientes
          updatePendingChanges({
              expenses: [...filteredPendingExpenses]
          });
      }
  }
// Actualizar el estado de un gasto
  const updateExpenseStatus = (expenseId: number, newStatus: "Approved" | "Pending" | "Rejected") => {
        if (!selectedProject) return;

        const updatedExpenses = selectedProject.expenses?.map((expense) =>
          expense.id === expenseId ? { ...expense, status: newStatus } : expense
        ) || [];

        // Recalcular currentSpent basado en gastos aprobados
        const newCurrentSpent = updatedExpenses
          .filter(e => e.status === 'Approved')
          .reduce((sum, e) => sum + (e.amount || 0), 0);

        setSelectedProject(prev => prev ? {
          ...prev,
          expenses: updatedExpenses,
          currentSpent: newCurrentSpent
        } : prev);

        // Verificar si ya existía en el original
        const expenseInOriginal = (originalSelectedProject?.expenses || [])
          .find((e: Expenses) => e.id === expenseId);

        // Preparar el gasto para pendingChanges
        let expenseWithUpdatedStatus: ExpensesBackend | undefined;
        if (expenseInOriginal) {
          expenseWithUpdatedStatus = {
            ...expenseInOriginal,
            approved_by: expenseInOriginal.project_info?.approved_by ?? "",
            notes: expenseInOriginal.project_info?.notes ?? "",
            status: newStatus,
            updated: true,
            created: false,
            deleted: false
          };
        } else {
          const newExpense = updatedExpenses.find((e: Expenses) => e.id === expenseId);
          if (!newExpense) return;
          expenseWithUpdatedStatus = {
            ...(newExpense as Expenses),
            approved_by: newExpense.project_info?.approved_by ?? "",
            notes: newExpense.project_info?.notes ?? "",
            status: newStatus,
            updated: false,
            created: true,
            deleted: false
          };
        }

        if (!expenseWithUpdatedStatus) return;

        // Filtrar duplicados en pendingChanges
        const filteredPendingExpenses = (pendingChanges?.expenses || []).filter(
          (e: ExpensesBackend) => e.id !== expenseId
        );
        // Actualizar los cambios pendientes
        updatePendingChanges({
          expenses: [...filteredPendingExpenses, expenseWithUpdatedStatus]
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

    // Efecto para mostrar información cuando cambie
    const showInfoAlert = useCallback((infoMessage: string) => {
      Swal.fire({
        title: dictionary?.common?.infoTitle || 'Info',
        text: infoMessage,
        icon: 'info',
        confirmButtonText: dictionary?.common.acept || 'Aceptar',
      });
    }, [dictionary]);

    // Efecto para mostrar información cuando cambie
    useEffect(() => {
        if (info) {
            showInfoAlert(info);
        }

    }, [info, showInfoAlert]);

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
    errorState: error
  }

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
}