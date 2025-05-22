"use client"

import { useState } from "react"
import { useProject } from "@/contexts/project-context"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Check, ChevronsUpDown, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { UserFollower } from "@/contexts/user.types"

interface AddProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dict: any
  user: any
}

const projectSchema = (dict: any) => z.object({
  title: z.string().min(3, {
    message: dict.projects?.titleMinLength || "Title must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: dict.projects?.descriptionMinLength || "Description must be at least 10 characters.",
  }),
  location: z.string().min(3, {
    message: dict.projects?.locationMinLength || "Location must be at least 3 characters.",
  }),
  limitBudget: z.coerce.number().positive({
    message: dict.projects?.budgetPositive || "Budget must be a positive number.",
  }),
  startDate: z.date({
    required_error: dict.projects?.startDateRequired || "Start date is required.",
  }),
  endDate: z.date({
    required_error: dict.projects?.endDateRequired || "End date is required.",
  }),
  clients: z.array(z.string()).min(1, {
    message: dict.projects?.clientsMin || "At least one client must be selected.",
  }),
})

export function AddProjectDialog({ open, onOpenChange, dict, user }: AddProjectDialogProps) {
  const { addProject } = useProject()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedClients, setSelectedClients] = useState<UserFollower[]>([])

  const schema = projectSchema(dict)

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      limitBudget: 0,
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
      clients: [],
    },
  })

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setIsSubmitting(true)

    try {
      // Preparar los datos del proyecto
      const newProject = {
        title: values.title,
        description: values.description,
        location: values.location,
        limitBudget: values.limitBudget,
        startDate: format(values.startDate, "yyyy-MM-dd"),
        endDate: format(values.endDate, "yyyy-MM-dd"),
        admin: user.name || user.username,
        status: "Planning",
        currentSpent: 0,
        progress: {
          done: 0,
          inProgress: 0,
          todo: 0,
        },
        clients: selectedClients,
        tasks: [],
        team: [],
        expenses: [],
        expenseCategories: {},
        inventory: [],
      }
      // Añadir el proyecto
      await addProject(newProject)

      // Cerrar el diálogo y resetear el formulario
      onOpenChange(false)
      form.reset()
      setSelectedClients([])
    } catch (error) {
      console.error("Error adding project:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClientSelect = (client: UserFollower) => {
    const isSelected = selectedClients.some((c) => c.id === client.id)

    if (isSelected) {
      setSelectedClients(selectedClients.filter((c) => c.id !== client.id))
      form.setValue(
        "clients",
        selectedClients.filter((c) => c.id !== client.id).map((c) => c.id as string),
      )
    } else {
      setSelectedClients([...selectedClients, client])
      form.setValue(
        "clients",
        [...selectedClients, client].map((c) => c.id as string),
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dict.projects?.addProject || "Add New Project"}</DialogTitle>
          <DialogDescription>
            {dict.projects?.addProjectDescription || "Fill in the details to create a new project."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dict.projects?.title || "Title"}</FormLabel>
                    <FormControl>
                      <Input placeholder="Project title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dict.projects?.location || "Location"}</FormLabel>
                    <FormControl>
                      <Input placeholder="Project location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="limitBudget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dict.projects?.budget || "Budget"}</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{dict.projects?.startDate || "Start Date"}</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="w-full px-3 py-2 h-10 text-left font-normal flex justify-between items-center"
                            >
                              <span className="truncate">
                                {field.value ? format(field.value, "MMM d, yyyy") : "Pick a date"}
                              </span>
                              <CalendarIcon className="h-4 w-4 opacity-50 flex-shrink-0 ml-2" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{dict.projects?.endDate || "End Date"}</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="w-full px-3 py-2 h-10 text-left font-normal flex justify-between items-center"
                            >
                              <span className="truncate">
                                {field.value ? format(field.value, "MMM d, yyyy") : "Pick a date"}
                              </span>
                              <CalendarIcon className="h-4 w-4 opacity-50 flex-shrink-0 ml-2" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < form.getValues("startDate")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dict.projects?.description || "Description"}</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the project" className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="clients"
              render={() => (
                <FormItem>
                  <FormLabel>{dict.projects?.clients || "Clients"}</FormLabel>
                  <FormDescription>
                    {dict.projects?.clientsDescription || "Select at least one client for this project."}
                  </FormDescription>

                  {/* Selected clients */}
                  {selectedClients.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {selectedClients.map((client) => (
                        <Badge key={client.id} variant="secondary" className="flex items-center gap-1 py-1 px-2">
                          <span className="text-xs">{client.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 rounded-full"
                            onClick={() => handleClientSelect(client)}
                          >
                            <span className="sr-only">Remove</span>
                            <span className="text-xs">×</span>
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" role="combobox" className="w-full justify-between">
                          {selectedClients.length > 0
                            ? `${selectedClients.length} client${selectedClients.length > 1 ? "s" : ""} selected`
                            : "Select clients"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search clients..." />
                          <CommandList>
                            <CommandEmpty>No clients found.</CommandEmpty>
                            <CommandGroup>
                              {user.following && user.following.length > 0 ? (
                                user.following.map((client: UserFollower) => {
                                  const isSelected = selectedClients.some((c) => c.id === client.id)
                                  return (
                                    <CommandItem
                                      key={client.id}
                                      value={client.id as string}
                                      onSelect={() => handleClientSelect(client)}
                                    >
                                      <div className="flex items-center gap-2 w-full">
                                        <Avatar className="h-6 w-6">
                                          <AvatarImage src={client.avatar || "/favicon.ico"} alt={client.name} />
                                          <AvatarFallback className="text-xs">{client.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                          <span className="text-sm">{client.name}</span>
                                          <span className="text-xs text-muted-foreground">{client.role}</span>
                                        </div>
                                        <Check
                                          className={cn("ml-auto h-4 w-4", isSelected ? "opacity-100" : "opacity-0")}
                                        />
                                      </div>
                                    </CommandItem>
                                  )
                                })
                              ) : (
                                <div className="py-6 text-center text-sm text-muted-foreground">
                                  {dict.projects?.noClientsFound ||
                                    "No clients found. Follow users to add them as clients."}
                                </div>
                              )}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                {dict.common?.cancel || "Cancel"}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {dict.common?.creating || "Creating..."}
                  </>
                ) : (
                  dict.common?.create || "Create"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

