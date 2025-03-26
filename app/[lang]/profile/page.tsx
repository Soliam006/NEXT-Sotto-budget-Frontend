"use client";
import ProfilePage from "@/components/profile"
import { getDictionary } from "@/lib/dictionary"
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import LoadingView from "@/components/loading-view";
import useAuthMiddleware from "@/lib/token-verification";

export default function  Profile() {
  console.log('Profile');
  useAuthMiddleware(false); // Redirige al login si no hay token

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

  if (!dictionary) return <LoadingView/>; // Muestra un estado de carga mientras se obtiene el diccionario

  return <ProfilePage dict={dictionary} lang={params?.lang  as string} />
}

