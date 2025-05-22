
// Añadir la interfaz InventoryItem
export interface InventoryItem {
    id: number
    name: string
    category: "Servicios" | "Materiales" | "Productos" | "Mano de Obra"
    total: number
    used: number
    remaining: number
    unit: string
    unitCost: number
    supplier: string
    status: "Installed" | "Pending" | "In_Budget"
    project: string
}
