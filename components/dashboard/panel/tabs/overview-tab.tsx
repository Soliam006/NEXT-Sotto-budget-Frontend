import { CheckCircle2, DollarSign, LineChart, BarChart3, Timer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import CustomPieChart from "@/components/custom-pie-chart";
import { useProject } from "@/contexts/project-context";
import { formatDate } from "@/lib/helpers/projects";
import {MetricCard} from "@/components/dashboard/panel/tabs/metric-card";

interface OverviewTabProps {
  dict: any
}

export function OverviewTab({ dict }: OverviewTabProps) {
  const { selectedProject } = useProject()

    const getTimelineMetrics = (startDate?: string, endDate?: string) => {
        if (!startDate || !endDate) {
            return { value: 0, trend: "stable" as "up" | "down" | "stable" };
        }
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        const now = Date.now();
        const porcentaje = ((now - start) / (end - start)) * 100
        let trend: "up" | "down" | "stable" = "stable"; // Los valores son estables por defecto
        if (porcentaje > 0.8) trend = "up"; // Si el 80% del tiempo ha pasado, la tendencia es hacia arriba
            else if (porcentaje < 0.3) trend = "down"; // Si el 30% del tiempo ha pasado, la tendencia es hacia abajo
        return { value: Math.max(0, Math.min(100, Math.round(porcentaje))), trend };
    };

    const timelineMetrics = getTimelineMetrics(selectedProject?.start_date, selectedProject?.end_date);

  return (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title={dict.dashboard?.budget || "Budget"}
          value={selectedProject?.currentSpent !== undefined && selectedProject?.limit_budget
              ? Math.round((selectedProject.currentSpent / selectedProject.limit_budget) * 100)
              : 0}
          icon={DollarSign}
            trend={
              selectedProject?.currentSpent !== undefined &&
              selectedProject?.limit_budget !== undefined &&
              selectedProject.limit_budget > 0
                ? selectedProject.currentSpent > selectedProject.limit_budget * 0.8
                  ? "up"
                  : selectedProject.currentSpent < selectedProject.limit_budget * 0.3
                    ? "down"
                    : "stable"
                : "stable"
            }
          color="primary"
          detail={`$${selectedProject?.currentSpent} / $${selectedProject?.limit_budget}`}
            dict={dict}
        />
        <MetricCard
          title={dict.dashboard?.tasks || "Tasks"}
          value={selectedProject?.progress &&
          (selectedProject.progress.done !== undefined
              && selectedProject.progress.inProgress !== undefined && selectedProject.progress.todo !== undefined)
            ? Math.round(
                (selectedProject.progress.done /
                  (selectedProject.progress.done + selectedProject.progress.inProgress + selectedProject.progress.todo || 1)) *
                100,
              )
            : 0}
          icon={CheckCircle2}
          trend="stable"
          color="accent"
          detail={
            selectedProject?.progress &&
            (selectedProject.progress.done !== undefined
                && selectedProject.progress.inProgress !== undefined && selectedProject.progress.todo !== undefined)
              ? `${selectedProject.progress.done} / ${
                  selectedProject.progress.done + selectedProject.progress.inProgress + selectedProject.progress.todo
                } ${dict.dashboard?.complete || "Complete"}`
              : `0 / 0 ${dict.dashboard?.complete || "Complete"}`
          }
            dict={dict}
        />
        <MetricCard
          title={dict.dashboard?.timeline || "Timeline"}
          value={timelineMetrics.value}
          icon={Timer}
          trend={timelineMetrics.trend}
          color="secondary"
          detail={`${formatDate(selectedProject?.start_date)} - ${formatDate(selectedProject?.end_date)}`}
            dict={dict}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Pie Chart */}
        {selectedProject &&
        (<Card className="bg-card/50 border-border/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle>{dict.dashboard?.progressOverview || "Progress Overview"}</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px] flex items-center justify-center">
            <CustomPieChart selectedProject={selectedProject} />
          </CardContent>
        </Card>
        )}

        {/* Project Details */}
        {selectedProject &&
            (<Card className="bg-card/50 border-border/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle>{dict.dashboard?.projectDetails || "Project Details"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                {/* Ubicación - ahora en una sola línea consistente */}
                <div className="flex justify-between">
                    <span className="text-muted-foreground min-w-[120px]">
                      {dict.dashboard?.location || "Location"}:
                    </span>
                        <span className="text-right">{selectedProject?.location}</span>
                </div>

                {/* Fechas - mejor distribución en móvil y desktop */}
                <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                    <div className="flex justify-between sm:flex-col sm:gap-1">
                      <span className="text-muted-foreground">
                        {dict.projects?.startDate || "Start Date"}:
                      </span>
                      <span>{formatDate(selectedProject?.start_date)}</span>
                    </div>
                    <div className="flex justify-between sm:flex-col sm:gap-1">
                      <span className="text-muted-foreground">
                        {dict.projects?.endDate || "End Date"}:
                      </span>
                            <span>{formatDate(selectedProject?.end_date)}</span>
                    </div>
                </div>

                {/* Información del proyecto - mejor estructura grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              {dict.dashboard?.tasksCompleted || "Tasks Completed"}:
                            </span>
                            <span className="text-success">{selectedProject?.progress.done}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              {dict.dashboard?.tasksRemaining || "Tasks Remaining"}:
                            </span>
                            <span className="text-warning">
                            {selectedProject?.progress.inProgress + selectedProject?.progress.todo}
                            </span>
                        </div>
                    </div>
                </div>

              <div className="pt-4 border-t border-border/50">
                <h4 className="text-sm font-medium mb-2">{dict.dashboard?.taskBreakdown || "Task Breakdown"}</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-success">{dict.dashboard?.done || "Done"}</span>
                      <span className="text-muted-foreground">{selectedProject?.progress.done} tasks</span>
                    </div>
                    <Progress
                      value={
                        (selectedProject?.progress.done /
                          (selectedProject?.progress.done +
                            selectedProject?.progress.inProgress +
                            selectedProject?.progress.todo)) *
                        100
                      }
                      indicatorClassName="bg-green-500"
                      className="h-1.5 bg-muted"
                    >
                      <div className="h-full bg-success rounded-full" />
                    </Progress>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-info">{dict.dashboard?.inProgress || "In Progress"}</span>
                      <span className="text-muted-foreground">{selectedProject?.progress.inProgress} tasks</span>
                    </div>
                    <Progress
                      value={
                        (selectedProject?.progress.inProgress /
                          (selectedProject?.progress.done +
                            selectedProject?.progress.inProgress +
                            selectedProject?.progress.todo)) *
                        100
                      }
                      indicatorClassName="bg-blue-500"
                      className="h-1.5 bg-muted"
                    >
                      <div className="h-full bg-info rounded-full" />
                    </Progress>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-warning">{dict.dashboard?.todo || "To Do"}</span>
                      <span className="text-muted-foreground">{selectedProject?.progress.todo} tasks</span>
                    </div>
                    <Progress
                      value={
                        (selectedProject?.progress.todo /
                          (selectedProject?.progress.done +
                            selectedProject?.progress.inProgress +
                            selectedProject?.progress.todo)) *
                        100
                      }
                      indicatorClassName="bg-yellow-500"
                      className="h-1.5 bg-muted"
                    >
                      <div className="h-full bg-warning rounded-full" />
                    </Progress>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>)}

        {/* Recent activity */}
        <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle>{dict.dashboard?.recentActivity || "Recent Activity"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ActivityItem
                title={dict.dashboard?.materialDelivered || "Material Delivered"}
                time="14:32:12"
                description={dict.dashboard?.cabinetsDelivered || "Kitchen cabinets delivered to site"}
                type="info"
              />
              <ActivityItem
                title={dict.dashboard?.taskCompleted || "Task Completed"}
                time="13:45:06"
                description={dict.dashboard?.electricalCompleted || "Mike completed electrical wiring"}
                type="success"
              />
              <ActivityItem
                title={dict.dashboard?.budgetWarning || "Budget Warning"}
                time="09:12:45"
                description={dict.dashboard?.approachingBudget || "Approaching 80% of budget limit"}
                type="warning"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Activity item component
function ActivityItem({
                        title,
                        time,
                        description,
                        type,
                      }: {
  title: string
  time: string
  description: string
  type: "info" | "warning" | "error" | "success" | "update"
}) {
  const getTypeStyles = () => {
    switch (type) {
      case "info":
        return { color: "text-info bg-info/10 border-info/30" }
      case "warning":
        return { color: "text-warning bg-warning/10 border-warning/30" }
      case "error":
        return { color: "text-destructive bg-destructive/10 border-destructive/30" }
      case "success":
        return { color: "text-success bg-success/10 border-success/30" }
      case "update":
        return { color: "text-primary bg-primary/10 border-primary/30" }
      default:
        return { color: "text-info bg-info/10 border-info/30" }
    }
  }

  const { color } = getTypeStyles()

  return (
    <div className="flex items-start space-x-3">
      <div className={`mt-0.5 p-1 rounded-full ${color.split(" ")[1]} ${color.split(" ")[2]}`}>
        <CheckCircle2 className={`h-3 w-3 ${color.split(" ")[0]}`} />
      </div>
      <div>
        <div className="flex items-center">
          <div className="text-sm font-medium">{title}</div>
          <div className="ml-2 text-xs text-muted-foreground">{time}</div>
        </div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
    </div>
  )
}