import { Card, CardContent } from "@/components/ui/card"
import { TaskBoard } from "@/components/tasks/task-board"
import type { Project } from "@/components/dashboard/projects-selector"

interface TasksTabProps {
  dict: any
  lang: string
  selectedProject: Project
}

export function TasksTab({ dict, lang, selectedProject }: TasksTabProps) {
  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm mt-6">
      <CardContent className="p-6">
        <TaskBoard
          dict={dict}
          lang={lang}
          projectId={selectedProject.id}
          initialTasks={[

          ]}
        />
      </CardContent>
    </Card>
  )
}

