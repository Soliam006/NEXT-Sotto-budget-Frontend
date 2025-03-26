import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {getLang, getToken} from "@/app/services/auth-service";


const useAuthMiddleware = (isAuthPath:boolean) => {

  const router = useRouter();

  useEffect(() => {

    console.log('Checking token');
    const token = getToken();
    const lang = getLang() || 'es';
    console.log('Token:', token, "Lang:", lang);
    if (!token) {
      router.push(`/${lang}/login`); // Redirige al login si no hay token
    } else{
      if(isAuthPath) {
        router.push(`/${lang}/profile`);
      }
    }
  }, [router]);
};

export default useAuthMiddleware;