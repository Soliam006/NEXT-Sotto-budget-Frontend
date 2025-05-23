"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useTheme as useNextTheme } from "next-themes"
import { TopBar } from "@/components/top-bar"
import type { User as UserType } from "@/contexts/user.types"
import LoadingView from "@/components/loading-view";

interface TopBarWrapperProps {
    user: UserType | null
    dictionary: any
    lang: string,
    onNavigate?: (path: string) => void
    children?: React.ReactNode
}

export function TopBarWrapper({ user, dictionary, lang, onNavigate, children }: TopBarWrapperProps) {
    const { theme, setTheme } = useNextTheme()
    const [currentTheme, setCurrentTheme] = useState<"dark" | "light">("dark")

    // Sincronizar el tema con next-themes
    useEffect(() => {
        if (theme === "dark" || theme === "light") {
            setCurrentTheme(theme as "dark" | "light")
        }
        console.log("CURRENT DICCIONARY", dictionary)
    }, [theme])

    // Toggle theme
    const toggleTheme = () => {
        const newTheme = currentTheme === "dark" ? "light" : "dark"
        setTheme(newTheme)
        setCurrentTheme(newTheme)
    }

    return (
        <>
            <TopBar user={user} theme={currentTheme} toggleTheme={toggleTheme}
                    dictionary={dictionary} lang={lang} onNavigate={onNavigate} />
            {children}
        </>
    )
}

