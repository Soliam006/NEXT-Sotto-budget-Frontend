// app/lib/types/user.types.ts
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
  client?: {
    client_id: number
    budget_limit: number
  }
  worker?: WorkerData
  admin?: AdminData
}
export interface AdminData {
  admin_id: number
  workers: WorkerData[]
}
export interface WorkerData {
  id: number
  name: string
  role: string
  phone: string
  skills: string[]
  availability: string
  contact: string
  projects: string[]
  tasksCompleted: number
  tasksInProgress: number
  efficiency: number
}

export interface User_Search {
    id: number
    name: string
    username: string
    role: UserRole
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'NONE';
    avatar: string // URL to the avatar image
}


