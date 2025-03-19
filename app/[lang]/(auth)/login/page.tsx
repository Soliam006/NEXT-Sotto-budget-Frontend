import { getDictionary } from "@/lib/dictionary"
import LoginForm from "@/components/login-form"

// Definimos los parámetros válidos para la ruta dinámica
export async function generateStaticParams() {
    return [{ lang: "en" }, { lang: "es" }]
}

export default async function LoginPage({ params }: { params: { lang: string } }) {
    const dictionary = await getDictionary(params.lang)

    return <LoginForm dictionary={dictionary} lang={params.lang} />
}

