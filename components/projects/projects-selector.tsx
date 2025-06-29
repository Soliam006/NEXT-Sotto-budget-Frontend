"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building, Plus } from "lucide-react"
import { useProject } from "@/contexts/project-context"
import { useState } from "react"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { Button } from "@/components/ui/button"
import { AddProjectDialog } from "@/components/projects/add-project-dialog"
import {useUser} from "@/contexts/UserProvider";
import {Project} from "@/lib/types/project.types";


interface ProjectsSelectorProps {
  dict: any
}

export function ProjectsSelector({ dict }: ProjectsSelectorProps) {
  const { projects, selectedProject, hasChanges, setSelectedProjectById, saveChanges, discardChanges } = useProject()
  const {user:currentUser} = useUser()

  const [showConfirmation, setShowConfirmation] = useState(false)
  const [pendingProjectId, setPendingProjectId] = useState<number | null>(null)
  const [showAddProject, setShowAddProject] = useState(false)

  const handleProjectChange = (projectIdStr: string) => {
    const projectId = Number.parseInt(projectIdStr, 10)

    // Si no hay cambios, cambia directamente
    if (!hasChanges) {
      setSelectedProjectById(projectId)
      return
    }

    // Si hay cambios, guarda el ID pendiente y muestra el diálogo
    setPendingProjectId(projectId)
    setShowConfirmation(true)
  }

  const handleSaveAndChange = async () => {
    await saveChanges()
    if (pendingProjectId !== null) {
      setSelectedProjectById(pendingProjectId)
      setPendingProjectId(null)
    }
    setShowConfirmation(false)
  }

  const handleDiscardAndChange = () => {
    discardChanges()
    if (pendingProjectId !== null) {
      setSelectedProjectById(pendingProjectId)
      setPendingProjectId(null)
    }
    setShowConfirmation(false)
  }

  const handleCancelChange = () => {
    setPendingProjectId(null)
    setShowConfirmation(false)
  }

  return (
    <div className="">
      <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>{dict.dashboard?.selectProject || "Select Project"}</CardTitle>
              {projects.length > 0 && (
              <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-muted/50 text-primary border-primary/50">
                      {projects.length} {dict.dashboard?.projects || "Projects"}
                    </Badge>
                    {currentUser?.role === "admin" ? (
                        <Button
                            variant="outline"
                            className="h-8 px-2 bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-1 cursor-pointer"
                            onClick={() => setShowAddProject(true)}
                        >
                          <Plus className="h-4 w-4" />
                          <span className="text-xs">{dict.projects?.addProject || "Add Project"}</span>
                        </Button>
                      ): (<></>)
                  }
              </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {projects.length > 0 ? (
                  <>
                    {/* Project selector */}
                    <div className="w-full">
                      <Select value={selectedProject?.id.toString()} onValueChange={handleProjectChange}>
                        <SelectTrigger className="w-full cursor-pointer">
                          <SelectValue placeholder={dict.dashboard?.selectProjectPlaceholder || "Select a project"} />
                        </SelectTrigger>
                        <SelectContent>
                          {projects.map((project: Project) => (
                              <SelectItem key={project.id} value={project.id.toString()}>
                                {project.title}
                              </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Project details */}
                    {selectedProject ? (
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
                            {dict.dashboard?.spent || "Spent"}: ${selectedProject.currentSpent}(
                            {Math.round((selectedProject.currentSpent / selectedProject.limit_budget) * 100)}%)
                          </span>
                                <span className="text-muted-foreground">
                            {dict.dashboard?.budget || "Budget"}: ${selectedProject.limit_budget}
                          </span>
                              </div>
                              <Progress
                                  value={(selectedProject.currentSpent / selectedProject.limit_budget) * 100}
                                  indicatorClassName="bg-gradient-to-r from-cyan-500 to-blue-500"
                                  className="h-2"
                              />
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
                                <span>{selectedProject.start_date? new Date(selectedProject.start_date).toLocaleDateString() : "N/A"}</span>
                              </div>
                              <div className="flex justify-between flex-col md:flex-row">
                                <span className="text-muted-foreground">{dict.dashboard?.endDate || "End Date"}:</span>
                                <span>{selectedProject.end_date ? new Date(selectedProject.end_date).toLocaleDateString() : "N/A"}</span>
                              </div>
                            </div>

                            {selectedProject.clients && selectedProject.clients.length > 0 && (
                                <div className="mt-2">
                                  <h4 className="text-sm font-medium mb-1">{dict.projects?.clients || "Clients"}:</h4>
                                  <div className="flex flex-wrap gap-1">
                                    {selectedProject.clients.map((client) => (
                                        <Badge key={client.id} variant="secondary" className="text-xs">
                                          {client.name}
                                        </Badge>
                                    ))}
                                  </div>
                                </div>
                            )}
                          </div>
                        </div>
                    ) : (
                        <div className="w-full p-6 text-center text-muted-foreground border rounded-md bg-muted/30 border-border">
                          {dict.dashboard?.selectProjectToView || "Select a project to view details"}
                        </div>
                    )}
                  </>
              ) : (
                  <div className="flex flex-col items-center justify-center p-8 gap-4">
                    <div className="text-center text-muted-foreground">
                      <p className="mb-4">{dict.dashboard?.noProjectsAvailable || "No projects available"}</p>
                      {(currentUser?.role === "admin") && (
                        <Button
                            variant="default"
                            className="bg-primary hover:bg-primary/90 h-10 px-6 flex items-center gap-2 cursor-pointer"
                            onClick={() => setShowAddProject(true)}
                        >
                          <Plus className="h-5 w-5" />
                          <span>{dict.projects?.addProject || "Add Project"}</span>
                        </Button>
                      )}
                    </div>
                  </div>
              )}
            </div>
          </CardContent>
        </Card>

        <ConfirmationDialog
            open={showConfirmation}
            onOpenChange={setShowConfirmation}
            title={dict.common?.unsavedChanges || "Unsaved Changes"}
            description={
                dict.common?.unsavedChangesDescription ||
                "You have unsaved changes in the current project. What would you like to do?"
            }
            onConfirm={handleSaveAndChange}
            onCancel={handleCancelChange}
            onAlternative={handleDiscardAndChange}
            confirmText={dict.common?.saveAndContinue || "Save and Continue"}
            cancelText={dict.common?.cancel || "Cancel"}
            alternativeText={dict.common?.discardAndContinue || "Discard and Continue"}
        />

        <AddProjectDialog open={showAddProject} onOpenChange={setShowAddProject} dict={dict} />
      </div>
  )
}