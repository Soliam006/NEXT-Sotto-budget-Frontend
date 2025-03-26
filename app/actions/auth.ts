"use server"

import {createSignUpSchema, ExpectedType, LoginSchema} from "@/lib/validations/auth"
import {fullWidthClassName} from "react-remove-scroll-bar";

const api_URL = process.env.BASE_URL_BACK + "users/"

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
        const response: any = await fetch(`${api_URL}`, {
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

export async function logIn(prevState: ExpectedType, formData: FormData, translates: any) : Promise<ExpectedType> {

    // Validate input
    const emailOrUsername = formData.get("emailOrUsername")?.toString()
    const password = formData.get("password")?.toString()

    // Validar con Zod
    const validationResult = LoginSchema(translates).safeParse({
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
    if(!emailOrUsername || !password) {
        return {
            status: "error",
            errors: {emailOrUsername: [translates.required], password: [translates.required]},
        }
    }

    try {
        const response = await fetchLogin(emailOrUsername, password);
        const json = await response.json();
        return validateResult(json, translates);
    } catch (error) {
        console.error("Network or server error:", error);
        return {
            status: "error",
            message: translates.serverError,
        };
    }
}

function fetchLogin(emailOrUsername: string, password: string) {
    const isEmail = emailOrUsername.includes("@");
    const endpoint = isEmail ? "token_email" : "token_username";
    return fetch(`${api_URL}${endpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            [isEmail ? "email" : "username"]: emailOrUsername,
            password,
        }),
    });
}

function validateResult(json: any, translates: any) {
    if (json.statusCode !== 200) {
        if (json.statusCode === 401) {
            return {
                status: "error",
                message: translates.invalidUser,
            };
        }
        return {
            status: "error",
            message: json.message,
        };
    }

    return {
        status: "success",
        message: "User authenticated successfully",
        data: json.data,
    };
}

export async function fetchUserMe(token: string, translates: any) {
    let response
    try {
        // Realiza la petición GET al endpoint /me
        response = await fetch(`${api_URL}me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });

    } catch (error) {
        console.error('Error en la petición:', error);
        return {
            status: 'error',
            message: translates.serverError,
        };
    }

    return response.json();
}

