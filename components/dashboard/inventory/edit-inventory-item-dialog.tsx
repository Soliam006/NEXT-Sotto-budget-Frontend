"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import {InventoryItem} from "@/lib/types/inventory-item";

interface EditInventoryItemDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    item: InventoryItem
    dict: any
}

export function EditInventoryItemDialog({ open, onOpenChange, item, dict }: EditInventoryItemDialogProps) {
    const { updateInventoryItem } = useProject()


    const [name, setName] = useState(item.name)
    const [category, setCategory] = useState<"Servicios" | "Materiales" | "Productos" | "Mano de Obra">(
        item.category as "Servicios" | "Materiales" | "Productos" | "Mano de Obra",
    )
    const [total, setTotal] = useState<number>(item.total)
    const [used, setUsed] = useState<number>(item.used)
    const [unit, setUnit] = useState(item.unit)
    const [unitCost, setUnitCost] = useState<number>(item.unitCost)
    const [supplier, setSupplier] = useState(item.supplier)
    const [status, setStatus] = useState<"in_budget" | "Pending" | "Installed">(
        item.status as "in_budget" | "Pending" | "Installed",
    )

    // Actualizar los estados cuando cambia el item
    useEffect(() => {
        setName(item.name)
        setCategory(item.category as "Servicios" | "Materiales" | "Productos" | "Mano de Obra")
        setTotal(item.total)
        setUsed(item.used)
        setUnit(item.unit)
        setUnitCost(item.unitCost)
        setSupplier(item.supplier)
        setStatus(item.status as "in_budget" | "Pending" | "Installed")
    }, [item])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Validación básica
        if (!name || total <= 0 || !unit || unitCost <= 0 || !supplier) {
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

        // Actualizar el elemento en el inventario
        updateInventoryItem(item.id, {
            name,
            category,
            total,
            used,
            remaining: total - used,
            unit,
            unitCost,
            supplier,
            status,
        })

        // Mostrar notificación de éxito
        /* toast({
             title: dict.inventory?.itemUpdated || "Item Updated",
             description: `${name} ${dict.inventory?.hasBeenUpdated || "has been updated"}`,
         })*/

        // Cerrar el diálogo
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{dict.inventory?.editItem || "Edit Inventory Item"}</DialogTitle>
                    <DialogDescription>
                        {dict.inventory?.editItemDescription || "Update the details of this inventory item"}
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
                                <Select value={category} onValueChange={(value: any) => setCategory(value)}>
                                    <SelectTrigger id="category">
                                        <SelectValue placeholder={dict.inventory?.selectCategory || "Select category"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Servicios">{dict.inventory?.services || "Services"}</SelectItem>
                                        <SelectItem value="Materiales">{dict.inventory?.materials || "Materials"}</SelectItem>
                                        <SelectItem value="Productos">{dict.inventory?.products || "Products"}</SelectItem>
                                        <SelectItem value="Mano de Obra">{dict.inventory?.labor || "Labor"}</SelectItem>
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
                                        <SelectItem value="in_budget">{dict.inventory?.inBudget || "In Budget"}</SelectItem>
                                        <SelectItem value="Pending">{dict.inventory?.pending || "Pending"}</SelectItem>
                                        <SelectItem value="Installed">{dict.inventory?.installed || "Installed"}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="total">{dict.inventory?.totalQuantity || "Total Quantity"} *</Label>
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
                                <Label htmlFor="unitCost">{dict.inventory?.unitCost || "Unit Cost"} *</Label>
                                <Input
                                    id="unitCost"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={unitCost}
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
                                <span className="font-medium">${(total * unitCost).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            {dict.common?.cancel || "Cancel"}
                        </Button>
                        <Button
                            type="submit"
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                        >
                            {dict.common?.save || "Save"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
