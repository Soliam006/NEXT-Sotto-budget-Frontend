export interface Task {
    id: number;
    title: string;
    status: "COMPLETED" | "IN_PROGRESS" | "PENDING";
    worker: string;
}

export interface Material {
    id: number;
    name: string;
    cost: number;
    quantity: number;
}

export interface DailyExpense {
    date: string;
    spent: number;
    limit: number;
    tasks: Task[];
    inventory: Material[];
}
