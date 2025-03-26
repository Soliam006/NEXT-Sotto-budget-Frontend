"use client";
export function setToken(token: string, rememberMe: boolean): void {
    if (typeof window !== 'undefined') {
        console.log('Setting token:', token);
        if (rememberMe) {
            window.localStorage.setItem('access_token', token);
        } else
            window.sessionStorage.setItem('access_token', token);
    }
}

export function getToken(): string | null {
    if (typeof window !== 'undefined') {
        return window.sessionStorage.getItem('access_token') || window.localStorage.getItem('access_token');
    }
    return null;
}

export function clearToken(): void {
    if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem('access_token');
        window.localStorage.removeItem('access_token');
    }
}