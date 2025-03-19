import { getDictionary } from "@/lib/dictionary"
import SignUpForm from "@/components/signup-form"

// Definimos los parámetros válidos para la ruta dinámica
export async function generateStaticParams() {
    return [{ lang: "en" }, { lang: "es" }]
}

export default async function SignUpPage({ params }: { params: { lang: string } }) {
    const dictionary = await getDictionary(params.lang)

    return <SignUpForm dictionary={dictionary} lang={params.lang} />
}

