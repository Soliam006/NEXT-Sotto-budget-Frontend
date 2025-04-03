"use client";
import {UserRole} from "@/contexts/user.types";

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
type Lang = 'es' | 'en' | "ca";
type Role = 'admin' | 'client' | 'worker' | 'no_role';

const dictionary: Record<Lang, Record<Role, string>> = {
    "es": {
        admin: 'Gerente de Proyecto Senior',
        client: 'Cliente',
        worker: 'Trabajador',
        no_role: 'Desconocido'
    },
    "en": {
        admin: 'Senior Project Manager',
        client: 'Client',
        worker: 'Worker',
        no_role: 'Unknown'
    },
    "ca": {
        admin: 'Gerent de Projecte Senior',
        client: 'Client',
        worker: 'Treballador',
        no_role: 'Desconegut'
    }
};
export function getRole(role: string, lang: Lang): string {
    switch (role) {
        case 'admin':
            return dictionary[lang].admin;
        case 'client':
            return dictionary[lang].client;
        case 'worker':
            return dictionary[lang].worker;
        default:
            return dictionary[lang].no_role;
    }
}