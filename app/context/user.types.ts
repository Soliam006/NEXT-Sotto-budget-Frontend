// app/context/user.types.ts
export type UserRole = 'ADMIN' | 'CLIENT' | 'WORKER';
export type Language = 'es' | 'en' | 'ca';

export interface Availability {
  id?: string // Para identificación local
  from: string // ISO 8601 e.g. '2025-03-20T10:00:00Z'
  to: string
}

export interface User {
  id: number
  name?: string
  username: string
  phone?: string
  email: string
  language_preference: Language
  location?: string
  role: UserRole
  description?: string
  created_at?: string // ISO 8601 e.g. '2025-03-20T10:00:00Z'
  availabilities?: Availability[]
}