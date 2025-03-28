"use client"

import { Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import LoadingView from "@/components/loading-view";

// Mock data for workers
const WORKERS = [
  {
    id: 1,
    name: "Mike Johnson",
    role: "Lead Carpenter",
    avatar: "/placeholder.svg?height=64&width=64&text=MJ",
    tasksCompleted: 12,
    tasksInProgress: 2,
    efficiency: 92,
    availability: "Full-time",
    contact: "mike.j@example.com",
    skills: ["Carpentry", "Woodworking", "Framing", "Finishing"],
    projects: ["Kitchen Renovation", "Basement Finishing"],
  },
  {
    id: 2,
    name: "Sarah Williams",
    role: "Electrician",
    avatar: "/placeholder.svg?height=64&width=64&text=SW",
    tasksCompleted: 8,
    tasksInProgress: 3,
    efficiency: 85,
    availability: "Full-time",
    contact: "sarah.w@example.com",
    skills: ["Electrical", "Wiring", "Lighting", "Troubleshooting"],
    projects: ["Kitchen Renovation", "Bathroom Remodel"],
  },
  {
    id: 3,
    name: "David Smith",
    role: "Plumber",
    avatar: "/placeholder.svg?height=64&width=64&text=DS",
    tasksCompleted: 6,
    tasksInProgress: 1,
    efficiency: 88,
    availability: "Part-time",
    contact: "david.s@example.com",
    skills: ["Plumbing", "Pipe Fitting", "Fixture Installation"],
    projects: ["Bathroom Remodel"],
  },
  {
    id: 4,
    name: "Lisa Brown",
    role: "Interior Designer",
    avatar: "/placeholder.svg?height=64&width=64&text=LB",
    tasksCompleted: 5,
    tasksInProgress: 4,
    efficiency: 79,
    availability: "Contract",
    contact: "lisa.b@example.com",
    skills: ["Design", "Color Theory", "Space Planning", "Material Selection"],
    projects: ["Kitchen Renovation", "Bathroom Remodel"],
  },
  {
    id: 5,
    name: "Robert Davis",
    role: "General Contractor",
    avatar: "/placeholder.svg?height=64&width=64&text=RD",
    tasksCompleted: 15,
    tasksInProgress: 5,
    efficiency: 90,
    availability: "Full-time",
    contact: "robert.d@example.com",
    skills: ["Project Management", "Scheduling", "Budgeting", "Coordination"],
    projects: ["Kitchen Renovation", "Bathroom Remodel", "Basement Finishing"],
  },
]

interface DashboardWorkersProps {
  dict: any
  lang: string
}

export function DashboardWorkers({ dict, lang }: DashboardWorkersProps) {
  console.log("WORKERS__________________________________________________________", WORKERS)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-100">{dict.workers?.title || "Workers Management"}</h1>

      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-slate-100 flex items-center text-base">
              <Users className="mr-2 h-5 w-5 text-blue-500" />
              {dict.workers?.teamMembers || "Team Members"}
            </CardTitle>
            <Badge variant="outline" className="bg-slate-800/50 text-cyan-400 border-cyan-500/50">
              {WORKERS.length} {dict.workers?.workers || "Workers"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {WORKERS.map((worker) => (
              <WorkerCard key={worker.id} worker={worker} dict={dict} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function WorkerCard({ worker, dict }: { worker: any; dict: any }) {
  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-4">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-shrink-0">
          <Avatar className="h-16 w-16">
            <AvatarImage src={worker.avatar} alt={worker.name} />
            <AvatarFallback className="bg-slate-700 text-cyan-500">{worker.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-grow">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
            <div>
              <h3 className="text-lg font-medium text-slate-200">{worker.name}</h3>
              <p className="text-sm text-slate-400">{worker.role}</p>
            </div>
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50 mt-1 md:mt-0 w-fit">
              {worker.efficiency}% {dict.workers?.efficient || "Efficient"}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">{dict.workers?.availability || "Availability"}:</span>
                <span className="text-slate-300">{worker.availability}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">{dict.workers?.contact || "Contact"}:</span>
                <span className="text-slate-300">{worker.contact}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">{dict.workers?.projects || "Projects"}:</span>
                <span className="text-slate-300">{worker.projects.length}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">{dict.workers?.tasksCompleted || "Tasks Completed"}:</span>
                <span className="text-green-400">{worker.tasksCompleted}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">{dict.workers?.tasksInProgress || "Tasks In Progress"}:</span>
                <span className="text-blue-400">{worker.tasksInProgress}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">{dict.workers?.workload || "Workload"}:</span>
                <span className="text-slate-300">
                  {Math.round((worker.tasksInProgress / (worker.tasksCompleted + worker.tasksInProgress)) * 100)}%
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">{dict.workers?.skills || "Skills"}:</span>
              <span className="text-slate-400">
                {worker.skills.length} {dict.workers?.skillsTotal || "total"}
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {worker.skills.map((skill:any, index:number) => (
                <Badge key={index} variant="outline" className="bg-slate-700/50 text-slate-300 border-slate-600">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">{dict.workers?.performance || "Performance"}:</span>
              <span className="text-slate-400">{worker.efficiency}%</span>
            </div>
            <Progress value={worker.efficiency} className="h-1.5">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                style={{ width: `${worker.efficiency}%` }}
              />
            </Progress>
          </div>
        </div>
      </div>
    </div>
  )
}

