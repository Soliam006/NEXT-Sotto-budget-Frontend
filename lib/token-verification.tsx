import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {clearToken, getLang, getToken} from "@/app/services/auth-service";
import {useUser} from "@/app/context/UserProvider";
import {fetchUserMe} from "@/app/actions/auth";


const useAuthMiddleware = (isAuthPath:boolean) => {

  const router = useRouter();
  const {user, setUser} = useUser();

  useEffect(() => {

    console.log('Checking token');
    const token = getToken();
    const lang = getLang() || 'es';
    console.log('Token:', token, "Lang:", lang);
    if (!token) {
      setUser(null); // Limpia el usuario si no hay token
      router.push(`/${lang}/login`); // Redirige al login si no hay token
    } else{
      // Cargar al usuario si no está cargado
      if(!user){
        fetchUserMe(token, lang).then((res) => {
          if (res.statusCode === 200) {
            setUser(res.data); // Guarda el usuario en el contexto
          }else {
            clearToken(); // Limpia el token si no fue posible cargar el usuario
            router.push(`/${lang}/login`); // Redirige al login si no fue posible cargar el usuario
          }
        }).catch((err) => {
          console.error(err); // Muestra un error en la consola
          clearToken(); // Limpia el token si no fue posible cargar el usuario
          router.push(`/${lang}/login`);
        });
      }

      if(isAuthPath) { // Redirige al perfil si ya hay token y User
        router.push(`/${lang}/profile`);
      }
    }
  }, [router]);
};

export default useAuthMiddleware;