import Link from "next/link"
import { Building2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import LanguageSwitcher from "./language-switcher"
import {useActionState} from "react";
import {logIn} from "@/app/actions/auth";

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

    const loginActions= (prevState: any, formData: FormData) => 
        logIn(prevState, formData, t.validation)


    const [state, formAction, pending] = useActionState( loginActions, undefined );

    return (
        <div className="flex min-h-screen w-full flex-col md:flex-row  bg-gradient-to-br from-blue-950 via-black-600 to-blue-200">
            {/* Language toggle button */}
            <div className="absolute right-4 top-4 z-10">
                <LanguageSwitcher currentLang={lang} switchText={switchText} />
            </div>

            <div
                className="hidden w-full bg-cover bg-center md:block md:w-1/2"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://ecocosas.com/wp-content/uploads/2021/10/renovar-casa.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="flex h-full flex-col items-center justify-center p-8 text-white">
                    <h2 className="mb-4 text-3xl font-bold">{t.welcomeBack}</h2>
                    <p className="mb-6 text-center text-lg">{t.subtitle}</p>
                    <ul className="space-y-4 text-lg">
                        {t.benefits.map((benefit: string, index: number) => (
                            <li key={index} className="flex items-center">
                                <div className="mr-2 h-2 w-2 rounded-full bg-blue-400"></div>
                                {benefit}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <form action={formAction} className="flex w-full items-center justify-center p-4 md:w-1/2 md:p-8 h-screen">
                <Card className="w-full max-w-md shadow-lg">
                    <CardHeader className="space-y-2 text-center">
                        <div className="mx-auto flex items-center justify-center space-x-2 text-navy-700">
                            <Building2 className="h-8 w-8 text-blue-900" />
                            <span className="text-xl font-bold text-blue-900">SottoBudget</span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">{t.login}</h1>
                        <p className="text-sm text-muted-foreground">{t.loginSubtitle}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="emailOrUsername" >{t.emailUsername}</Label>
                            <Input id="emailOrUsername" name="emailOrUsername" type="text" placeholder="john.doe@example.com or JonhDoe" required />
                            {state?.errors && <p className="text-red-500 text-xs">{state.errors?.emailOrUsername}</p>}
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">{t.password}</Label>
                                <Link href={`/${lang}/auth/forgot-password`} className="text-xs text-blue-900 hover:underline">
                                    {t.forgotPassword}
                                </Link>
                            </div>
                            <Input id="password" name="password" type="password" required />
                        </div>
                        <Button type="submit" className="w-full bg-blue-900 cursor-pointer hover:bg-blue-800">{t.login}</Button>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2 text-center text-xs text-muted-foreground">
                        <p>{t.secureAccess}</p>
                        <p>
                            {t.noAccount}{" "}
                            <Link href={`/${lang}/signup`} 
                            className="text-blue-900 underline underline-offset-2 cursor-pointer hover:text-blue-800">
                                {t.signUp}
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </form>

        </div>
    )
}

