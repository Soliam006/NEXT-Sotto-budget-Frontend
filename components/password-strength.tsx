"use client"

import { useEffect, useState } from "react"

interface PasswordStrengthProps {
    password: string
    translations: {
        title: string
        veryWeak: string
        weak: string
        medium: string
        strong: string
        veryStrong: string
        requirements: {
            minLength: string
            uppercase: string
            number: string
            special: string
        }
    }
}

export default function PasswordStrength({ password, translations }: PasswordStrengthProps) {
    const [strength, setStrength] = useState({
        score: 0,
        message: translations.veryWeak,
        color: "bg-red-500",
    })

    useEffect(() => {
        const calculateStrength = () => {
            if (!password) {
                return {
                    score: 0,
                    message: translations.veryWeak,
                    color: "bg-red-500",
                }
            }

            let score = 0

            // Longitud mínima (6 caracteres)
            if (password.length >= 6) score += 1

            // Contiene mayúsculas
            if (/[A-Z]/.test(password)) score += 1

            // Contiene números
            if (/\d/.test(password)) score += 1

            // Contiene caracteres especiales
            if (/[^A-Za-z0-9]/.test(password)) score += 1

            // Determinar mensaje y color según la puntuación
            let message = ""
            let color = ""

            switch (score) {
                case 0:
                    message = translations.veryWeak
                    color = "bg-red-500"
                    break
                case 1:
                    message = translations.weak
                    color = "bg-orange-500"
                    break
                case 2:
                    message = translations.medium
                    color = "bg-yellow-500"
                    break
                case 3:
                    message = translations.strong
                    color = "bg-blue-500"
                    break
                case 4:
                    message = translations.veryStrong
                    color = "bg-green-500"
                    break
            }

            return { score, message, color }
        }

        setStrength(calculateStrength())
    }, [password, translations])

    return (
        <div className="space-y-1">
            <div className="flex h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                    className={`${strength.color} transition-all duration-300`}
                    style={{ width: `${(strength.score / 4) * 100}%` }}
                />
            </div>
            <p className="text-xs text-muted-foreground">
                {translations.title}: <span className="font-medium">{strength.message}</span>
            </p>
            <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                <li className={password.length >= 6 ? "text-green-600" : ""}>✓ {translations.requirements.minLength}</li>
                <li className={/[A-Z]/.test(password) ? "text-green-600" : ""}>✓ {translations.requirements.uppercase}</li>
                <li className={/\d/.test(password) ? "text-green-600" : ""}>✓ {translations.requirements.number}</li>
                <li className={/[^A-Za-z0-9]/.test(password) ? "text-green-600" : ""}>✓ {translations.requirements.special}</li>
            </ul>
        </div>
    )
}

