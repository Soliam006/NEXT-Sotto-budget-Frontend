"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useTheme as useNextTheme } from "next-themes"
import { TopBar } from "@/components/top-bar"
import type { User as UserType } from "@/contexts/user.types"
import LoadingView from "@/components/loading-view";

interface TopBarWrapperProps {
    dictionary: any
    lang: string,
    onNavigate?: (path: string) => void
    children?: React.ReactNode
}

export function TopBarWrapper({ dictionary, lang, onNavigate, children }: TopBarWrapperProps) {
    const { theme, setTheme } = useNextTheme()
    const [currentTheme, setCurrentTheme] = useState<"dark" | "light">("dark")

    // Sincronizar el tema con next-themes
    useEffect(() => {
        if (theme === "dark" || theme === "light") {
            setCurrentTheme(theme as "dark" | "light")
        }
    }, [theme])

    // Toggle theme
    const toggleTheme = () => {
        const newTheme = currentTheme === "dark" ? "light" : "dark"
        setTheme(newTheme)
        setCurrentTheme(newTheme)
    }

    return (
        <>
            <TopBar theme={currentTheme} toggleTheme={toggleTheme}
                    dictionary={dictionary} lang={lang} onNavigate={onNavigate} />
            {children}
        </>
    )
}

