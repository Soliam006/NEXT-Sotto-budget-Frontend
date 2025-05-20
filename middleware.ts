import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const token = request.cookies.get("access_token")?.value;
    const lang = request.cookies.get("lang")?.value;
    const pathname = request.nextUrl.pathname;

    const isLoginPage = pathname.match(/^\/(es|en)\/login$/) !== null;
    const isRegisterPage = pathname.match(/^\/(es|en)\/signup$/) !== null;
    const isDashboardPage = pathname.match(/^\/(es|en)\/dashboard/) !== null;
    const isProfilePage = pathname.match(/^\/(es|en)\/profile/) !== null;


    if (isLoginPage || isRegisterPage) {
        console.log("Middleware---------------------------------------------------  Login or Register page");
        console.log("Middleware--------------------------------------------------- Token: ", token);
        console.log("Middleware--------------------------------------------------- Current path: ", pathname);
        console.log("Middleware--------------------------------------------------- Language: ", lang);
        if (token) {
            const redirectLang = lang ?? "es";
            return NextResponse.redirect(new URL(`/${redirectLang}/dashboard`, request.url));
        }
    } else if (isDashboardPage || isProfilePage) {
        console.log("Middleware--------------------------------------------------- Dashboard or Profile page");
        console.log("Middleware--------------------------------------------------- Token: ", token);
        console.log("Middleware--------------------------------------------------- Current path: ", pathname);
        console.log("Middleware--------------------------------------------------- Language: ", lang);
        if (!token) {
            const redirectLang = lang ?? "es";
            return NextResponse.redirect(new URL(`/${redirectLang}/login`, request.url));
        }
    }

    return NextResponse.next();
}