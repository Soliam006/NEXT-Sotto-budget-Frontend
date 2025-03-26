"use client";
export function setToken(token: string, rememberMe: boolean, lang:string): void {
    if (typeof window !== 'undefined') {
        console.log('Setting token:', token);
        if (rememberMe) {
            window.localStorage.setItem('access_token', token);
            window.localStorage.setItem('lang', lang);
        } else {
            window.sessionStorage.setItem('access_token', token);
            window.sessionStorage.setItem('lang', lang);
        }
    }
    console.log('Token set');
}

export function getToken(): string | null {
    if (typeof window !== 'undefined') {
        return window.sessionStorage.getItem('access_token') || window.localStorage.getItem('access_token');
    }
    return null;
}

export function getLang(): string | null {
    if (typeof window !== 'undefined') {
        return window.sessionStorage.getItem('lang') || window.localStorage.getItem('lang');
    }
    return null;
}

export function clearToken(): void {
    if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem('access_token');
        window.localStorage.removeItem('access_token');
    }
}