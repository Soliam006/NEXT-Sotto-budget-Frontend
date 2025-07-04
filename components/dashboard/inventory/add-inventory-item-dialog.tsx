"use client"

import type React from "react"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useProject } from "@/contexts/project-context"
import {InventoryCategory} from "@/lib/types/inventory-item";

interface AddInventoryItemDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    dict: any
}

export function AddInventoryItemDialog({ open, onOpenChange, dict }: AddInventoryItemDialogProps) {
    const { selectedProject, addInventoryItem } = useProject()

    const [name, setName] = useState("")
    const [category, setCategory] = useState<InventoryCategory>("Materials")
    const [total, setTotal] = useState<number>(0)
    const [used, setUsed] = useState<number>(0)
    const [unit, setUnit] = useState("")
    const [unit_cost, setUnitCost] = useState<number>(0)
    const [supplier, setSupplier] = useState("")
    const [status, setStatus] = useState<"In_Budget" | "Pending" | "Installed">("In_Budget")

    const resetForm = () => {
        setName("")
        setCategory("Materials")
        setTotal(0)
        setUsed(0)
        setUnit("")
        setUnitCost(0)
        setSupplier("")
        setStatus("In_Budget")
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Validación básica
        if (!name || total <= 0 || !unit || unit_cost <= 0 || !supplier) {
            /*toast({
                title: dict.common?.validationError || "Validation Error",
                description: dict.inventory?.fillAllFields || "Please fill all required fields",
                variant: "destructive",
            })*/
            return
        }

        // Asegurarse de que used no sea mayor que total
        if (used > total) {
            /*toast({
                title: dict.common?.validationError || "Validation Error",
                description: dict.inventory?.usedCannotExceedTotal || "Used quantity cannot exceed total quantity",
                variant: "destructive",
            })*/
            return
        }

        // Añadir el elemento al inventario
        addInventoryItem({
            name,
            category,
            total,
            used,
            remaining: total - used,
            unit,
            unit_cost,
            supplier,
            status,
            project: selectedProject?.title,
        })

        // Cerrar el diálogo y resetear el formulario
        resetForm()
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{dict.inventory?.addItem || "Add Inventory Item"}</DialogTitle>
                    <DialogDescription>
                        {dict.inventory?.addItemDescription || "Add a new item to your project inventory"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">{dict.inventory?.itemName || "Item Name"} *</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={dict.inventory?.enterItemName || "Enter item name"}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">{dict.inventory?.category || "Category"} *</Label>
                                <Select value={category} onValueChange={(value: InventoryCategory) => setCategory(value)}>
                                    <SelectTrigger id="category">
                                        <SelectValue placeholder={dict.inventory?.selectCategory || "Select category"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Services">{dict.inventory?.services || "Services"}</SelectItem>
                                        <SelectItem value="Materials">{dict.inventory?.materials || "Materials"}</SelectItem>
                                        <SelectItem value="Products">{dict.inventory?.products || "Products"}</SelectItem>
                                        <SelectItem value="Labour">{dict.inventory?.labor || "Labor"}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">{dict.inventory?.status || "Status"} *</Label>
                                <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder={dict.inventory?.selectStatus || "Select status"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="In_Budget">{dict.inventory?.inBudget || "In Budget"}</SelectItem>
                                        <SelectItem value="Pending">{dict.inventory?.pending || "Pending"}</SelectItem>
                                        <SelectItem value="Installed">{dict.inventory?.installed || "Installed"}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="total">{dict.inventory?.quantity || "Total Quantity"} *</Label>
                                <Input
                                    id="total"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={total}
                                    onChange={(e) => setTotal(Number.parseFloat(e.target.value) || 0)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="used">{dict.inventory?.usedQuantity || "Used Quantity"}</Label>
                                <Input
                                    id="used"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    max={total}
                                    value={used}
                                    onChange={(e) => setUsed(Number.parseFloat(e.target.value) || 0)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="unit">{dict.inventory?.unit || "Unit"} *</Label>
                                <Input
                                    id="unit"
                                    value={unit}
                                    onChange={(e) => setUnit(e.target.value)}
                                    placeholder={dict.inventory?.enterUnit || "e.g., m², kg, units"}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="unit_cost">{dict.inventory?.unit_cost || "Unit Cost"} *</Label>
                                <Input
                                    id="unit_cost"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={unit_cost}
                                    onChange={(e) => setUnitCost(Number.parseFloat(e.target.value) || 0)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="supplier">{dict.inventory?.supplier || "Supplier"} *</Label>
                                <Input
                                    id="supplier"
                                    value={supplier}
                                    onChange={(e) => setSupplier(e.target.value)}
                                    placeholder={dict.inventory?.enterSupplier || "Enter supplier name"}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>{dict.inventory?.totalCost || "Total Cost"}</Label>
                            <div className="p-2 border rounded-md bg-muted/30">
                                <span className="font-medium">€{(total * unit_cost).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                resetForm()
                                onOpenChange(false)
                            }}
                        >
                            {dict.common?.cancel || "Cancel"}
                        </Button>
                        <Button
                            type="submit"
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                        >
                            {dict.common?.add || "Add"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
