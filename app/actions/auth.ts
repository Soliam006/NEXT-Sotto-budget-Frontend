"use server"

import {createSignUpSchema} from "@/lib/validations/auth"

export async function signup(prevState:any, formData: FormData, validationMessages: any) {

    // Crear el esquema con los mensajes traducidos
    const signUpSchema = createSignUpSchema(validationMessages)

    // Validar con Zod
    const validationResult = signUpSchema.safeParse({
            name: formData.get("name"),
            username: formData.get("username"),
            phone: formData.get("phone"),
            email: formData.get("email"),
            password: formData.get("password"),
            countryCode: formData.get("countryCode"),
    })

    // Si hay errores de validación, devolverlos
    if (!validationResult.success) {
        return {
            status: "error",
            errors: validationResult.error.flatten().fieldErrors,
        }
    }

    // Aquí iría la lógica para crear el usuario en la base de datos
    // Por ahora, simulamos un retraso y devolvemos éxito
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
        status: "success",
        message: "User created successfully",
    }
}

