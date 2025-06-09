
export interface ProjectInfo {
    approved_by: string
    notes: string
    updated_at: string
}

export type Category = "Others" | "Materials" | "Products" | "Labour" | "Transport"

export interface Expenses {
    id: number
    expense_date: string
    category: Category
    description: string
    amount: number
    status: string
    updated_at: string
    project_info: ProjectInfo
}

export interface ExpensesBackend {
    id: number
    expense_date: string
    category: Category
    description: string
    amount: number
    status: string
    updated_at: string
    project_info: ProjectInfo
    deleted?: boolean
    updated?: boolean
    created?: boolean
}