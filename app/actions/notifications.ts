"use server";
import {redirect} from "next/navigation";

const notification_URL = process.env.BASE_URL_BACK + "notifications/";

export async function fetchNotificationsBD(token: string | null) {
    if (!token) {
        redirect("/es/login");
    }

    try {
        return await fetch(notification_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }).then(async response => {
            return await response.json();
        })

    } catch (error) {
        console.error("Error fetching notifications:", error)
        return null;
    }
}