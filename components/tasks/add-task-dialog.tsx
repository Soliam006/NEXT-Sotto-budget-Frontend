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
    dueDate: z.date({
        required_error: "Por favor selecciona una fecha de vencimiento",
    }),
})

type TaskFormValues = z.infer<typeof taskFormSchema>

// Datos de ejemplo para los miembros del equipo
const teamMembers = [
    { id: "1", name: "John Doe", role: "Project Manager", avatar: "/placeholder.svg?height=40&width=40&text=JD" },
    { id: "2", name: "Jane Smith", role: "Engineer", avatar: "/placeholder.svg?height=40&width=40&text=JS" },
    { id: "3", name: "Mike Johnson", role: "Lead Carpenter", avatar: "/placeholder.svg?height=40&width=40&text=MJ" },
    { id: "4", name: "Sarah Williams", role: "Electrician", avatar: "/placeholder.svg?height=40&width=40&text=SW" },
    { id: "5", name: "David Smith", role: "Plumber", avatar: "/placeholder.svg?height=40&width=40&text=DS" },
    { id: "6", name: "Lisa Brown", role: "Interior Designer", avatar: "/placeholder.svg?height=40&width=40&text=LB" },
    { id: "7", name: "Robert Davis", role: "General Contractor", avatar: "/placeholder.svg?height=40&width=40&text=RD" },
]

interface AddTaskDialogProps {
    dict: any
    lang: string
    onAddTask?: (task: any) => void
    projectId?: string | number
}

export function AddTaskDialog({ dict, lang, onAddTask, projectId }: AddTaskDialogProps) {
    const [open, setOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Configurar el formulario con valores por defecto
    const form = useForm<TaskFormValues>({
        resolver: zodResolver(taskFormSchema),
        defaultValues: {
            title: "",
            description: "",
            status: "PENDING",
            assignee: "",
            dueDate: new Date(),
        },
    })

    // Manejar el envío del formulario
    const onSubmit = async (data: TaskFormValues) => {
        setIsSubmitting(true)

        try {
            // Aquí normalmente enviarías los datos a tu API
            console.log("Datos del formulario:", data)

            // Crear un objeto de tarea con los datos del formulario
            const newTask = {
                id: `task-${Date.now()}`, // ID temporal
                title: data.title,
                description: data.description || "",
                assignee: teamMembers.find((member) => member.id === data.assignee)?.name || "",
                worker_id: data.assignee,
                status: data.status,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                project_id: projectId,
            }

            // Llamar al callback si existe
            if (onAddTask) {
                onAddTask(newTask)
            }

            // Cerrar el diálogo y resetear el formulario
            setOpen(false)
            form.reset()
        } catch (error) {
            console.error("Error al crear la tarea:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Determinar el locale para el calendario basado en el idioma
    const dateLocale = lang === "es" ? es : enUS

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                    {dict.projects?.addTask || "Add Task"}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] bg-card/95 backdrop-blur-sm border-border/50">
                <DialogHeader>
                    <DialogTitle>{dict.tasks?.addNewTask || "Add New Task"}</DialogTitle>
                    <DialogDescription>
                        {dict.tasks?.addTaskDescription || "Fill in the details to create a new task for your project."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }:any) => (
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
                            render={({ field }:any) => (
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
                                render={({ field }:any) => (
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
                                                            ? teamMembers.find((member) => member.id === field.value)?.name
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
                                render={({ field }:any) => (
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
                                                            format(field.value, "PPP", { locale: dateLocale })
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
                                                    selected={field.value}
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
                            render={({ field }:any) => (
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

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="bg-muted/50">
                                {dict.common?.cancel || "Cancel"}
                            </Button>
                            <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
                                {isSubmitting ? dict.common?.processing || "Processing..." : dict.tasks?.createTask || "Create Task"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

