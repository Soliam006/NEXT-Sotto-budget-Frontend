"use server"

import {createSignUpSchema, ExpectedType, LoginSchema} from "@/lib/validations/auth"
import {User} from "@/lib/types/user.types";
import {redirect} from "next/navigation";
import isEqual from "lodash.isequal";

const api_URL = process.env.BASE_URL_BACK + "users/"

export async function signup(
    initialState: ExpectedType,
    formData: FormData,
    validationMessages: any)  {

    // Crear el esquema con los mensajes traducidos
    const signUpSchema = createSignUpSchema(validationMessages)

    // Validar con Zod
    const validationResult = signUpSchema.safeParse({
            name: formData.get("name"),
            username: formData.get("username"),
            email: formData.get("email"),
            password: formData.get("password"),
            phone: formData.get("phone"),
    })

    // Si hay errores de validación, devolverlos
    if (!validationResult.success) {
        return {
            status: "error",
            errors: validationResult.error.flatten().fieldErrors,
        }
    }
    const countryCode = formData.get("countryCode")
    // Forzar el valor de countryCode (ya que lo manejamos con estado)
    formData.get("phone") && formData.set("phone", `${countryCode} ${formData.get("phone")}`)

    try{
        const response: any = await fetch(`${api_URL}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: formData.get("name"),
                username: formData.get("username"),
                email: formData.get("email"),
                password: formData.get("password"),
                phone: formData.get("phone"),
            }),
        });

        const json = await response.json();

        // Si hay un error en la petición, devolverlo
        if (json.statusCode === 400 || json.statusCode === 409) {
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
                    email:[ validationMessages.emailTaken],
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

        return {
            status: 'error',
            message: translates.serverError,
        };
    }

    return response.json();
}

export async function updateUserInformation(updateData: User, actual_user:User|null, token: string |null, translates: any) {
    let response

    let body: Partial<User> = {};

    if(actual_user === null){
        body = updateData;
    }else {
        if (updateData.name !== actual_user.name) body.name = updateData.name;
        if (updateData.username !== actual_user.username) body.username = updateData.username;
        if (updateData.email !== actual_user.email) body.email = updateData.email;
        if (updateData.phone !== actual_user.phone) body.phone = updateData.phone;
        if (updateData.location !== actual_user.location) body.location = updateData.location;
        if (updateData.description !== actual_user.description) body.description = updateData.description;
        if (!isEqual(updateData.client?.availabilities, actual_user.client?.availabilities)) {
            if (!body.client) body.client = {};
            body.client.availabilities = updateData.client?.availabilities;
        }
    }


    try {
        // Realiza la petición PUT al endpoint /me
        response = await fetch(`${api_URL}${updateData.id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
        });

    } catch (error) {
        return {
            status: 500,
            data: null,
            message: translates.serverError,
        };
    }
    return await response.json()
}

