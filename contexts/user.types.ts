// app/context/user.types.ts
export type UserRole = 'admin' | 'client' | 'worker';
export type Language = 'es' | 'en' | 'ca';

export interface Availability {
  id?: string // Para identificación local
  from: string // ISO 8601 e.g. '2025-03-20T10:00:00Z'
  to: string
}

export interface UserFollower {
  id: number
  name: string
  username: string
  role: string
  avatar?: string
  isFollowing: boolean
}

export interface User {
  id: number
  name: string
  username: string
  phone?: string
  email: string
  language_preference: Language
  location?: string
  role: UserRole
  status?: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'NONE';
  description?: string
  avatar?: string // URL to the avatar image
  created_at?: string // ISO 8601 e.g. '2025-03-20T10:00:00Z'
  availabilities?: Availability[]
  followers?: UserFollower[]
  following?: UserFollower[]
  requests?: UserFollower[]
}

export interface User_Search {
    id: number
    name: string
    username: string
    role: UserRole
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'NONE';
    avatar: string // URL to the avatar image
}


