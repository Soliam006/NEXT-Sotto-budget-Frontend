"use client"; // Este componente ahora solo se ejecuta en el cliente

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import { getDictionary } from "@/lib/dictionary"
import LoadingView from "@/components/loading-view";
import useAuthMiddleware from "@/lib/token-verification";

export default function LoginPage() {
    const [isLoadding, setIsLoadding] = useState(true);

    const params = useParams(); // Obtiene dinámicamente los parámetros de la URL
    const [dictionary, setDictionary] = useState<any>(null);

    useEffect(() => {
        async function fetchDictionary() {
            if (params?.lang) {
                const dict = await getDictionary(params.lang as string);
                setDictionary(dict);
            }
        }
        fetchDictionary();
    }, [params?.lang]);

    useAuthMiddleware(true, setIsLoadding, params?.lang as string); // Redirige al login si no hay token

    if (!dictionary) return <LoadingView/>// Muestra un estado de carga mientras se obtiene el diccionario

    return <LoginForm dictionary={dictionary} lang={params.lang as string} />;
}
