"use client"

import { useProject } from "@/contexts/project-context"
import { Button } from "@/components/ui/button"
import { Save, X, Loader2 } from "lucide-react"

interface SaveChangesBarProps {
  dict: any
}

export function SaveChangesBar({ dict }: SaveChangesBarProps) {
  const { hasChanges, saveChanges, discardChanges, isSaving } = useProject()

  if (!hasChanges) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40 py-4 px-4 flex items-center justify-between">
      <div className="text-sm">
        <span className="font-medium text-primary">{dict.common?.unsavedChanges || "You have unsaved changes"}</span>
        <span className="text-muted-foreground ml-2">
          {dict.common?.saveChangesPrompt || "Save your changes or discard them"}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={discardChanges} disabled={isSaving} className="cursor-pointer">
          <X className="h-4 w-4 mr-1" />
          {dict.common?.discard || "Discard"}
        </Button>
        <Button size="sm" onClick={saveChanges} disabled={isSaving} className="cursor-pointer">
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              {dict.common?.saving || "Saving..."}
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-1" />
              {dict.common?.save || "Save Changes"}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

