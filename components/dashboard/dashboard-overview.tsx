"use client"

import {Activity, ClipboardList, Package, Users} from "lucide-react"
import {useEffect, useState} from "react"

import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {ProjectsSelector} from "@/components/dashboard/projects-selector"
import {OverviewTab} from "@/components/dashboard/tabs/overview-tab"
import {TasksTab} from "@/components/dashboard/tabs/tasks-tab"
import {TeamTab} from "@/components/dashboard/tabs/team-tab"
import {MaterialsTab} from "@/components/dashboard/tabs/materials-tab"

interface DashboardOverviewProps {
  dict: any // Replace 'any' with the actual type of your dictionary
  lang: string
}

export function DashboardOverview({dict, lang}: DashboardOverviewProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-primary/30 rounded-full animate-ping"></div>
            <div
              className="absolute inset-2 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
          <div className="mt-4 text-primary font-mono text-sm tracking-wider">
            {dict.dashboard?.loading || "LOADING"}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="">
      <div className="pb-2">
        <h1 className="text-2xl font-bold">{dict.dashboard?.overview || "Dashboard Overview"}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {dict.dashboard?.description || "Manage your projects and activities"}
        </p>
      </div>

      {/* Project selector */}
      <ProjectsSelector
        dict={dict}
      />

      {/* Main content */}
      <div className="flex flex-col lg:flex-row gap-6 pt-6">
        {/* Main content area */}
        <div className="flex-1">
          {/* Tabs for different views */}
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="w-full border-b rounded-none p-0 h-auto flex space-x-2">
              <TabsTrigger
                value="overview"
                className="flex-1 rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-3"
              >
                <Activity className="h-4 w-4 mr-2"/>
                {activeTab === "overview" && <>{dict.dashboard?.overview || "Overview"}</>}
              </TabsTrigger>
              <TabsTrigger
                value="tasks"
                className="flex-1 rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-3"
              >
                <ClipboardList className="h-4 w-4 mr-2"/>
                {activeTab === "tasks" && <>{dict.dashboard?.tasks || "Tasks"}</>}
              </TabsTrigger>
              <TabsTrigger
                value="team"
                className="flex-1 rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-3"
              >
                <Users className="h-4 w-4 mr-2"/>
                {activeTab === "team" && <>{dict.dashboard?.team || "Team"}</>}
              </TabsTrigger>
              <TabsTrigger
                value="materials"
                className="flex-1 rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-3"
              >
                <Package className="h-4 w-4 mr-2"/>
                {activeTab === "materials" && <>{dict.dashboard?.materials || "Materials"}</>}
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab Content */}
            <TabsContent value="overview">
              <OverviewTab dict={dict}/>
            </TabsContent>

            {/* Tasks Tab Content */}
            <TabsContent value="tasks">
              <TasksTab dict={dict} lang={lang}/>
            </TabsContent>

            {/* Team Tab Content */}
            <TabsContent value="team">
              <TeamTab dict={dict}/>
            </TabsContent>

            {/* Materials Tab Content */}
            <TabsContent value="materials">
              <MaterialsTab dict={dict}/>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
