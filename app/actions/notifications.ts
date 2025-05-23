"use server";
import {  MOCK_BACKEND_ACTIVITIES } from "@/lib/helpers/notifications"

const notification_URL = process.env.BASE_URL_BACK + "notifications/";

export async function fetchNotifications(token: string) {
    try {
        // TODO: Replace with actual API call
        // const response = await fetch('path')
        // const backendActivities: BackendActivity[] = await response.json().data;

        // For now, use mock data
        await new Promise((resolve) => setTimeout(resolve, 1000))

        return {statusCode: 200, data: MOCK_BACKEND_ACTIVITIES}

    } catch (error) {
        console.error("Error fetching notifications:", error)
        return null;
    }
}