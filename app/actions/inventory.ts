"use server"
import {redirect} from "next/navigation";
import {InventoryItem} from "@/lib/types/inventory-item";

const inventory_URL = process.env.BASE_URL_BACK + "inventory/"


//CREATE
export async function createInventory(token: string | null, data: InventoryItem): Promise<any | null> {
    if (!token)
        redirect("/es/login")

    try {
        return await fetch(`${inventory_URL}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        }).then(
            async (res) => {
                return await res.json();
            }
        )
    }catch ( error) {
        return null;
    }
}