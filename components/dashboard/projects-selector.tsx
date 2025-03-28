"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building } from "lucide-react"

interface Project {
  id: number;
  title: string;
  description: string;
  admin: string;
  limitBudget: number;
  currentSpent: number;
  progress: {
    done: number;
    inProgress: number;
    todo: number;
  };
  location: string;
  startDate: string;
  endDate: string;
  status: string;
  expenses?: {
    id: number;
    date: string;
    category: string;
    description: string;
    amount: number;
    status: string;
  }[];
  expenseCategories?: {
    [key: string]: number;
  };
}
interface ProjectsSelectorProps {
  projects: Project[]
  selectedProject: Project
  setSelectedProject: (project: any) => void
  dict: any
}

export function ProjectsSelector({ projects, selectedProject, setSelectedProject, dict }: ProjectsSelectorProps) {
  const handleProjectChange = (projectId: string) => {
    const project = projects.find((p) => p.id.toString() === projectId)
    if (project) {
      setSelectedProject(project)
    }
  }

  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>{dict.dashboard?.selectProject || "Select Project"}</CardTitle>
          <Badge variant="outline" className="bg-muted/50 text-primary border-primary/50">
            {projects.length} {dict.dashboard?.projects || "Projects"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* Project selector - simplified */}
          <div className="w-full ">
            <Select value={selectedProject.id.toString()} onValueChange={handleProjectChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id.toString()}>
                    {project.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Project summary card - enhanced */}
          <div className="w-full p-3 border rounded-md bg-muted/30 border-border">
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Building className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="font-medium">{selectedProject.title}</h3>
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                  {selectedProject.status}
                </Badge>
              </div>

              <div className="text-sm text-muted-foreground">{selectedProject.description}</div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">
                    {dict.dashboard?.budget || "Budget"}: ${selectedProject.limitBudget}
                  </span>
                  <span className="text-muted-foreground">
                    {dict.dashboard?.spent || "Spent"}: ${selectedProject.currentSpent}(
                    {Math.round((selectedProject.currentSpent / selectedProject.limitBudget) * 100)}%)
                  </span>
                </div>
                <Progress value={(selectedProject.currentSpent / selectedProject.limitBudget) * 100} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-1 text-sm">
                <div className="flex justify-between flex-col md:flex-row">
                  <span className="text-muted-foreground">{dict.dashboard?.manager || "Manager"}:</span>
                  <span>{selectedProject.admin}</span>
                </div>
                <div className="flex justify-between flex-col md:flex-row">
                  <span className="text-muted-foreground">{dict.dashboard?.location || "Location"}:</span>
                  <span className="truncate">{selectedProject.location}</span>
                </div>
                <div className="flex justify-between flex-col md:flex-row">
                  <span className="text-muted-foreground">{dict.dashboard?.startDate || "Start Date"}:</span>
                  <span>{selectedProject.startDate}</span>
                </div>
                <div className="flex justify-between flex-col md:flex-row">
                  <span className="text-muted-foreground">{dict.dashboard?.endDate || "End Date"}:</span>
                  <span>{selectedProject.endDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

