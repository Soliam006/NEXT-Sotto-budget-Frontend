"use server"
import {redirect} from "next/navigation";

const api_URL = process.env.BASE_URL_BACK + "follows/"


export async function fetchFollowers(token: string | null, translates: any|null): Promise<any | null> {
    if (!token) redirect("/es/login");

    try {
        return await fetch(`${api_URL}follows_status`, {
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


export async function followUserBD(token: string|null, userId: number, translates: any): Promise<any | null> {
    if (!token) return null;
    try {
        return await fetch(`${api_URL}${userId}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        }).then(
            async (res) => {
                return await res.json()
            }
        )
    }catch ( error) {
        return null;
    }

    return null
}

export async function unfollowUserBD(token: string|null, userId: number, translates: any): Promise<any | null> {
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
                return await res.json();
            }
        )
    }catch ( error) {
        return null;
    }
}

export async function acceptRequestBD(token: string|null, userId: number, translates: any): Promise<any | null> {
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
                return json;
            }
        )
    }catch ( error) {
        return null;
    }
}


export async function rejectFollowerBD(token: string|null, userId: number, translates: any): Promise<any | null> {
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
                return await res.json();
            }
        )
    }catch ( error) {
        return null;
    }
}