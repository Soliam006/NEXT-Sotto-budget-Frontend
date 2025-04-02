"use client"

import { useState } from "react"
import { Check, PlusCircle, Search, UserPlus } from "lucide-react"
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

interface Worker {
  id: string;
  name: string;
  role: string;
  avatar: string;
  skills: string[];
  availability: string;
}

const AVAILABLE_WORKERS: Worker[] = [
  {
    id: "101",
    name: "Emma Thompson",
    role: "Architect",
    avatar: "https://randomuser.me/api/portraits/women/11.jpg",
    skills: ["Design", "Planning", "3D Modeling"],
    availability: "Full-time",
  },
  {
    id: "102",
    name: "Michael Chen",
    role: "Electrical Engineer",
    avatar: "https://randomuser.me/api/portraits/men/12.jpg",
    skills: ["Wiring", "Lighting", "Troubleshooting"],
    availability: "Part-time",
  },
  {
    id: "103",
    name: "Sophia Rodriguez",
    role: "Interior Designer",
    avatar: "https://randomuser.me/api/portraits/women/13.jpg",
    skills: ["Color Theory", "Space Planning", "Material Selection"],
    availability: "Full-time",
  },
  {
    id: "104",
    name: "James Wilson",
    role: "Plumber",
    avatar: "https://randomuser.me/api/portraits/men/14.jpg",
    skills: ["Pipe Fitting", "Fixture Installation", "Leak Repair"],
    availability: "Contract",
  },
  {
    id: "105",
    name: "Olivia Johnson",
    role: "Project Coordinator",
    avatar: "https://randomuser.me/api/portraits/women/15.jpg",
    skills: ["Scheduling", "Documentation", "Communication"],
    availability: "Full-time",
  },
  {
    id: "106",
    name: "Daniel Lee",
    role: "Structural Engineer",
    avatar: "https://randomuser.me/api/portraits/men/16.jpg",
    skills: ["Structural Analysis", "Building Codes", "Material Strength"],
    availability: "Full-time",
  },
  {
    id: "107",
    name: "Ava Martinez",
    role: "Landscape Designer",
    avatar: "https://randomuser.me/api/portraits/women/17.jpg",
    skills: ["Plant Selection", "Irrigation", "Outdoor Spaces"],
    availability: "Part-time",
  },
]

interface AddTeamMemberDialogProps {
  dict: any
  onAddTeamMember: (member: any) => void
  existingTeamIds: string[]
  buttonVariant?: "ghost" | "outline" | "default"
}

export function AddTeamMemberDialog({
                                      dict,
                                      onAddTeamMember,
                                      existingTeamIds,
                                      buttonVariant = "ghost",
                                    }: AddTeamMemberDialogProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedWorker, setSelectedWorker] = useState<any | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Filter available workers based on search term and exclude existing team members
  const filteredWorkers = AVAILABLE_WORKERS.filter((worker) => !existingTeamIds.includes(worker.id)).filter(
    (worker) =>
      worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleAddMember = () => {
    if (!selectedWorker) return

    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call
      onAddTeamMember(selectedWorker)
      setOpen(false)
      setSelectedWorker(null)
      setSearchTerm("")
    } catch (error) {
      console.error("Error adding team member:", error)
    } finally {
      setIsSubmitting(false)
    }
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
          {filteredWorkers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-8 text-center">
              <Search className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                {dict.projects?.noWorkersFound || "No workers found matching your search."}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredWorkers.map((worker) => (
                <div
                  key={worker.id}
                  className={cn(
                    "flex items-center p-3 rounded-md cursor-pointer transition-colors",
                    selectedWorker?.id === worker.id
                      ? "bg-primary/10 border border-primary/30"
                      : "hover:bg-muted/50 border border-transparent",
                  )}
                  onClick={() => setSelectedWorker(worker)}
                >
                  <div className="flex items-center flex-1">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={worker.avatar} alt={worker.name} />
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
                  {selectedWorker?.id === worker.id && <Check className="ml-2 h-4 w-4 text-primary" />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {selectedWorker && (
          <div className="mt-4 p-3 rounded-md bg-muted/30 border border-border/50">
            <div className="flex items-center mb-2">
              <h4 className="font-medium">{dict.projects?.selectedWorker || "Selected Worker"}</h4>
            </div>
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={selectedWorker.avatar} alt={selectedWorker.name} />
                <AvatarFallback>
                  {selectedWorker.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium">{selectedWorker.name}</h4>
                <p className="text-sm text-muted-foreground">{selectedWorker.role}</p>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-muted-foreground mb-1">{dict.projects?.skills || "Skills"}:</p>
              <div className="flex flex-wrap gap-1">
                {selectedWorker.skills.map((skill: string) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
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
            disabled={!selectedWorker || isSubmitting}
            onClick={handleAddMember}
            className="bg-primary hover:bg-primary/90 cursor-pointer"
          >
            {isSubmitting ? dict.common?.processing || "Processing..." : dict.projects?.addToTeam || "Add to Team"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}