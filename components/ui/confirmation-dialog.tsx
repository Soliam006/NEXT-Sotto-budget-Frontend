"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  onConfirm: () => void
  onCancel: () => void
  onAlternative?: () => void
  confirmText: string
  cancelText: string
  alternativeText?: string
}

export function ConfirmationDialog({
                                     open,
                                     onOpenChange,
                                     title,
                                     description,
                                     onConfirm,
                                     onCancel,
                                     onAlternative,
                                     confirmText,
                                     cancelText,
                                     alternativeText,
                                   }: ConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button variant="outline" onClick={onCancel}>
            {cancelText}
          </Button>
          {onAlternative && alternativeText && (
            <Button variant="secondary" onClick={onAlternative}>
              {alternativeText}
            </Button>
          )}
          <Button onClick={onConfirm}>{confirmText}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

