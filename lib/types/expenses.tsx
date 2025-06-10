
export interface ProjectInfo {
    approved_by: string
    notes: string
    updated_at: string
}

export type Category = "Others" | "Materials" | "Products" | "Labour" | "Transport"
export type statusType = "Pending" | "Approved" | "Rejected"

export interface Expenses {
    id: number
    title: string
    expense_date: string
    category: Category
    description: string
    amount: number
    status: statusType
    updated_at: string
    project_info: ProjectInfo
}

export interface ExpensesBackend {
    id: number
    expense_date: string
    category: Category
    description: string
    amount: number
    status: statusType
    updated_at: string
    approved_by: string
    notes: string
    deleted?: boolean
    updated?: boolean
    created?: boolean
}