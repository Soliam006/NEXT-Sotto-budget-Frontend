import {UserFollower} from "@/contexts/user.types";

const api_URL = process.env.BASE_URL_BACK + "follows/"


export async function fetchFollowers(token: string, translates: any): Promise<any | null> {
    try {
        return await fetch(`${api_URL}follows_user`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }).then(
            async (res) => {
                const json = await res.json();
                if (json.statusCode === 200) {
                    console.log("Followers", json);
                    return json.data;
                } else {
                    return null
                }
            }
        )
    }catch ( error) {
        console.error("Error en la petición FOLLOWS_USER:", error);
        return null;
    }

    return null

}
