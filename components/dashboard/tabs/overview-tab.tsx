import { CheckCircle2, DollarSign, LineChart, BarChart3, Timer } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import CustomPieChart from "@/components/custom-pie-chart"
import type { Project } from "@/components/dashboard/projects-selector"

interface OverviewTabProps {
  dict: any
  selectedProject: Project
}

export function OverviewTab({ dict, selectedProject }: OverviewTabProps) {
  return (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title={dict.dashboard?.budget || "Budget"}
          value={Math.round((selectedProject.currentSpent / selectedProject.limitBudget) * 100)}
          icon={DollarSign}
          trend={selectedProject.currentSpent > selectedProject.limitBudget * 0.8 ? "up" : "stable"}
          color="primary"
          detail={`$${selectedProject.currentSpent.toLocaleString()} / $${selectedProject.limitBudget.toLocaleString()}`}
        />
        <MetricCard
          title={dict.dashboard?.tasks || "Tasks"}
          value={Math.round(
            (selectedProject.progress.done /
              (selectedProject.progress.done + selectedProject.progress.inProgress + selectedProject.progress.todo)) *
              100,
          )}
          icon={CheckCircle2}
          trend="stable"
          color="accent"
          detail={`${selectedProject.progress.done} / ${
            selectedProject.progress.done + selectedProject.progress.inProgress + selectedProject.progress.todo
          } ${dict.dashboard?.complete || "Complete"}`}
        />
        <MetricCard
          title={dict.dashboard?.timeline || "Timeline"}
          value={75}
          icon={Timer}
          trend="stable"
          color="secondary"
          detail={`${selectedProject.startDate} - ${selectedProject.endDate}`}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Progress Pie Chart */}
        <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle>{dict.dashboard?.progressOverview || "Progress Overview"}</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <CustomPieChart selectedProject={selectedProject} />
          </CardContent>
        </Card>

        {/* Project Details */}
        <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle>{dict.dashboard?.projectDetails || "Project Details"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{dict.dashboard?.location || "Location"}:</span>
                    <span>{selectedProject.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{dict.dashboard?.startDate || "Start Date"}:</span>
                    <span>{selectedProject.startDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{dict.dashboard?.endDate || "End Date"}:</span>
                    <span>{selectedProject.endDate}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{dict.dashboard?.manager || "Manager"}:</span>
                    <span>{selectedProject.admin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {dict.dashboard?.tasksCompleted || "Tasks Completed"}:
                    </span>
                    <span className="text-success">{selectedProject.progress.done}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {dict.dashboard?.tasksRemaining || "Tasks Remaining"}:
                    </span>
                    <span className="text-warning">
                      {selectedProject.progress.inProgress + selectedProject.progress.todo}
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
                      <span className="text-muted-foreground">{selectedProject.progress.done} tasks</span>
                    </div>
                    <Progress
                      value={
                        (selectedProject.progress.done /
                          (selectedProject.progress.done +
                            selectedProject.progress.inProgress +
                            selectedProject.progress.todo)) *
                        100
                      }
                      className="h-1.5 bg-muted"
                    >
                      <div className="h-full bg-success rounded-full" />
                    </Progress>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-info">{dict.dashboard?.inProgress || "In Progress"}</span>
                      <span className="text-muted-foreground">{selectedProject.progress.inProgress} tasks</span>
                    </div>
                    <Progress
                      value={
                        (selectedProject.progress.inProgress /
                          (selectedProject.progress.done +
                            selectedProject.progress.inProgress +
                            selectedProject.progress.todo)) *
                        100
                      }
                      className="h-1.5 bg-muted"
                    >
                      <div className="h-full bg-info rounded-full" />
                    </Progress>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-warning">{dict.dashboard?.todo || "To Do"}</span>
                      <span className="text-muted-foreground">{selectedProject.progress.todo} tasks</span>
                    </div>
                    <Progress
                      value={
                        (selectedProject.progress.todo /
                          (selectedProject.progress.done +
                            selectedProject.progress.inProgress +
                            selectedProject.progress.todo)) *
                        100
                      }
                      className="h-1.5 bg-muted"
                    >
                      <div className="h-full bg-warning rounded-full" />
                    </Progress>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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

// Component for metric cards
function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  color,
  detail,
}: {
  title: string
  value: number
  icon: any
  trend: "up" | "down" | "stable"
  color: string
  detail: string
}) {
  const getColor = () => {
    switch (color) {
      case "primary":
        return "from-primary to-primary/70 border-primary/30"
      case "secondary":
        return "from-secondary to-secondary/70 border-secondary/30"
      case "accent":
        return "from-accent to-accent/70 border-accent/30"
      default:
        return "from-primary to-primary/70 border-primary/30"
    }
  }

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <BarChart3 className="h-4 w-4 text-warning" />
      case "down":
        return <BarChart3 className="h-4 w-4 rotate-180 text-success" />
      case "stable":
        return <LineChart className="h-4 w-4 text-info" />
      default:
        return null
    }
  }

  return (
    <div className={`bg-muted/50 rounded-lg border ${getColor()} p-4 relative overflow-hidden`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-muted-foreground">{title}</div>
        <Icon className={`h-5 w-5 text-${color}`} />
      </div>
      <div className="text-2xl font-bold mb-1 bg-gradient-to-r bg-clip-text text-transparent from-foreground to-foreground/80">
        {value}%
      </div>
      <div className="text-xs text-muted-foreground">{detail}</div>
      <div className="absolute bottom-2 right-2 flex items-center">{getTrendIcon()}</div>
      <div className="absolute -bottom-6 -right-6 h-16 w-16 rounded-full bg-gradient-to-r opacity-20 blur-xl from-primary to-primary/70"></div>
    </div>
  )
}

