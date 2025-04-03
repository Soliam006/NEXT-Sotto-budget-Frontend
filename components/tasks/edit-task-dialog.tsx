"use client"

import { useState, useEffect } from "react"
import { CalendarIcon, Check, ChevronsUpDown, Pencil } from "lucide-react"
import { format } from "date-fns"
import { es, enUS } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

// Esquema de validación para el formulario
const taskFormSchema = z.object({
  title: z.string().min(3, {
    message: "El título debe tener al menos 3 caracteres",
  }),
  description: z.string().optional(),
  assignee: z.string({
    required_error: "Por favor selecciona un responsable",
  }),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"], {
    required_error: "Por favor selecciona un estado",
  }),
  dueDate: z.any().optional(),
})

type TaskFormValues = z.infer<typeof taskFormSchema>

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

interface EditTaskDialogProps {
  task: Task
  dict: any
  lang: string
  onEditTask: (taskId: string, updatedTask: Partial<Task>) => void
  onDeleteTask: (taskId: string) => void
  team: any
}

export function EditTaskDialog({ task, dict, lang, onEditTask, onDeleteTask, team }: EditTaskDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Encontrar el ID del trabajador basado en el nombre del asignado
  const findWorkerId = (assigneeName: string) => {
    const member = team.find((m: any) => m.name === assigneeName)
    return member?.id || ""
  }

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: task.title,
      description: task.description || "",
      assignee: task.worker_id || findWorkerId(task.assignee),
      status: task.status,
      dueDate: task.dueDate,
    },
  })

  // Actualizar el formulario cuando cambia la tarea
  useEffect(() => {
    form.reset({
      title: task.title,
      description: task.description || "",
      assignee: task.worker_id || findWorkerId(task.assignee),
      status: task.status,
      dueDate: task.dueDate,
    })
  }, [task, form])

  const onSubmit = async (data: TaskFormValues) => {
    setIsSubmitting(true)

    try {
      const updatedTask: Partial<Task> = {
        title: data.title,
        description: data.description,
        assignee: team.find((member: any) => member.id === data.assignee)?.name || task.assignee,
        worker_id: data.assignee,
        status: data.status,
        dueDate: data.dueDate,
        updated_at: new Date().toISOString(),
      }

      onEditTask(task.id, updatedTask)
      setOpen(false)
    } catch (error) {
      console.error("Error al editar la tarea:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = () => {
    setIsSubmitting(true)
    try {
      onDeleteTask(task.id)
      setOpen(false)
    } catch (error) {
      console.error("Error al eliminar la tarea:", error)
    } finally {
      setIsSubmitting(false)
      setShowDeleteConfirm(false)
    }
  }

  const dateLocale = lang === "es" ? es : enUS

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0 cursor-pointer">
          <Pencil className="h-4 w-4" />
          <span className="sr-only">{dict.tasks?.editTask || "Edit task"}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] bg-card/95 backdrop-blur-sm border-border/50">
        <DialogHeader>
          <DialogTitle>{dict.tasks?.editTask || "Edit Task"}</DialogTitle>
          <DialogDescription>{dict.tasks?.editTaskDescription || "Make changes to this task."}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dict.tasks?.taskTitle || "Task Title"}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={dict.tasks?.taskTitlePlaceholder || "Enter task title"}
                      {...field}
                      className="bg-muted/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dict.tasks?.description || "Description"}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={dict.tasks?.descriptionPlaceholder || "Enter task description"}
                      {...field}
                      className="bg-muted/50 min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="assignee"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{dict.tasks?.assignee || "Assignee"}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between bg-muted/50",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value
                              ? team.find((member: any) => member.id === field.value)?.name
                              : dict.tasks?.selectAssignee || "Select assignee"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command>
                          <CommandInput
                            placeholder={dict.tasks?.searchMembers || "Search team members..."}
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>{dict.tasks?.noResults || "No results found."}</CommandEmpty>
                            <CommandGroup>
                              {team.map((member: any) => (
                                <CommandItem
                                  value={member.name}
                                  key={member.id}
                                  onSelect={() => {
                                    form.setValue("assignee", member.id)
                                  }}
                                >
                                  {member.name}
                                  <Check
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      member.id === field.value ? "opacity-100" : "opacity-0",
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{dict.tasks?.dueDate || "Due Date"}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal bg-muted/50",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP", { locale: dateLocale })
                            ) : (
                              <span>{dict.tasks?.pickDate || "Pick a date"}</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          initialFocus
                          locale={dateLocale}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dict.tasks?.status || "Status"}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-muted/50">
                        <SelectValue placeholder={dict.tasks?.selectStatus || "Select status"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PENDING">{dict.tasks?.statusPending || "Pending"}</SelectItem>
                      <SelectItem value="IN_PROGRESS">{dict.tasks?.statusInProgress || "In Progress"}</SelectItem>
                      <SelectItem value="COMPLETED">{dict.tasks?.statusCompleted || "Completed"}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex justify-between">
              <div>
                {showDeleteConfirm ? (
                  <div className="flex items-center gap-2 md:pt-0 pt-2">
                    <span className="text-sm text-destructive">{dict.tasks?.confirmDelete || "Are you sure?"}</span>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={handleDelete}
                      disabled={isSubmitting}
                      className="cursor-pointer"
                    >
                      {isSubmitting ? dict.common?.processing || "Processing..." : dict.common?.delete || "Delete"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="cursor-pointer"
                    >
                      {dict.common?.cancel || "Cancel"}
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="bg-destructive/10 hover:bg-destructive/20 text-destructive hover:text-destructive cursor-pointer"
                  >
                    {dict.common?.delete || "Delete"}
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="bg-muted/50 hover:bg-muted/40 cursor-pointer"
                >
                  {dict.common?.cancel || "Cancel"}
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 cursor-pointer">
                  {isSubmitting ? dict.common?.processing || "Processing..." : dict.tasks?.saveTask || "Save Task"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}