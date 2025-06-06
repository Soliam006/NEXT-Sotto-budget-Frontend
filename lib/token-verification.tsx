import {useRouter} from "next/navigation";
import {Dispatch, SetStateAction, useEffect} from "react";
import {clearToken, getLang, getToken} from "@/app/services/auth-service";
import {useUser} from "@/contexts/UserProvider";
import {fetchUserMe} from "@/app/actions/auth";


const useAuthMiddleware = (isAuthPath:boolean,
                           setIsLoadding: Dispatch<SetStateAction<boolean>>, lang_route?:string) => {

  console.log("useAuthMiddleware LANG_ROUTE", lang_route);
  const router = useRouter();
  const {user, setUser, token, setToken} = useUser();
  const tokenStorage = getToken(); // Obtiene el token del almacenamiento local o de sesión

  useEffect(() => {
    const checkToken = async () => {
      console.log('Checking token');
      const lang = getLang() || 'es';
      console.log('Token:', token, "Lang:", lang);
      if (!token) {
        setUser(null); // Limpia el usuario si no hay token
        router.push(`/${lang_route? lang_route : lang}/login`); // Redirige al login si no hay token
        setIsLoadding(false); // Finaliza el estado de carga
      } else {
        // Cargar al usuario si no está cargado
        if (!user) {
          try {
            const res = await fetchUserMe(token, lang);
            if (res.statusCode === 200) {
              console.log("User datafetch ME:", res.data);
              setUser(res.data); // Guarda el usuario en el contexto
            } else {
              setToken(null, false, "es"); // Limpia el token si no fue posible cargar el usuario
              clearToken(); // Limpia el token si no fue posible cargar el usuario
              router.push(`/${lang_route? lang_route : lang}/login`); // Redirige al login si no fue posible cargar el usuario
            }
          } catch (err) {
            console.error(err); // Muestra un error en la consola
            setToken(null, false, "es"); // Limpia el token si no fue posible cargar el usuario
            clearToken(); // Limpia el token si no fue posible cargar el usuario
            router.push(`/${lang_route? lang_route : lang}/login`);
          }
        }

        if (isAuthPath) { // Redirige al perfil si ya hay token y User
          router.push(`/${lang_route? lang_route : lang}/profile`);
        }
        setIsLoadding(false); // Finaliza el estado de carga
      }
    };

    checkToken();
  }, [router]);
};

export default useAuthMiddleware;