"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AddTeamMemberDialog } from "@/components/team/add-team-member-dialog"
import { useProject } from "@/contexts/project-context"
import { UserPlus } from "lucide-react"

interface TeamTabProps {
  dict: any
}

export function TeamTab({ dict }: TeamTabProps) {
  const { selectedProject, addTeamMember } = useProject()

  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm mt-6">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>{dict.dashboard?.projectTeam || "Project Team"}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-muted/50 text-primary border-primary/50">
              {selectedProject.team.length} {dict.dashboard?.members || "Members"}
            </Badge>
            <AddTeamMemberDialog dict={dict} existingTeamIds={selectedProject.team.map((member: any) => member.id)} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {selectedProject.team.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <UserPlus className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">{dict.projects?.noTeamMembers || "No Team Members"}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {dict.projects?.addTeamMembersDescription || "Add team members to collaborate on this project"}
            </p>
            <AddTeamMemberDialog
              dict={dict}
              existingTeamIds={selectedProject.team.map((member: any) => member.id)}
              buttonVariant="default"
            />
          </div>
        ) : (
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
        )}
      </CardContent>
    </Card>
  )
}