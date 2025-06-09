"use client"

import {Activity, ClipboardList, Package, Users} from "lucide-react"
import {useEffect, useState} from "react"

import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {ProjectsSelector} from "@/components/projects/projects-selector"
import {OverviewTab} from "@/components/dashboard/panel/tabs/overview-tab"
import {TasksTab} from "@/components/dashboard/panel/tabs/tasks-tab"
import {TeamTab} from "@/components/dashboard/panel/tabs/team-tab"
import {InventoryTab} from "@/components/dashboard/panel/tabs/inventory-tab"
import {SaveChangesBar} from "@/components/bars/save-changes-bar";
import {useProject} from "@/contexts/project-context";

interface DashboardOverviewProps {
  dict: any // Replace 'any' with the actual type of your dictionary
  lang: string
}

export function DashboardOverview({dict, lang}: DashboardOverviewProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const [isClient, setIsClient] = useState(false)
  const { loadingState } = useProject(); // Obtiene la función para establecer proyectos
  // Esto asegura que el código solo se ejecute en el cliente
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient || loadingState) {
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
      <div className="space-y-6">
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
        <div className="pt-6">
            {/* Tabs for different views */}
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="w-full border-b rounded-none p-0 h-auto flex space-x-2">
                <TabsTrigger
                  value="overview"
                  className="flex-1 rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-3 cursor-pointer"
                >
                <Activity className="h-4 w-4 mr-2"/>
                  <span className={`lg:hidden ${activeTab === "overview" ? "" : "hidden"}`}>
                    {dict.dashboard?.overview || "Overview"}
                  </span>
                  <span className="hidden lg:inline">
                    {dict.dashboard?.overview || "Overview"}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="tasks"
                  className="flex-1 rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-3 cursor-pointer"
                >
                  <ClipboardList className="h-4 w-4 mr-2"/>
                    <span className={`lg:hidden ${activeTab === "tasks" ? "" : "hidden"}`}>
                        {dict.dashboard?.tasks || "Tasks"}
                    </span>
                    <span className="hidden lg:inline">
                        {dict.dashboard?.tasks || "Tasks"}
                    </span>
                </TabsTrigger>
                <TabsTrigger
                  value="team"
                  className="flex-1 rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-3 cursor-pointer"
                >
                  <Users className="h-4 w-4 mr-2"/>
                    <span className={`lg:hidden ${activeTab === "team" ? "" : "hidden"}`}>
                        {dict.dashboard?.team || "Team"}
                    </span>
                    <span className="hidden lg:inline">
                        {dict.dashboard?.team || "Team"}
                    </span>
                </TabsTrigger>
                <TabsTrigger
                  value="materials"
                  className="flex-1 rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-3 cursor-pointer"
                >
                  <Package className="h-4 w-4 mr-2"/>
                    <span className={`lg:hidden ${activeTab === "materials" ? "" : "hidden"}`}>
                        {dict.dashboard?.inventory || "Inventory"}
                    </span>
                    <span className="hidden lg:inline">
                        {dict.dashboard?.inventory || "Inventory"}
                    </span>
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
                <InventoryTab dict={dict}/>
              </TabsContent>
            </Tabs>
        </div>
        {/* Save changes bar - only visible when there are changes */}
        {<SaveChangesBar dict={dict}/>}
      </div>
  )
}
