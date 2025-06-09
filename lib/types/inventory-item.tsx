
export type InventoryCategory = "Services" | "Materials" | "Products" | "Labour"

// Añadir la interfaz InventoryItem
export interface InventoryItem {
    id: number
    name: string
    category: InventoryCategory
    total: number
    used: number
    remaining: number
    unit: string
    unit_cost: number
    supplier: string
    status: "Installed" | "Pending" | "In_Budget"
    project: string
}

export interface InventoryItemBackend {
    id: number
    name: string
    category: InventoryCategory
    total: number
    used: number
    remaining: number
    unit: string
    unit_cost: number
    supplier: string
    status: "Installed" | "Pending" | "In_Budget"
    project: string
    deleted?: boolean
    updated?: boolean
    created?: boolean
}