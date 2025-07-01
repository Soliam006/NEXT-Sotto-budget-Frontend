import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const token = request.cookies.get("access_token")?.value;
    const lang = request.cookies.get("lang")?.value || 'es'; // Valor por defecto si no se encuentra el cookie
    const pathname = request.nextUrl.pathname;
    // Revisar si es una ruta de Next.js o una API
    if (pathname.includes('/_next/') || pathname.includes('/api/') || pathname.match(/\.(jpg|jpeg|png|svg|ico|webp|css|js|woff2?)$/)) {
        return NextResponse.next();
    }

    // Verifica si la ruta existe
    const isExistingRoute = checkIfRouteExists(pathname); // Implementa esta función

    if (!isExistingRoute) {
        return NextResponse.rewrite(new URL(`/${lang}/404`, request.url));
    }

    // Resto de tu lógica actual...
    const isLoginPage = pathname.match(/^\/(es|en|ca)\/(login|signup)$/) !== null;
    const isProtectedPage = pathname.match(/^\/(es|en|ca)\/(dashboard|profile)/) !== null;

    if (isLoginPage && token) {
        return NextResponse.redirect(new URL(`/${lang}/dashboard`, request.url));
    }

    if (isProtectedPage && !token) {
        return NextResponse.redirect(new URL(`/${lang}/login`, request.url));
    }

    return NextResponse.next();
}

// Función auxiliar para verificar rutas existentes
function checkIfRouteExists(pathname: string): boolean {
    const validRoutes = [
        /^\/(es|en|ca)\/login$/,
        /^\/(es|en|ca)\/signup$/,
        /^\/(es|en|ca)\/dashboard(\/.*)?$/,
        /^\/(es|en|ca)\/profile(\/.*)?$/,
        /^\/(es|en|ca)\/404$/
    ];

    return validRoutes.some(regex => regex.test(pathname));
}