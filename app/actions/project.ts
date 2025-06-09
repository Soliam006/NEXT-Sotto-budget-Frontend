"use server"
import {redirect} from "next/navigation";
import {Expenses} from "@/lib/types/expenses";
import {Task} from "@/lib/types/tasks";
import {Project, ProjectBackend} from "@/lib/types/project.types";

const project_URL = process.env.BASE_URL_BACK + "projects/"


export async function fetchProjects(token: string |null): Promise<any | null> {

    if (!token) {
        redirect("/es/login")
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
                console.log("Projects Response: ", json);
                if (json.statusCode === 200) {
                    if (json.data && json.data.length !== 0) {
                        // Make Projects Objects from json response
                        json.data = json.data.map((project: Project) => {
                            const {tasks, expenses, ...rest} = project;
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
                                })
                            }
                            return newProject;
                        });
                    }
                    return json;
                } else {
                    return json;
                }
            }
        )
    }catch ( error) {
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
                    return json.data;
                } else {
                    return null
                }
            }
        )
    }catch ( error) {
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
                return await res.json();
            }
        )
    }catch ( error) {
        return error
    }
}


// UPDATE
export async function updateProjectToBackend(token: string | null, project:Partial<ProjectBackend>) {
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
                return await res.json();
            }
        )
    }catch ( error) {
        return error
    }
}