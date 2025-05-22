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
                const json = await res.json();
                if (json.statusCode === 200) {
                    console.log("Inventory", json);
                } else {
                    console.error("Error en la petición INVENTORY:", json);
                }
                return json;
            }
        )
    }catch ( error) {
        console.error("Error en la petición INVENTORY:", error);
        return null;
    }
}