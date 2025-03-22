// app/context/user.types.ts
export type UserRole = 'ADMIN' | 'CLIENT' | 'WORKER';
export type Language = 'es' | 'en' | 'ca';

export interface Availability {
  from: string; // ISO 8601 e.g. '2025-03-20T10:00:00Z'
  to: string;
}

export interface User {
  name: string;
  username: string;
  phone: string;
  email: string;
  language_preference: Language;
  role: UserRole;
  description?: string;
  availabilities: Availability[];
}
