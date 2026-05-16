// GYMROCK Types

export type UserRole = 'admin' | 'client' | 'trainer'

export interface User {
  id: string
  email: string
  password: string // hashed
  role: UserRole
  name: string
  phone?: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface Client {
  id: string
  userId: string
  membershipId?: string
  trainerId?: string
  birthDate?: string
  address?: string
  emergencyContact?: string
  healthNotes?: string
  status: 'active' | 'inactive' | 'suspended'
  joinDate: string
}

export interface Trainer {
  id: string
  userId: string
  specialties: string[]
  certifications: string[]
  bio?: string
  schedule?: TrainerSchedule[]
  hourlyRate?: number
  photo?: string
  experience?: string
  status: 'active' | 'inactive'
}

export interface CreditCardInfo {
  id: string
  userId: string
  lastFour: string
  brand: string // 'visa' | 'mastercard' | 'amex'
  holderName: string
  expiryMonth: string
  expiryYear: string
  isDefault: boolean
}

export interface TrainerSchedule {
  dayOfWeek: number // 0-6
  startTime: string
  endTime: string
}

export interface MembershipPlan {
  id: string
  name: string
  description: string
  price: number
  duration: number // days
  features: string[]
  isActive: boolean
  maxClients?: number
  includesTrainer: boolean
}

export interface Membership {
  id: string
  clientId: string
  planId: string
  startDate: string
  endDate: string
  status: 'active' | 'expired' | 'cancelled' | 'pending'
  autoRenew: boolean
}

export interface Payment {
  id: string
  clientId: string
  membershipId?: string
  amount: number
  method: 'cash' | 'card' | 'transfer' | 'other'
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  description: string
  date: string
  dueDate?: string
}

export interface Routine {
  id: string
  name: string
  description: string
  trainerId: string
  exercises: Exercise[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number // minutes
  category: string
}

export interface Exercise {
  id: string
  name: string
  sets: number
  reps: string // can be "10-12" or "30 sec"
  rest: number // seconds
  notes?: string
  muscleGroups: string[]
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  image?: string
  isActive: boolean
}

export interface Attendance {
  id: string
  clientId: string
  checkIn: string
  checkOut?: string
  date: string
}

export interface Service {
  id: string
  name: string
  description: string
  icon: string
}

// Auth types
export interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
  phone?: string
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Dashboard stats
export interface DashboardStats {
  totalClients: number
  activeMembers: number
  monthlyRevenue: number
  pendingPayments: number
  newClientsThisMonth: number
  attendanceToday: number
}
