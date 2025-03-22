"use client"; // Este componente ahora solo se ejecuta en el cliente

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { getDictionary } from "@/lib/dictionary"
import SignUpForm from "@/components/SignUpForm"

export default function SignUpPage() {
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

    if (!dictionary) return <p>Loading...</p>; // Muestra un estado de carga mientras se obtiene el diccionario


    return <SignUpForm dictionary={dictionary} lang={params.lang as string} />;
}

