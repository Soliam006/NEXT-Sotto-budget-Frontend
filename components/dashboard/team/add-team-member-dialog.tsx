"use client"

import { useState } from "react"
import { Check, PlusCircle, Search, UserPlus, X } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useProject } from "@/contexts/project-context"
import { useUser } from "@/contexts/UserProvider"
import { WorkerData } from "@/lib/types/user.types"

interface AddTeamMemberDialogProps {
  dict: any
  buttonVariant?: "ghost" | "outline" | "default"
}

export function AddTeamMemberDialog({ dict, buttonVariant = "ghost" }: AddTeamMemberDialogProps) {
  const { addTeamMember, selectedProject } = useProject()
  const { user } = useUser()
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedWorkers, setSelectedWorkers] = useState<WorkerData[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)


  // Filter available workers based on search term and exclude existing team members
  const filteredWorkers = user?.admin?.workers.filter(
      (worker: WorkerData) =>
          worker.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (worker.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
              worker.skills.some((skill: string) => skill.toLowerCase().includes(searchTerm.toLowerCase()))) &&
          !selectedProject?.team?.some((member: any) => member.id === worker.id),
  )

  const handleAddMembers = () => {
    if (selectedWorkers.length === 0) return

    setIsSubmitting(true)

    try {
      // Add all selected workers
      selectedWorkers.forEach(worker => {
        addTeamMember(worker)
      })
      setOpen(false)
      setSelectedWorkers([])
      setSearchTerm("")
    } catch (error) {
      console.error("Error adding team members:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleWorkerSelection = (worker: WorkerData) => {
    setSelectedWorkers(prev => {
      const isSelected = prev.some(w => w.id === worker.id)
      if (isSelected) {
        return prev.filter(w => w.id !== worker.id)
      } else {
        return [...prev, worker]
      }
    })
  }

  const removeSelectedWorker = (workerId: number) => {
    setSelectedWorkers(prev => prev.filter(w => w.id !== workerId))
  }

  return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
              variant={buttonVariant}
              size={buttonVariant === "default" ? "default" : "sm"}
              className={cn("cursor-pointer", buttonVariant === "default" ? "" : "h-8 w-8 p-0")}
          >
            {buttonVariant === "default" ? (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  <span>{dict.projects?.addMember || "Add Member"}</span>
                </>
            ) : (
                <>
                  <PlusCircle className="h-4 w-4" />
                  <span className="sr-only">{dict.projects?.addMember || "Add Member"}</span>
                </>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[550px] bg-card/95 backdrop-blur-sm border-border/50">
          <DialogHeader>
            <DialogTitle>{dict.projects?.addTeamMember || "Add Team Member"}</DialogTitle>
            <DialogDescription>
              {dict.projects?.addTeamMemberDescription || "Search and add team members to your project."}
            </DialogDescription>
          </DialogHeader>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder={dict.projects?.searchWorkers || "Search workers by name, role, or skills..."}
                className="pl-10 bg-muted/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <ScrollArea className="h-[300px] rounded-md border p-2">
            {filteredWorkers && filteredWorkers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                  <Search className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {dict.projects?.noWorkersFound || "No workers found matching your search."}
                  </p>
                </div>
            ) : (
                <div className="space-y-2">
                  {filteredWorkers && filteredWorkers.map((worker) => (
                      <div
                          key={worker.id}
                          className={cn(
                              "flex items-center p-3 rounded-md cursor-pointer transition-colors",
                              selectedWorkers.some(w => w.id === worker.id)
                                  ? "bg-primary/10 border border-primary/30"
                                  : "hover:bg-muted/50 border border-transparent",
                          )}
                          onClick={() => toggleWorkerSelection(worker)}
                      >
                        <div className="flex items-center flex-1">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src="/favicon.ico" alt={worker.name} />
                            <AvatarFallback>
                              {worker.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{worker.name}</h4>
                            <p className="text-sm text-muted-foreground">{worker.role}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="ml-2 bg-muted/30">
                          {worker.availability}
                        </Badge>
                        {selectedWorkers.some(w => w.id === worker.id) && (
                            <Check className="ml-2 h-4 w-4 text-primary" />
                        )}
                      </div>
                  ))}
                </div>
            )}
          </ScrollArea>

          {selectedWorkers.length > 0 && (
              <div className="mt-4 p-3 rounded-md bg-muted/30 border border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">
                    {dict.projects?.selectedWorkers || "Selected Workers"} ({selectedWorkers.length})
                  </h4>
                </div>
                <div className="space-y-2">
                  {selectedWorkers.map((worker) => (
                      <div key={worker.id} className="flex items-center justify-between p-2 rounded bg-muted/10">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src="/favicon.ico"
                                         alt={worker.name} />
                            <AvatarFallback>
                              {worker.name
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{worker.name}</p>
                            <p className="text-xs text-muted-foreground">{worker.role}</p>
                          </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeSelectedWorker(worker.id)
                            }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                  ))}
                </div>
              </div>
          )}

          <DialogFooter>
            <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="bg-muted/50 hover:bg-muted/40 cursor-pointer"
            >
              {dict.common?.cancel || "Cancel"}
            </Button>
            <Button
                type="button"
                disabled={selectedWorkers.length === 0 || isSubmitting}
                onClick={handleAddMembers}
                className="bg-primary hover:bg-primary/90 cursor-pointer"
            >
              {isSubmitting
                  ? dict.common?.processing || "Processing..."
                  : `${dict.projects?.addToTeam || "Add to Team"} ${selectedWorkers.length > 0 ? `(${selectedWorkers.length})` : ''}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  )
}