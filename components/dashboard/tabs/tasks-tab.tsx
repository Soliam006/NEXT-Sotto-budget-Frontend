import { Card, CardContent } from "@/components/ui/card"
import { TaskBoard } from "@/components/tasks/task-board"
import type { Project } from "@/components/dashboard/projects-selector"

interface TasksTabProps {
  dict: any
  lang: string
}

export function TasksTab({ dict, lang}: TasksTabProps) {
  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm mt-6">
      <CardContent className="p-6">
        <TaskBoard dict={dict} lang={lang} />
      </CardContent>
    </Card>
  )
}
