// GYMROCK Data Store - With demo trainers
import type { 
  User, Client, Trainer, MembershipPlan, Membership, 
  Payment, Routine, Product, Attendance, Service, CreditCardInfo 
} from './types'

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 15)

// Generate a generic password for new trainers
export function generateGenericPassword(name: string): string {
  const clean = name.replace(/\s+/g, '').slice(0, 6)
  return `${clean}GR2024!`
}

// Services offered
export const services: Service[] = [
  { id: '1', name: 'Musculacion', description: 'Entrenamiento de fuerza con equipos de ultima generacion', icon: 'dumbbell' },
  { id: '2', name: 'Cardio', description: 'Amplia zona de cardio con cintas, bicicletas y elipticas', icon: 'heart-pulse' },
  { id: '3', name: 'Clases Grupales', description: 'Spinning, yoga, pilates, zumba y mas', icon: 'users' },
  { id: '4', name: 'Entrenamiento Personal', description: 'Sesiones one-on-one con entrenadores certificados', icon: 'user-check' },
  { id: '5', name: 'Nutricion', description: 'Asesoramiento nutricional personalizado', icon: 'apple' },
  { id: '6', name: 'Vestuarios Premium', description: 'Duchas, taquillas y amenities de primera clase', icon: 'sparkles' }
]

// Membership Plans (Precios en Pesos Mexicanos)
export const membershipPlans: MembershipPlan[] = [
  {
    id: '1',
    name: 'Pase Diario',
    description: 'Acceso por un dia completo al gimnasio',
    price: 120,
    duration: 1,
    features: [
      'Acceso al gimnasio por 1 dia',
      'Zona de musculacion',
      'Zona de cardio',
      'Vestuarios',
      'Ideal para visitantes'
    ],
    isActive: true,
    includesTrainer: false
  },
  {
    id: '2',
    name: 'Membresia Semanal',
    description: 'Acceso completo por 7 dias',
    price: 350,
    duration: 7,
    features: [
      'Acceso ilimitado por 7 dias',
      'Zona de musculacion',
      'Zona de cardio',
      'Vestuarios',
      'Perfecto para probar el gym'
    ],
    isActive: true,
    includesTrainer: false
  },
  {
    id: '3',
    name: 'Membresia Quincenal',
    description: 'Acceso completo por 15 dias',
    price: 600,
    duration: 15,
    features: [
      'Acceso ilimitado por 15 dias',
      'Zona de musculacion',
      'Zona de cardio',
      'Vestuarios',
      '1 clase grupal incluida'
    ],
    isActive: true,
    includesTrainer: false
  },
  {
    id: '4',
    name: 'Membresia Mensual',
    description: 'Plan mensual con acceso completo',
    price: 999,
    duration: 30,
    features: [
      'Acceso ilimitado por 30 dias',
      'Zona de musculacion',
      'Zona de cardio',
      'Vestuarios',
      'Clases grupales ilimitadas',
      '2 pases de invitado'
    ],
    isActive: true,
    includesTrainer: false
  },
  {
    id: '5',
    name: 'Membresia Trimestral',
    description: 'Plan de 3 meses con descuento',
    price: 2500,
    duration: 90,
    features: [
      'Acceso ilimitado por 3 meses',
      'Zona de musculacion',
      'Zona de cardio',
      'Vestuarios',
      'Clases grupales ilimitadas',
      '5 pases de invitado',
      '10% descuento en productos',
      '1 sesion con entrenador personal'
    ],
    isActive: true,
    includesTrainer: false
  },
  {
    id: '6',
    name: 'Membresia Semestral',
    description: 'Plan de 6 meses - Mejor valor',
    price: 4500,
    duration: 180,
    features: [
      'Acceso ilimitado por 6 meses',
      'Zona de musculacion',
      'Zona de cardio',
      'Vestuarios',
      'Clases grupales ilimitadas',
      '10 pases de invitado',
      '15% descuento en productos',
      '3 sesiones con entrenador personal',
      'Acceso a nutriologo (1 consulta)'
    ],
    isActive: true,
    includesTrainer: true
  },
  {
    id: '7',
    name: 'Membresia Anual Bronce',
    description: 'Acceso basico anual con 5 pases de invitado',
    price: 7000,
    duration: 365,
    features: [
      'Acceso ilimitado al gimnasio',
      'Zona de musculacion',
      'Zona de cardio',
      'Vestuarios',
      '5 pases de invitado anual',
      'Clases grupales ilimitadas',
      '15% descuento en productos',
      'Vigencia de 1 ano'
    ],
    isActive: true,
    includesTrainer: false
  },
  {
    id: '8',
    name: 'Membresia Anual Plata',
    description: 'Plan anual mejorado con 18 pases de invitado y descuentos',
    price: 9500,
    duration: 365,
    features: [
      'Todo de Membresia Bronce',
      '18 pases de invitado anual',
      '10% descuento en locker chico anual',
      '10% descuento en entrenamientos personalizados (primera compra)',
      'Incluye ALPHA ONE ON ONE 10 sesiones',
      'Programas deportivos GRIT o TRAINT',
      'Acceso a nutriologo (2 consultas)',
      '20% descuento en productos'
    ],
    isActive: true,
    includesTrainer: true
  },
  {
    id: '9',
    name: 'Membresia Anual Oro',
    description: 'Plan premium anual con 30 pases y maximos beneficios',
    price: 14000,
    duration: 365,
    features: [
      'Todo de Membresia Plata',
      '30 pases de invitado anual',
      '20% descuento en locker chico anual',
      '20% descuento en entrenamientos personalizados (primera compra)',
      'ALPHA ONE ON ONE, COUPLE o SMALL GROUP (5, 10 o 20 sesiones)',
      'Programas deportivos GRIT o TRAINT con maximas opciones',
      'Acceso ilimitado a nutriologo',
      '30% descuento en productos',
      'Locker premium incluido',
      'Vigencia de 2 anos para beneficios en planes multiclub'
    ],
    isActive: true,
    includesTrainer: true
  },
  {
    id: '10',
    name: 'Membresia Promocional',
    description: 'Precio especial por tiempo limitado',
    price: 5500,
    duration: 365,
    features: [
      'Acceso ilimitado al gimnasio',
      'Zona de musculacion',
      'Zona de cardio',
      'Vestuarios',
      'Clases grupales ilimitadas',
      'Cantidad limitada - solo en ciertos periodos',
      'Vigencia de 1 ano'
    ],
    isActive: true,
    includesTrainer: false
  }
]

// Demo users for testing - all roles included
export const mockUsers: User[] = [
  {
    id: 'admin-1',
    email: 'admin@gymrock.com',
    password: 'Admin123!',
    role: 'admin',
    name: 'Admin GYMROCK',
    phone: '+52 55 1234 5678',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'user-1',
    email: 'usuario@gymrock.com',
    password: 'Usuario123!',
    role: 'client',
    name: 'Usuario Demo',
    phone: '+52 55 2345 6789',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'trainer-carlos',
    email: 'carlos@gymrock.com',
    password: 'CarlosGR2024!',
    role: 'trainer',
    name: 'Carlos Martinez',
    phone: '+52 55 3456 7890',
    avatar: '/images/trainer-carlos.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'trainer-maria',
    email: 'maria@gymrock.com',
    password: 'MariaGR2024!',
    role: 'trainer',
    name: 'Maria Lopez',
    phone: '+52 55 4567 8901',
    avatar: '/images/trainer-maria.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'trainer-diego',
    email: 'diego@gymrock.com',
    password: 'DiegoGR2024!',
    role: 'trainer',
    name: 'Diego Ramirez',
    phone: '+52 55 5678 9012',
    avatar: '/images/trainer-diego.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

// Demo trainer profiles
const initialTrainers: Trainer[] = [
  {
    id: 'tp-carlos',
    userId: 'trainer-carlos',
    specialties: ['Musculacion', 'Fuerza', 'Hipertrofia', 'Powerlifting'],
    certifications: ['NSCA-CPT', 'ACE Certified', 'CrossFit Level 2'],
    bio: 'Entrenador certificado con 8 anos de experiencia en fuerza e hipertrofia. Especialista en transformaciones corporales y competencias de powerlifting.',
    experience: '8 anos',
    photo: '/images/trainer-carlos.jpg',
    hourlyRate: 350,
    status: 'active'
  },
  {
    id: 'tp-maria',
    userId: 'trainer-maria',
    specialties: ['Yoga', 'Pilates', 'Cardio HIIT', 'Flexibilidad'],
    certifications: ['NASM-CPT', 'Yoga Alliance RYT-200', 'TRX Certified'],
    bio: 'Instructora de yoga y fitness funcional. Apasionada por el bienestar integral, combina entrenamiento de alta intensidad con tecnicas de mindfulness.',
    experience: '6 anos',
    photo: '/images/trainer-maria.jpg',
    hourlyRate: 300,
    status: 'active'
  },
  {
    id: 'tp-diego',
    userId: 'trainer-diego',
    specialties: ['CrossFit', 'Funcional', 'Acondicionamiento', 'Resistencia'],
    certifications: ['CrossFit Level 3', 'ISSA Certified', 'First Aid/CPR'],
    bio: 'Coach de CrossFit y acondicionamiento fisico. Competidor activo y preparador de atletas para competencias nacionales e internacionales.',
    experience: '10 anos',
    photo: '/images/trainer-diego.jpg',
    hourlyRate: 400,
    status: 'active'
  }
]

// Data store with in-memory persistence (server-side)
const store = {
  users: [...mockUsers] as User[],
  clients: [] as Client[],
  trainers: [...initialTrainers] as Trainer[],
  memberships: [] as Membership[],
  payments: [] as Payment[],
  routines: [] as Routine[],
  products: [] as Product[],
  attendance: [] as Attendance[],
  membershipPlans: [...membershipPlans] as MembershipPlan[],
  services: [...services] as Service[],
  creditCards: [] as CreditCardInfo[]
}

export class DataStore {
  // Users
  getUsers() { return store.users }
  getUserById(id: string) { return store.users.find(u => u.id === id) }
  getUserByEmail(email: string) { return store.users.find(u => u.email.toLowerCase() === email.toLowerCase()) }
  
  addUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
    const newUser: User = {
      ...user,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    store.users.push(newUser)
    return newUser
  }
  
  updateUser(id: string, updates: Partial<User>) {
    const index = store.users.findIndex(u => u.id === id)
    if (index !== -1) {
      store.users[index] = { ...store.users[index], ...updates, updatedAt: new Date().toISOString() }
      return store.users[index]
    }
    return null
  }
  
  deleteUser(id: string) {
    store.users = store.users.filter(u => u.id !== id)
  }

  // Clients
  getClients() { return store.clients }
  getClientById(id: string) { return store.clients.find(c => c.id === id) }
  getClientByUserId(userId: string) { return store.clients.find(c => c.userId === userId) }
  
  addClient(client: Omit<Client, 'id'>) {
    const newClient: Client = { ...client, id: generateId() }
    store.clients.push(newClient)
    return newClient
  }
  
  updateClient(id: string, updates: Partial<Client>) {
    const index = store.clients.findIndex(c => c.id === id)
    if (index !== -1) {
      store.clients[index] = { ...store.clients[index], ...updates }
      return store.clients[index]
    }
    return null
  }
  
  deleteClient(id: string) {
    store.clients = store.clients.filter(c => c.id !== id)
  }

  // Trainers
  getTrainers() { return store.trainers }
  getTrainerById(id: string) { return store.trainers.find(t => t.id === id) }
  getTrainerByUserId(userId: string) { return store.trainers.find(t => t.userId === userId) }
  
  addTrainer(trainer: Omit<Trainer, 'id'>) {
    const newTrainer: Trainer = { ...trainer, id: generateId() }
    store.trainers.push(newTrainer)
    return newTrainer
  }

  updateTrainer(id: string, updates: Partial<Trainer>) {
    const index = store.trainers.findIndex(t => t.id === id)
    if (index !== -1) {
      store.trainers[index] = { ...store.trainers[index], ...updates }
      return store.trainers[index]
    }
    return null
  }

  // Membership Plans
  getMembershipPlans() { return store.membershipPlans }
  getPlanById(id: string) { return store.membershipPlans.find(p => p.id === id) }
  
  addMembershipPlan(plan: Omit<MembershipPlan, 'id'>) {
    const newPlan: MembershipPlan = { ...plan, id: generateId() }
    store.membershipPlans.push(newPlan)
    return newPlan
  }

  updateMembershipPlan(id: string, updates: Partial<MembershipPlan>) {
    const index = store.membershipPlans.findIndex(p => p.id === id)
    if (index !== -1) {
      store.membershipPlans[index] = { ...store.membershipPlans[index], ...updates }
      return store.membershipPlans[index]
    }
    return null
  }

  deleteMembershipPlan(id: string) {
    store.membershipPlans = store.membershipPlans.filter(p => p.id !== id)
  }

  // Memberships
  getMemberships() { return store.memberships }
  getMembershipById(id: string) { return store.memberships.find(m => m.id === id) }
  getMembershipByClientId(clientId: string) { return store.memberships.find(m => m.clientId === clientId) }
  
  addMembership(membership: Omit<Membership, 'id'>) {
    const newMembership: Membership = { ...membership, id: generateId() }
    store.memberships.push(newMembership)
    return newMembership
  }
  
  updateMembership(id: string, updates: Partial<Membership>) {
    const index = store.memberships.findIndex(m => m.id === id)
    if (index !== -1) {
      store.memberships[index] = { ...store.memberships[index], ...updates }
      return store.memberships[index]
    }
    return null
  }

  // Payments
  getPayments() { return store.payments }
  getPaymentsByClientId(clientId: string) { return store.payments.filter(p => p.clientId === clientId) }
  
  addPayment(payment: Omit<Payment, 'id'>) {
    const newPayment: Payment = { ...payment, id: generateId() }
    store.payments.push(newPayment)
    return newPayment
  }

  // Routines
  getRoutines() { return store.routines }
  getRoutineById(id: string) { return store.routines.find(r => r.id === id) }
  
  addRoutine(routine: Omit<Routine, 'id'>) {
    const newRoutine: Routine = { ...routine, id: generateId() }
    store.routines.push(newRoutine)
    return newRoutine
  }
  
  deleteRoutine(id: string) {
    store.routines = store.routines.filter(r => r.id !== id)
  }

  // Products
  getProducts() { return store.products }
  getProductById(id: string) { return store.products.find(p => p.id === id) }
  
  addProduct(product: Omit<Product, 'id'>) {
    const newProduct: Product = { ...product, id: generateId() }
    store.products.push(newProduct)
    return newProduct
  }
  
  updateProduct(id: string, updates: Partial<Product>) {
    const index = store.products.findIndex(p => p.id === id)
    if (index !== -1) {
      store.products[index] = { ...store.products[index], ...updates }
      return store.products[index]
    }
    return null
  }
  
  deleteProduct(id: string) {
    store.products = store.products.filter(p => p.id !== id)
  }

  // Attendance
  getAttendance() { return store.attendance }
  getAttendanceByClientId(clientId: string) { return store.attendance.filter(a => a.clientId === clientId) }
  
  addAttendance(attendance: Omit<Attendance, 'id'>) {
    const newAttendance: Attendance = { ...attendance, id: generateId() }
    store.attendance.push(newAttendance)
    return newAttendance
  }

  // Services
  getServices() { return store.services }

  // Credit Cards
  getCreditCards() { return store.creditCards }
  getCreditCardsByUserId(userId: string) { return store.creditCards.filter(c => c.userId === userId) }
  
  addCreditCard(card: Omit<CreditCardInfo, 'id'>) {
    // If setting as default, unset all other defaults for this user
    if (card.isDefault) {
      store.creditCards.forEach(c => {
        if (c.userId === card.userId) c.isDefault = false
      })
    }
    const newCard: CreditCardInfo = { ...card, id: generateId() }
    store.creditCards.push(newCard)
    return newCard
  }

  deleteCreditCard(id: string) {
    store.creditCards = store.creditCards.filter(c => c.id !== id)
  }

  // Get full client list with user info merged
  getClientsWithUsers() {
    return store.clients.map(client => {
      const user = store.users.find(u => u.id === client.userId)
      const membership = store.memberships.find(m => m.clientId === client.id)
      const plan = membership ? store.membershipPlans.find(p => p.id === membership.planId) : null
      return {
        ...client,
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        plan: plan?.name || 'Sin plan'
      }
    })
  }
}

// Singleton instance
let dataStore: DataStore | null = null

export function getDataStore(): DataStore {
  if (!dataStore) {
    dataStore = new DataStore()
  }
  return dataStore
}
