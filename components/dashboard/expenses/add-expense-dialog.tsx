"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, DollarSign, Plus } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useProject } from "@/contexts/project-context"
import {useUser} from "@/contexts/UserProvider";

interface AddExpenseDialogProps {
    dict: any
    trigger?: React.ReactNode
}

export function AddExpenseDialog({ dict, trigger }: AddExpenseDialogProps) {
    const [open, setOpen] = useState(false)
    const {user} = useUser()

    const [isLoading, setIsLoading] = useState(false)
    const { addExpense } = useProject()

    // Form state
    const [formData, setFormData] = useState({
        description: "",
        amount: "",
        category: "",
        customCategory: "",
        date: new Date(),
        status: "pending" as "approved" | "pending" | "rejected",
        notes: "",
    })

    const predefinedCategories = [
        "Materiales",
        "Mano de obra",
        "Equipamiento",
        "Permisos",
        "Transporte",
        "Servicios",
        "Otros",
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.description.trim() || !formData.amount || !formData.category) {
            return
        }

        setIsLoading(true)

        try {
            // Simular delay de API
            await new Promise((resolve) => setTimeout(resolve, 1000))

            const expense = {
                description: formData.description.trim(),
                amount: Number.parseFloat(formData.amount),
                category: formData.category === "custom" ? formData.customCategory : formData.category,
                date: format(formData.date, "yyyy-MM-dd"),
                status: formData.status,
                notes: formData.notes.trim(),
            }

            addExpense(expense)

            // Reset form
            setFormData({
                description: "",
                amount: "",
                category: "",
                customCategory: "",
                date: new Date(),
                status: "pending",
                notes: "",
            })

            setOpen(false)
        } catch (error) {
            alert(dict.expenses?.addExpenseError || "Error adding expense. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="default"
                        className="text-white bg-gradient-to-r from-cyan-500 to-blue-500
                            hover:from-cyan-600 hover:to-blue-600 cursor-pointer"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        {dict.expenses?.addExpense || "Add Expense"}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-card/95 backdrop-blur-sm border-border/50">
                <DialogHeader>
                    <DialogTitle className="flex items-center">
                        <DollarSign className="h-5 w-5 mr-2 text-primary" />
                        {dict.expenses?.addNewExpense || "Add New Expense"}
                    </DialogTitle>
                    <DialogDescription>
                        {dict.expenses?.addExpenseDescription || "Add a new expense to track project costs"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">{dict.dashbaord?.description || "Description"} *</Label>
                        <Input
                            id="description"
                            placeholder={dict.expenses?.descriptionPlaceholder || "Enter expense description"}
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            className="bg-muted/50 border-border"
                            required
                        />
                    </div>

                    {/* Amount */}
                    <div className="space-y-2">
                        <Label htmlFor="amount">{dict.expenses?.amount || "Amount"} *</Label>
                        <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={(e) => handleInputChange("amount", e.target.value)}
                            className="bg-muted/50 border-border"
                            required
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <Label htmlFor="category">{dict.expenses?.category || "Category"} *</Label>
                        <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)} required>
                            <SelectTrigger className="bg-muted/50 border-border">
                                <SelectValue placeholder={dict.expenses?.selectCategory || "Select a category"} />
                            </SelectTrigger>
                            <SelectContent>
                                {predefinedCategories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                        {category}
                                    </SelectItem>
                                ))}
                                <SelectItem value="custom">{dict.expenses?.customCategory || "Custom Category"}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Custom Category */}
                    {formData.category === "custom" && (
                        <div className="space-y-2">
                            <Label htmlFor="customCategory">{dict.expenses?.customCategoryName || "Custom Category Name"} *</Label>
                            <Input
                                id="customCategory"
                                placeholder={dict.expenses?.enterCustomCategory || "Enter custom category"}
                                value={formData.customCategory}
                                onChange={(e) => handleInputChange("customCategory", e.target.value)}
                                className="bg-muted/50 border-border"
                                required
                            />
                        </div>
                    )}

                    {/* Date */}
                    <div className="space-y-2">
                        <Label>{dict.expenses?.date || "Date"}</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal bg-muted/50 border-border",
                                        !formData.date && "text-muted-foreground",
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    selected={formData.date}
                                    onSelect={(date) => handleInputChange("date", date || new Date())}
                                    lang= {user?.language_preference}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <Label htmlFor="status">{dict.expenses?.status || "Status"}</Label>
                        <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                            <SelectTrigger className="bg-muted/50 border-border">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">{dict.expenses?.pending || "Pending"}</SelectItem>
                                <SelectItem value="approved">{dict.expenses?.approved || "Approved"}</SelectItem>
                                <SelectItem value="rejected">{dict.expenses?.rejected || "Rejected"}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="notes">
                            {dict.expenses?.notes || "Notes"} ({dict.common?.optional || "Optional"})
                        </Label>
                        <Textarea
                            id="notes"
                            placeholder={dict.expenses?.notesPlaceholder || "Additional notes about this expense"}
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
                                    {dict.common?.adding || "Adding..."}
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4 mr-2" />
                                    {dict.expenses?.addExpense || "Add Expense"}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
