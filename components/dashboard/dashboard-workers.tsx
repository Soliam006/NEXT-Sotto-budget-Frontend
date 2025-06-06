"use client"

import {CheckCircle, Clock, MapPin, Phone, Star, Users} from "lucide-react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {useUser} from "@/contexts/UserProvider";

interface DashboardWorkersProps {
  dict: any
}

export function DashboardWorkers({ dict }: DashboardWorkersProps) {
  const {user} = useUser()
  const WORKERS = user?.admin?.workers || []

  return (
      <div className="space-y-6 p-4 md:p-6">
        <h1 className="text-2xl font-bold">{dict.workers?.title || "Workers Management"}</h1>

        <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-base">
                <Users className="mr-2 h-5 w-5 text-primary" />
                {dict.workers?.teamMembers || "Team Members"}
              </CardTitle>
              <Badge variant="outline" className="bg-muted/50 text-primary border-primary/50">
                {WORKERS.length} {dict.workers?.workers || "Workers"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
              {WORKERS.map((worker) => (
                  <WorkerCard key={worker.id} worker={worker} dict={dict} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
  )
}
const getAvailabilityColor = (availability: string) => {
  switch (availability) {
    case "Available":
      return "bg-green-500/10 text-green-500 border-green-500/30"
    case "Busy":
      return "bg-red-500/10 text-red-500 border-red-500/30"
    case "Part-time":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/30"
    case "Full-time":
      return "bg-blue-500/10 text-blue-500 border-blue-500/30"
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/30"
  }
}

function WorkerCard({ worker, dict }: { worker: any; dict: any }) {
  return (
      <Card key={worker.id} className="bg-card/50 border-border/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg">{worker.name}</CardTitle>
              <CardDescription>{worker.role}</CardDescription>
            </div>
            <Badge variant="outline" className={getAvailabilityColor(worker.availability)}>
              {worker.availability}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Contact Info */}
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Phone className="h-4 w-4 mr-2" />
              {worker.phone}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2" />
              {worker.contact}
            </div>
          </div>

          {/* Performance */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{dict.workers?.performance || "Performance"}</span>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-sm font-medium">{worker.efficiency}%</span>
              </div>
            </div>
            <Progress value={worker.efficiency} className="h-2" />
          </div>

          {/* Tasks */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm font-medium">{worker.tasksCompleted}</span>
              </div>
              <p className="text-xs text-muted-foreground">{dict.workers?.tasksCompleted || "Completed"}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Clock className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-sm font-medium">{worker.tasksInProgress}</span>
              </div>
              <p className="text-xs text-muted-foreground">{dict.workers?.tasksInProgress || "In Progress"}</p>
            </div>
          </div>

          {/* Skills */}
          {worker.skills.length>0 ? (<div>
            <p className="text-sm font-medium mb-2">{dict.workers?.skills || "Skills"}</p>
            <div className="flex flex-wrap gap-1">
              {worker.skills.map((skill:any , index:any) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
              ))}
            </div>
          </div>): (<></>)}

          {/* Current Projects */}
          <div>
            <p className="text-sm font-medium mb-2">{dict.workers?.projects || "Current Projects"}</p>
            <div className="space-y-1">
              {worker.projects.map((project:any, index:any) => (
                  <p key={index} className="text-xs text-muted-foreground">
                    • {project}
                  </p>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
  )
}