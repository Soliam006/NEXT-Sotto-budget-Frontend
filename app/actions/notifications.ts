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
        return null;
    }
}

export async function markNotificationAsRead(token: string | null, notificationId: number) {
    if (!token) {
        redirect("/es/login");
    }

    try {
        return await fetch(`${notification_URL}${notificationId}/read`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }).then(async response => {
            return await response.json();
        })

    } catch (error) {
        return null;
    }
}


export async function mark_all_notifications_as_read(token: string | null, project_id: number) {
    if (!token) {
        redirect("/es/login");
    }

    try {
        return await fetch(`${notification_URL}${project_id}/mark_all_read`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }).then(async response => {
            return await response.json();
        })

    } catch (error) {
        return null;
    }
}