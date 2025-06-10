"use client"

import React, { useState } from "react"
import { format } from "date-fns"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Pencil } from "lucide-react"
import { cn } from "@/lib/utils"
import { Category, Expenses, statusType } from "@/lib/types/expenses"
import { useProject } from "@/contexts/project-context"
import { useUser } from "@/contexts/UserProvider"
import { getNameTraduction } from "@/lib/helpers/expense"

interface EditExpenseDialogProps {
    dict: any
    expense: Expenses
    children: React.ReactNode
}


export function EditExpenseDialog({ dict, expense, children }: EditExpenseDialogProps) {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { user } = useUser()
    const { updateExpense } = useProject()

    const [formData, setFormData] = useState({
        title: expense.title,
        description: expense.description,
        amount: expense.amount.toString(),
        category: expense.category as Category,
        expense_date: new Date(expense.expense_date),
        status: expense.status as statusType,
        notes: expense.project_info.notes ?? "",
    })

    const categories = {
        "Materials": dict.expenses?.materials || "Materials",
        "Products": dict.expenses?.products || "Products",
        "Labour": dict.expenses?.labour || "Labour",
        "Transport": dict.expenses?.transport || "Transport",
        "Others": dict.expenses?.others || "Others"
    }

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.title.trim() || !formData.description.trim() || !formData.amount || !formData.category) return

        setIsLoading(true)
        try {
            const updated: Partial<Expenses> = {
                id: expense.id,
                title: formData.title.trim(),
                description: formData.description.trim(),
                amount: parseFloat(formData.amount),
                category: formData.category,
                expense_date: format(formData.expense_date, "yyyy-MM-dd"),
                status: formData.status,
                project_info: {
                    notes: formData.notes.trim(),
                    approved_by: user?.name || "",
                    updated_at: new Date().toISOString(),
                },
            }

            updateExpense(expense.id, updated)

            setOpen(false)
        } catch (error) {
            alert(dict.expenses?.editExpenseError || "Error updating expense")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                        <Pencil className="h-4 w-4 mr-1" />
                        {dict.expenses?.edit || "Edit"}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-card/95 backdrop-blur-sm border-border/50">
                <DialogHeader>
                    <DialogTitle>{dict.expenses?.editExpense || "Edit Expense"}</DialogTitle>
                    <DialogDescription>
                        {dict.expenses?.editExpenseDescription || "Update the selected expense details."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">{dict.expenses?.title || "Title"} *</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => handleInputChange("title", e.target.value)}
                            className="bg-muted/50 border-border"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">{dict.expenses?.description || "Description"} *</Label>
                        <Input
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            className="bg-muted/50 border-border"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="amount">{dict.expenses?.amount || "Amount"} *</Label>
                        <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            value={formData.amount}
                            onChange={(e) => handleInputChange("amount", e.target.value)}
                            className="bg-muted/50 border-border"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>{dict.expenses?.category || "Category"} *</Label>
                        <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)} required>
                            <SelectTrigger className="bg-muted/50 border-border">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(categories).map((category) => (
                                    <SelectItem key={category} value={category}>
                                        {getNameTraduction(category, dict)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>{dict.expenses?.date || "Date"}</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal bg-muted/50 border-border",
                                        !formData.expense_date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {formData.expense_date ? format(formData.expense_date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    selected={formData.expense_date}
                                    onSelect={(date) => handleInputChange("expense_date", date || new Date())}
                                    lang={user?.language_preference}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="space-y-2">
                        <Label>{dict.expenses?.status || "Status"}</Label>
                        <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                            <SelectTrigger className="bg-muted/50 border-border">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Pending">{dict.expenses?.pending || "Pending"}</SelectItem>
                                <SelectItem value="Approved">{dict.expenses?.approved || "Approved"}</SelectItem>
                                <SelectItem value="Rejected">{dict.expenses?.rejected || "Rejected"}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">{dict.common?.notes || "Notes"}</Label>
                        <Textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => handleInputChange("notes", e.target.value)}
                            className="bg-muted/50 border-border resize-none"
                            rows={3}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                            {dict.common?.cancel || "Cancel"}
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                    {dict.common?.saving || "Saving..."}
                                </>
                            ) : (
                                <>
                                    <Pencil className="h-4 w-4 mr-2" />
                                    {dict.common?.save || "Save"}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
