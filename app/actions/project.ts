"use server"
import {redirect} from "next/navigation";

const project_URL = process.env.BASE_URL_BACK + "projects/"
const team_URL = process.env.BASE_URL_BACK + "teams/"
const materials_URL = process.env.BASE_URL_BACK + "materials/"
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
                    console.log("Projects", json);
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