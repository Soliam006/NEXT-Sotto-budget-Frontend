"use server"

import {createSignUpSchema, ExpectedType, LoginSchema} from "@/lib/validations/auth"

const api_URL = process.env.BASE_URL_BACK + "users"

export async function signup(
    initialState: ExpectedType,
    formData: FormData,
    validationMessages: any)  {

    console.log("ENTRANDO A SIGNUP")
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

    //Enviar los datos al servidor
    console.log("Sending request to:", api_URL);
    console.log("Request body:", JSON.stringify({
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        language_preference: "es",
        role: "client",
    }));
    try{
        const response: any = await fetch(`${api_URL}/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: formData.get("username"),
                email: formData.get("email"),
                password: formData.get("password"),
                language_preference: "es",
                role: "client",
            }),
        });

        const json = await response.json();
        console.log("Response JSON:", json);
        console.log("API_URL", api_URL);

        // Si hay un error en la petición, devolverlo
        if (json.statusCode === 400) {
            const message = json.message
            if( message.includes("El usuario ya existe")){
                return {
                    status: "error",
                    errors: {
                        username: [validationMessages.userTaken],
                    },
                }
            }
            return {
                status: "error",
                errors: {
                    email:[ "Email already in use"]
                },
            }
        }

        return {
            status: "success",
            message: "User created successfully",
        }

    } catch (error) {
        // Manejo de errores en la conexión, etc.
        return {
            status: "error",
            message: "Error de red o servidor",
        };
    }
}

export async function logIn(prevState:ExpectedType, formData: FormData, translates: any) {
    const emailOrUsername = formData.get("emailOrUsername")?.toString()
    const password = formData.get("password")?.toString()

    console.log("Translates", translates)

    // Validar con Zod
    const validationResult = LoginSchema.safeParse({
        emailOrUsername: emailOrUsername,
        password: password,
    })

    // Si hay errores de validación, devolverlos
    if (!validationResult.success) {
        return {
            status: "error",
            errors: validationResult.error.flatten().fieldErrors,
        }
    }
    console.log(emailOrUsername)


    // Llamar a la función correspondiente
    if( emailOrUsername) 
        //Verificar si es username o email
        if( emailOrUsername.includes("@") ){ 
            const response = await logInWithEmail(emailOrUsername, password || "")
            if (!response.ok) {
                return {
                    status: "error",
                    errors: {
                        emailOrUsername: [translates.invalidUser],
                    },
                }
            }
        } else {
            const response = await logInWithUsername(emailOrUsername, password || "")
            if (!response.ok) {
                return {
                    status: "error",
                    errors: {
                        emailOrUsername: [translates.invalidUser],
                    },
                }
            }
        }


    return {
        status: "success",
        message: "User authenticated successfully",
    }
}

function logInWithUsername(username: string, password: string) {
    return fetch(`${api_URL}/token_username`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            password,
        }),
    })
}

function logInWithEmail(email: string, password: string) {
    return fetch(`${api_URL}/token_email`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
    })
}

