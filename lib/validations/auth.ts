import { z } from "zod"

// Función para crear el esquema con mensajes traducidos
export const createSignUpSchema = (messages: any) => {
    return z.object({
        name: z.string().min(2, { message: messages.nameMin }).max(30, { message: messages.nameMax }),
        username: z
            .string()
            .min(3, { message: messages.usernameMin })
            .max(20, { message: messages.usernameMax })
            .regex(/^[a-zA-Z0-9_]+$/, { message: messages.usernameFormat }),

        phone: z.string().regex(/^\d+$/, { message: messages.phoneFormat }),

        email: z.string().email({ message: messages.emailFormat }),

        password: z.string().min(6, { message: messages.passwordMin }),
        countryCode: z.string()
    })
}

export const LoginSchema = z.object({
        emailOrUsername: z.string(),
        password: z.string().min(6),
});

export type FormState =
    | {
    errors?: {
        name?: string[]
        email?: string[]
        password?: string[]
    }
    message?: string
}
    | undefined


export type ExpectedType = {
    message?: string;
    errors?: {
        emailOrUsername?: string[];
        password?: string[];
        phone?: string[];
        name?: string[];
        email?: string[];
        username?: string[];
    };
    status: string;
};