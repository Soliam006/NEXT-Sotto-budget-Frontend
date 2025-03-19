"use client"

import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

export default function LanguageSwitcher({
                                             currentLang,
                                             switchText,
                                         }: {
    currentLang: string
    switchText: string
}) {
    const router = useRouter()
    const pathname = usePathname()

    const switchLanguage = () => {
        const newLang = currentLang === "en" ? "es" : "en"
        // Actualizar para manejar la nueva estructura de carpetas
        const newPathname = pathname.replace(`/${currentLang}/`, `/${newLang}/`)
        router.push(newPathname)
    }

    return (
        <Button variant="outline" size="sm" className="flex items-center gap-1 rounded-full" onClick={switchLanguage}>
            <Globe className="h-4 w-4" />
            <span>{switchText}</span>
        </Button>
    )
}

