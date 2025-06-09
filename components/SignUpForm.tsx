"use client"

import { useState } from "react"
import Link from "next/link"
import {Building2, Eye, EyeOff} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import LanguageSwitcher from "./language-switcher"
import PasswordStrength from "./password-strength"
import { signup } from "@/app/actions/auth"
import { ExpectedType } from "@/lib/validations/auth"

const countryCodes = [
    { code: "+1", country: "US" },
    { code: "+44", country: "UK" },
    { code: "+49", country: "DE" },
    { code: "+33", country: "FR" },
    { code: "+34", country: "ES" },
    { code: "+39", country: "IT" },
    { code: "+52", country: "MX" },
]

export default function SignUpForm({
                                       dictionary,
                                       lang,
                                   }: {
    dictionary: any
    lang: string
}) {
    const t = dictionary.signup
    const common = dictionary.common

    const switchText = lang === "en" ? common.switchToSpanish : common.switchToEnglish

    const [countryCode, setCountryCode] = useState("+34")
    const [password, setPassword] = useState("")
    const [passwordVisible, setPasswordVisible] = useState(false)

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible)
    }
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value.replace(/\s/g, "");
        setPassword(newValue);
    };
    // Estado para el resultado del envío y el indicador de "pending"
    const [formState, setFormState] = useState<ExpectedType>({
        status: "",
        errors: {}
    })
    const [pending, setPending] = useState(false)

    // Manejador del envío del formulario
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setPending(true)

        // Construir FormData a partir del formulario
        const formData = new FormData(e.currentTarget)
        // Forzar el valor de countryCode (ya que lo manejamos con estado)
        formData.set("countryCode", countryCode)

        // Llamar a la acción de signup y esperar su resultado
        const result = await signup({ status: "", errors: {} }, formData, t.validation)
        setFormState(result)
        setPending(false)
    }

    return (
      <div className="flex min-h-screen w-full flex-col md:flex-row bg-background">
          {/* Botón de cambio de idioma */}
          <div className="absolute right-4 top-4 z-10">
              <LanguageSwitcher currentLang={lang} switchText={switchText} />
          </div>

          <div className="flex w-full items-center justify-center p-4 md:w-1/2 md:p-8">
              <Card className="w-full max-w-md shadow-lg border-border bg-card">
                  <CardHeader className="space-y-2 text-center">
                      <div className="mx-auto flex items-center justify-center space-x-2">
                          <Building2 className="h-8 w-8 text-primary" />
                          <span className="text-xl font-bold text-primary">SottoBudget</span>
                      </div>
                      <h1 className="text-2xl font-bold tracking-tight text-foreground">{t.createAccount}</h1>
                      <p className="text-sm text-muted-foreground">{t.subtitle}</p>
                  </CardHeader>
                  <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="space-y-2">
                              <Label htmlFor="name" className="text-foreground">
                                  {t.fullName}
                              </Label>
                              <Input
                                id="name"
                                name="name"
                                placeholder="John Doe"
                                className="bg-background border-input text-foreground"
                                aria-invalid={!!formState?.errors?.name}
                              />
                              {formState?.status === "error" && formState.errors?.name && (
                                <p className="text-xs text-destructive">{formState.errors.name[0]}</p>
                              )}
                          </div>

                          <div className="space-y-2">
                              <Label htmlFor="username" className="text-foreground">
                                  {dictionary.profile.username}
                              </Label>
                              <Input
                                id="username"
                                name="username"
                                placeholder="johndoe"
                                className="bg-background border-input text-foreground"
                                aria-invalid={!!formState?.errors?.username}
                              />
                              {formState?.status === "error" && formState.errors?.username && (
                                <p className="text-xs text-destructive">{formState.errors.username[0]}</p>
                              )}
                          </div>

                          <div className="space-y-2">
                              <Label htmlFor="phone" className="text-foreground">
                                  {dictionary.profile.phoneNumber}
                              </Label>
                              <div className="flex space-x-2">
                                  <input type="hidden" name="countryCode" value={countryCode} />
                                  <Select value={countryCode} onValueChange={setCountryCode}>
                                      <SelectTrigger className="w-[100px] bg-background border-input text-foreground">
                                          <SelectValue placeholder="Code" />
                                      </SelectTrigger>
                                      <SelectContent className="bg-popover border-border text-popover-foreground">
                                          {countryCodes.map((country) => (
                                            <SelectItem key={country.code} value={country.code}>
                                                {country.code} {country.country}
                                            </SelectItem>
                                          ))}
                                      </SelectContent>
                                  </Select>
                                  <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="(555) 123-4567"
                                    className="flex-1 bg-background border-input text-foreground"
                                    aria-invalid={!!formState?.errors?.phone}
                                  />
                              </div>
                              {formState?.status === "error" && formState.errors?.phone && (
                                <p className="text-xs text-destructive">{formState.errors.phone[0]}</p>
                              )}
                          </div>

                          <div className="space-y-2">
                              <Label htmlFor="email" className="text-foreground">
                                  {t.email}
                              </Label>
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="john.doe@example.com"
                                className="bg-background border-input text-foreground"
                                aria-invalid={!!formState?.errors?.email}
                              />
                              {formState?.status === "error" && formState.errors?.email && (
                                <p className="text-xs text-destructive">{formState.errors.email[0]}</p>
                              )}
                          </div>

                          <div className="space-y-2">
                              <Label htmlFor="password" className="text-foreground">
                                  {t.password}
                              </Label>
                              <div className="relative">
                                  <Input
                                    id="password"
                                    name="password"
                                    type={passwordVisible ? "text" : "password"}
                                    value={password}
                                    onChange={handlePasswordChange}
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
                              <PasswordStrength password={password} translations={t.passwordStrength} />
                              {formState?.status === "error" && formState.errors?.password && (
                                <p className="text-xs text-destructive">{formState.errors.password[0]}</p>
                              )}
                          </div>

                          <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                            disabled={pending}
                          >
                              {pending ? common.processing : t.signUp}
                          </Button>

                          {formState?.status === "success" && <p className="text-center text-sm text-green-600">{t.success}</p>}
                      </form>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-2 text-center text-xs text-muted-foreground">
                      <p>{t.privacy}</p>
                      <p>
                          {t.alreadyAccount}{" "}
                          <Link href={`/${lang}/login`} className="text-primary underline underline-offset-2 hover:text-primary/90">
                              {t.logIn}
                          </Link>
                      </p>
                  </CardFooter>
              </Card>
          </div>
          <div
            className="hidden w-1/2 bg-cover bg-center md:block relative"
            style={{
                backgroundImage:
                  "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://cdn-3.expansion.mx/dims4/default/7170155/2147483647/strip/true/crop/3864x2576+0+0/resize/1200x800!/format/webp/quality/60/?url=https%3A%2F%2Fcdn-3.expansion.mx%2F4b%2Fbf%2F2b799bc040a7bb1f858f5bbb22a2%2Fistock-1309114403.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
          >
              <div className="absolute inset-0 bg-black/20 dark:bg-black/40"></div>
              <div className="relative flex h-full flex-col items-center justify-center p-8 text-white">
                  <h2 className="mb-4 text-3xl font-bold">{t.transformTitle}</h2>
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
      </div>
    )
}
