"use server"
import {redirect} from "next/navigation";
import {Project} from "@/components/projects/projects-selector";
import {Expenses} from "@/lib/types/expenses";
import {Task} from "@/lib/types/tasks";

const project_URL = process.env.BASE_URL_BACK + "projects/"
const team_URL = process.env.BASE_URL_BACK + "teams/"
const tasks_URL = process.env.BASE_URL_BACK + "tasks/"
const expenses_URL = process.env.BASE_URL_BACK + "expenses/"


export async function fetchProjects(token: string |null): Promise<any | null> {

    if (!token) {
        redirect("/es/login")
        return null;
    }

    try {
        return await fetch(`${project_URL}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }).then(
            async (res) => {
                const json = await res.json();
                if (json.statusCode === 200) {
                    // Make Projects Objects from json response
                    json.data = json.data.map((project: Project) => {
                        const {tasks,expenses, ...rest} = project;
                        const newProject: Project = {
                            ...rest,
                            tasks: tasks?.map((task: Task) => {
                                return {
                                    id: task.id,
                                    title: task.title,
                                    description: task.description,
                                    assignee: task.assignee,
                                    worker_id: task.worker_id,
                                    status: task.status,
                                    created_at: task.created_at,
                                    updated_at: task.updated_at,
                                    due_date: task.due_date
                                }
                            }),
                            expenses: expenses?.map((expense: Expenses) => {
                                return {
                                    id: expense.id,
                                    expense_date: expense.expense_date,
                                    category: expense.category,
                                    description: expense.description,
                                    amount: expense.amount,
                                    status: expense.status,
                                    updated_at: expense.updated_at,
                                    project_info: {
                                        approved_by: expense.project_info.approved_by,
                                        notes: expense.project_info.notes,
                                        updated_at: expense.project_info.updated_at
                                    }
                                }
                            }),
                        }
                        console.log("Expenses:", newProject.expenses);
                        return newProject;
                    });
                    return json;
                } else {
                    return json;
                }
            }
        )
    }catch ( error) {
        console.error("Error en la petición PROJECTS:", error);
        return null;
    }
}


export async function fetchProjectDetailWithID( token: string | null, id: string): Promise<any | null> {
    if (!token) {
        redirect("/es/login")
        return null;
    }

    try {
        return await fetch(`${project_URL}${id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }).then(
            async (res) => {
                const json = await res.json();
                if (json.statusCode === 200) {
                    console.log("Project Detail", json);
                    return json.data;
                } else {
                    console.error("Error en la petición PROJECTS:", json);
                    return null
                }
            }
        )
    }catch ( error) {
        console.error("Error en la petición PROJECTS:", error);
        return null;
    }
}


// ADD
export async function addProjectToBackend(token: string | null, project: Partial<Project>) {
    if (!token)
        redirect("/es/login")

    try {
        return await fetch(`${project_URL}create`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(project),
        }).then(
            async (res) => {
                const json = await res.json();
                if (json.statusCode === 200) {
                    console.log("Project added", json);
                } else {
                    console.error("Error en la petición PROJECTS:", json);
                }
                return json;
            }
        )
    }catch ( error) {
        console.error("Error en la petición PROJECTS:", error);
        return error
    }
}


// UPDATE
export async function updateProjectToBackend(token: string | null, project:Partial<Project>) {
    if (!token)
        redirect("/es/login")

    try {
        return await fetch(`${project_URL}${project.id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(project),
        }).then(
            async (res) => {
                const json = await res.json();
                if (json.statusCode === 200) {
                    console.log("Project updated", json);
                } else {
                    console.error("Error en la petición PROJECTS:", json);
                }

                return json;
            }
        )
    }catch ( error) {
        console.error("Error en la petición PROJECTS:", error);
        return error
    }
}