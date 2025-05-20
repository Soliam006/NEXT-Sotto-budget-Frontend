"use client"

import {Activity, ClipboardList, Package, Users} from "lucide-react"
import {useEffect, useState} from "react"

import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {ProjectsSelector} from "@/components/dashboard/projects-selector"
import {OverviewTab} from "@/components/dashboard/tabs/overview-tab"
import {TasksTab} from "@/components/dashboard/tabs/tasks-tab"
import {TeamTab} from "@/components/dashboard/tabs/team-tab"
import {MaterialsTab} from "@/components/dashboard/tabs/materials-tab"
import {SaveChangesBar} from "@/components/dashboard/save-changes-bar";
import {useProject} from "@/contexts/project-context";
import {fetchProjects} from "@/app/actions/project";
import {useUser} from "@/contexts/UserProvider";

interface DashboardOverviewProps {
  dict: any // Replace 'any' with the actual type of your dictionary
  lang: string
}

export function DashboardOverview({dict, lang}: DashboardOverviewProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  const { setAllProjects, projects } = useProject(); // Obtiene la función para establecer proyectos
  const {token} = useUser()

  useEffect(() => {
    async function fetchProjectsData() {
      console.log("Fetching projects data...", projects)
      if(projects[0].title === "Modern Residential Complex") { // Si no hay proyectos
        console.log("Fetching projects from API...")
        // Simula una llamada a la API para obtener proyectos
        const response = await fetchProjects(token)
        if (response != null) {
          setAllProjects(response); // Establece los proyectos en el context
        }
      }
      setIsLoading(false) // Cambia el estado de carga a falso
    }
    //fetchProjectsData();
    //TIMER DE 1 segundo
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

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
        {/* Save changes bar - only visible when there are changes */}
        {<SaveChangesBar dict={dict}/>}

        {/* Main content */}
        <div className="pt-6">
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
  )
}
