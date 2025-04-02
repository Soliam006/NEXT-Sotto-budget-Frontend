"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Project } from "@/components/dashboard/projects-selector"
import {AddTeamMemberDialog} from "@/components/team/add-team-member-dialog";
import {useEffect, useState} from "react";

interface TeamTabProps {
  dict: any
  selectedProject: Project
}

export function TeamTab({ dict, selectedProject }: TeamTabProps) {
  const [project, setProject] = useState<Project>(selectedProject)

  // Function to add a new team member to the project
  const handleAddTeamMember = (newMember: any) => {
    const updatedTeam = [...project.team, newMember]
    setProject({
      ...project,
      team: updatedTeam,
    })
  }

  useEffect(() => {
    setProject(selectedProject)
  }, [selectedProject])


  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm mt-6">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>{dict.dashboard?.projectTeam || "Project Team"}</CardTitle>
          <Badge variant="outline" className="bg-muted/50 text-primary border-primary/50">
            {project.team.length} {dict.dashboard?.members || "Members"}
          </Badge>
          <AddTeamMemberDialog
            dict={dict}
            onAddTeamMember={handleAddTeamMember}
            existingTeamIds={project.team.map((member:any) => member.id)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedProject.team.map((member: any) => (
            <div key={member.id} className="flex items-center p-4 rounded-lg border border-border/50 bg-muted/30">
              <Avatar className="h-10 w-10 mr-4">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>
                  {member.name
                    .split(" ")
                    .map((n: any) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium">{member.name}</h4>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

