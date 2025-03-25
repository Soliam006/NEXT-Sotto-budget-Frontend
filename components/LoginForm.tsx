"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Building2, Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import LanguageSwitcher from "./language-switcher"
import { logIn } from "@/app/actions/auth"
import type { ExpectedType } from "@/lib/validations/auth"

export default function LoginForm({
                                      dictionary,
                                      lang,
                                  }: {
    dictionary: any
    lang: string
}) {
    const t = dictionary.login
    const common = dictionary.common

    const switchText = lang === "en" ? common.switchToSpanish : common.switchToEnglish

    // Estado para el resultado del login y el indicador de loading
    const [formState, setFormState] = useState<ExpectedType>({
        status: "",
        errors: {},
    })
    const [pending, setPending] = useState(false)
    const [passwordVisible, setPasswordVisible] = useState(false)

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setPending(true)

        const formData = new FormData(e.currentTarget)

        // Ejecuta la acción de logIn pasando el estado inicial y los mensajes de validación
        const result = await logIn({ status: "", errors: {} }, formData, t.validation)
        setFormState(result)
        setPending(false)
    }

    return (
      <div className="flex min-h-screen w-full flex-col md:flex-row bg-background">
          {/* Botón de cambio de idioma */}
          <div className="absolute right-4 top-4 z-10">
              <LanguageSwitcher currentLang={lang} switchText={switchText} />
          </div>

          <div
            className="hidden w-full bg-cover bg-center md:block md:w-1/2 relative"
            style={{
                backgroundImage:
                  "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://ecocosas.com/wp-content/uploads/2021/10/renovar-casa.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
          >
              <div className="absolute inset-0 bg-black/20 dark:bg-black/40"></div>
              <div className="relative flex h-full flex-col items-center justify-center p-8 text-white">
                  <h2 className="mb-4 text-3xl font-bold">{t.welcomeBack}</h2>
                  <p className="mb-6 text-center text-lg">{t.subtitle}</p>
                  <ul className="space-y-4 text-lg">
                      {t.benefits.map((benefit: string, index: number) => (
                        <li key={index} className="flex items-center">
                            <div className="mr-2 h-2 w-2 rounded-full bg-cyan-400"></div>
                            {benefit}
                        </li>
                      ))}
                  </ul>
              </div>
          </div>

          <form onSubmit={handleSubmit} className="flex w-full items-center justify-center p-4 md:w-1/2 md:p-8 h-screen">
              <Card className="w-full max-w-md shadow-lg border-border bg-card">
                  <CardHeader className="space-y-2 text-center">
                      <div className="mx-auto flex items-center justify-center space-x-2">
                          <Building2 className="h-8 w-8 text-primary" />
                          <span className="text-xl font-bold text-primary">SottoBudget</span>
                      </div>
                      <h1 className="text-2xl font-bold tracking-tight text-foreground">{t.login}</h1>
                      <p className="text-sm text-muted-foreground">{t.loginSubtitle}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <div className="space-y-2">
                          <Label htmlFor="emailOrUsername" className="text-foreground">
                              {t.emailUsername}
                          </Label>
                          <Input
                            id="emailOrUsername"
                            name="emailOrUsername"
                            type="text"
                            placeholder="john.doe@example.com or JohnDoe"
                            required
                            className="bg-background border-input text-foreground"
                            aria-invalid={!!formState?.errors?.emailOrUsername}
                          />
                          {formState?.errors && formState.errors?.emailOrUsername && (
                            <p className="text-xs text-destructive">{formState.errors.emailOrUsername[0]}</p>
                          )}
                      </div>
                      <div className="space-y-2">
                          <div className="flex items-center justify-between">
                              <Label htmlFor="password" className="text-foreground">
                                  {t.password}
                              </Label>
                              <Link
                                href={`/${lang}/auth/forgot-password`}
                                className="text-xs text-primary hover:text-primary/90 hover:underline"
                              >
                                  {t.forgotPassword}
                              </Link>
                          </div>
                          <div className="relative">
                              <Input
                                id="password"
                                name="password"
                                type={passwordVisible ? "text" : "password"}
                                required
                                className="bg-background border-input text-foreground pr-10"
                                aria-invalid={!!formState?.errors?.password}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                                onClick={togglePasswordVisibility}
                              >
                                  {passwordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                          </div>
                          {formState?.errors && formState.errors?.password && (
                            <p className="text-xs text-destructive">{formState.errors.password[0]}</p>
                          )}
                      </div>
                      <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="remember"
                            name="remember"
                            className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary"
                          />
                          <Label htmlFor="remember" className="text-sm text-muted-foreground">
                              {t.rememberMe}
                          </Label>
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        disabled={pending}
                      >
                          {pending ? common.processing : t.login}
                      </Button>

                      {formState?.status === "error" && !formState.errors?.emailOrUsername && !formState.errors?.password && !formState?.message&& (
                        <p className="text-center text-sm text-destructive">{t.validation.invalidUser}</p>
                      )}
                      {formState?.status === "error" && formState?.message && (
                        <p className="text-center text-sm text-destructive">{formState.message}</p>
                      )}
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-2 text-center text-xs text-muted-foreground">
                      <p>{t.secureAccess}</p>
                      <p>
                          {t.noAccount}{" "}
                          <Link
                            href={`/${lang}/signup`}
                            className="text-primary underline underline-offset-2 hover:text-primary/90"
                          >
                              {t.signUp}
                          </Link>
                      </p>
                  </CardFooter>
              </Card>
          </form>
      </div>
    )
}

