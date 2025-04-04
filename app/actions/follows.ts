"use server"
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


export async function followUserBD(token: string|null, userId: string, translates: any): Promise<any | null> {
    if (!token) return null;
    try {
        console.log("URL Using in FOLLOW _________________________", `${api_URL}${userId}`);
        return await fetch(`${api_URL}${userId}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        }).then(
            async (res) => {
                const json = await res.json();
                if (json.statusCode === 200) {
                    console.log("Follow User", json);
                    return json.data;
                } else {
                    return null
                }
            }
        )
    }catch ( error) {
        console.error("Error en la petición FOLLOW_USER:", error);
        return null;
    }

    return null
}

export async function unfollowUserBD(token: string|null, userId: string, translates: any): Promise<any | null> {
    if (!token) return null;
    try {
        return await fetch(`${api_URL}unfollow/${userId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        }).then(
            async (res) => {
                const json = await res.json();
                if (json.statusCode === 200) {
                    console.log("Unfollow User", json);
                    return json.data;
                } else {
                    return null
                }
            }
        )
    }catch ( error) {
        console.error("Error en la petición UNFOLLOW_USER:", error);
        return null;
    }

    return null
}

export async function acceptFollowerBD(token: string|null, userId: string, translates: any): Promise<any | null> {
    if (!token) return null;
    try {
        return await fetch(`${api_URL}accept_follow/${userId}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        }).then(
            async (res) => {
                const json = await res.json();
                if (json.statusCode === 200) {
                    console.log("Accept Follower", json);
                    return json.data;
                } else {
                    return null
                }
            }
        )
    }catch ( error) {
        console.error("Error en la petición ACCEPT_FOLLOWER:", error);
        return null;
    }

    return null
}


export async function rejectFollowerBD(token: string|null, userId: string, translates: any): Promise<any | null> {
    if (!token) return null;
    try {
        return await fetch(`${api_URL}reject_follow/${userId}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        }).then(
            async (res) => {
                const json = await res.json();
                if (json.statusCode === 200) {
                    console.log("Reject Follower", json);
                    return json.data;
                } else {
                    return null
                }
            }
        )
    }catch ( error) {
        console.error("Error en la petición REJECT_FOLLOWER:", error);
        return null;
    }

    return null
}