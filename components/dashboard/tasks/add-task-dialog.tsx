"use client"

import { useState } from "react"
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react"
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
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {useProject} from "@/contexts/project-context";

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

interface AddTaskDialogProps {
    dict: any
    lang: string
    onAddTask?: (task: any) => void
    teamMembers: any[] // Add this prop to receive team members from the project
}

export function AddTaskDialog({ dict, lang, onAddTask, teamMembers }: AddTaskDialogProps) {
    const [open, setOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const {selectedProject} = useProject()

    const form = useForm<TaskFormValues>({
        resolver: zodResolver(taskFormSchema),
        defaultValues: {
            title: "",
            description: "",
            status: "PENDING",
            dueDate: undefined,
        },
    })

    const onSubmit = async (data: TaskFormValues) => {
        setIsSubmitting(true)

        try {
            const selectedMember = teamMembers.find((member) => member.id === data.assignee)

            const newTask = {
                id: `task-${Date.now()}`,
                title: data.title,
                description: data.description || "",
                assignee: selectedMember?.name || "",
                assigneeAvatar: selectedMember?.avatar,
                worker_id: data.assignee,
                status: data.status,
                dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }

            if (onAddTask) {
                onAddTask(newTask)
            }

            setOpen(false)
            form.reset()
        } catch (error) {
            console.error("Error al crear la tarea:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const dateLocale = lang === "es" ? es : enUS

    return (
      <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
              <Button size="sm" className="bg-primary hover:bg-primary/90 cursor-pointer"  disabled={!selectedProject}>
                  {dict.projects?.addTask || "Add Task"}
              </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px] bg-card/95 backdrop-blur-sm border-border/50">
              <DialogHeader>
                  <DialogTitle>{dict.tasks?.addTask || "Add New Task"}</DialogTitle>
                  <DialogDescription>
                      {dict.tasks?.addTaskDescription || "Fill in the details to create a new task for your project."}
                  </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                              <FormLabel>{dict.projects?.taskForm.title || "Task Title"}</FormLabel>
                              <FormControl>
                                  <Input
                                    placeholder={dict.projects?.taskForm?.titlePlaceholder || "Enter task title"}
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
                              <FormLabel>{dict.projects?.description || "Description"}</FormLabel>
                              <FormControl>
                                  <Textarea
                                    placeholder={dict.projects.taskForm?.descriptionPlaceholder || "Enter task description"}
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
                                  <FormLabel>{dict.projects.taskForm?.assignTo || "Assignee"}</FormLabel>
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
                                                    ? teamMembers.find((member) => member.id === field.value)?.name
                                                    : dict.projects.taskForm?.selectAssignee || "Select assignee"}
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
                                                      {teamMembers.map((member) => (
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
                                  <FormLabel>{dict.common?.endDate || "Due Date"}</FormLabel>
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
                                                    <span>{dict.common?.pickDate || "Pick a date"}</span>
                                                  )}
                                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                              </Button>
                                          </FormControl>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-auto p-0" align="start">
                                          <Calendar
                                            selected={field.value ? new Date(field.value) : undefined}
                                            onSelect={field.onChange}
                                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                          />
                                      </PopoverContent>
                                  </Popover>
                                  <FormMessage />
                              </FormItem>
                            )}
                          />
                      </div>

                      <DialogFooter>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="bg-muted/50 cursor-pointer"
                          >
                              {dict.common?.cancel || "Cancel"}
                          </Button>
                          <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 cursor-pointer">
                              {isSubmitting ? dict.common?.processing || "Processing..." : dict.tasks?.addTask || "Create Task"}
                          </Button>
                      </DialogFooter>
                  </form>
              </Form>
          </DialogContent>
      </Dialog>
    )
}