"use client";
import ProfilePage from "@/components/profile/profile"
import { getDictionary } from "@/lib/dictionary"
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import LoadingView from "@/components/loading-view";
import useAuthMiddleware from "@/lib/token-verification";
import {TopBarWrapper} from "@/components/top-bar-wrapper";
import {useUser} from "@/contexts/UserProvider";
import {NotificationProvider} from "@/contexts/notification-context";

export default function  Profile() {

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

  return (
      <NotificationProvider dictionary={dictionary}>
          <div className="min-h-screen bg-background">
            <TopBarWrapper dictionary={dictionary} lang={params.lang as string} />
            <div className="container mx-auto px-4 py-6 md:pt-16">
              <ProfilePage dict={dictionary} lang={params.lang as string} />
            </div>
          </div>
      </NotificationProvider>
  )
}

