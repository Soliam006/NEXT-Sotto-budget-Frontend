// Definimos explícitamente los idiomas soportados
export type Locale = "en" | "es" | "ca"

// Objeto con las funciones para cargar los diccionarios
const dictionaries = {
    en: () => import("../dictionaries/en.json").then((module) => module.default),
    es: () => import("../dictionaries/es.json").then((module) => module.default),
    ca: () => import("../dictionaries/ca.json").then((module) => module.default),
}

export const getDictionary = async (locale: string) => {
    // Verificamos que el locale sea válido, si no, usamos 'en' como fallback
    if (!["en", "es", "ca"].includes(locale as Locale)) {
        console.warn(`Locale '${locale}' not supported, falling back to 'en'`)
        locale = "en"
    }

    // Ahora podemos estar seguros de que locale es 'en' o 'es'
    return dictionaries[locale as Locale]()
}

