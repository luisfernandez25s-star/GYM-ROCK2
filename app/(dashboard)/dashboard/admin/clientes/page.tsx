'use client'

import { useState, useEffect } from 'react'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  Plus, 
  UserPlus,
  Users,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react'
import { toast } from 'sonner'
import { formatMXN } from '@/lib/utils'

interface MembershipPlan {
  id: string
  name: string
  price: number
  duration: number
  isActive: boolean
}

interface ClientRecord {
  id: string
  userId: string
  name: string
  email: string
  phone: string
  plan: string
  status: 'active' | 'inactive' | 'suspended'
  joinDate: string
}

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientRecord[]>([])
  const [plans, setPlans] = useState<MembershipPlan[]>([])
  const [planFilter, setPlanFilter] = useState<'all' | 'monthly' | 'annual'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Form state
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    plan: ''
  })

  useEffect(() => {
    loadClients()
    loadPlans()
  }, [])

  const loadPlans = async () => {
    try {
      const res = await fetch('/api/membership-plans')
      const data = await res.json()
      if (data.success) {
        setPlans(data.plans.filter((p: MembershipPlan) => p.isActive))
      }
    } catch {
      console.error('Error loading plans')
    }
  }

  const loadClients = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/clients')
      const data = await res.json()
      if (data.success) {
        setClients(data.clients)
      }
    } catch (error) {
      toast.error('Error al cargar clientes')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newClient.name || !newClient.email || !newClient.password) {
      toast.error('Por favor completa los campos requeridos')
      return
    }
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient)
      })
      const data = await res.json()
      if (data.success) {
        setClients(prev => [...prev, data.client])
        setNewClient({ name: '', email: '', phone: '', password: '', plan: '' })
        setIsAddDialogOpen(false)
        toast.success(`Cliente ${data.client.name} agregado exitosamente`)
      } else {
        toast.error(data.error || 'Error al agregar cliente')
      }
    } catch {
      toast.error('Error de conexión')
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Activo</Badge>
      case 'inactive':
        return <Badge variant="secondary">Inactivo</Badge>
      case 'suspended':
        return <Badge variant="destructive">Suspendido</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      
      <main className="lg:pl-64 pt-[65px] lg:pt-0">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold">Clientes</h1>
              <p className="text-muted-foreground">Gestiona los clientes del gimnasio</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={(open) => { setIsAddDialogOpen(open); if (open) setPlanFilter('all') }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Cliente
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
                  <DialogDescription>Ingresa los datos del nuevo cliente</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddClient} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo *</Label>
                    <Input
                      id="name"
                      placeholder="Nombre Completo"
                      value={newClient.name}
                      onChange={(e) => setNewClient(p => ({ ...p, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="juan@example.com"
                      value={newClient.email}
                      onChange={(e) => setNewClient(p => ({ ...p, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      placeholder="+52 55 0000 0000"
                      value={newClient.phone}
                      onChange={(e) => setNewClient(p => ({ ...p, phone: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={newClient.password}
                        onChange={(e) => setNewClient(p => ({ ...p, password: e.target.value }))}
                        required
                        className="pr-10"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="plan">Plan de membresia</Label>
                    <Tabs value={planFilter} onValueChange={(v) => { setPlanFilter(v as 'all' | 'monthly' | 'annual'); setNewClient(p => ({ ...p, plan: '' })) }}>
                      <TabsList className="w-full mb-2">
                        <TabsTrigger value="all" className="flex-1 text-xs">Todos</TabsTrigger>
                        <TabsTrigger value="monthly" className="flex-1 text-xs">Mensual / Corto</TabsTrigger>
                        <TabsTrigger value="annual" className="flex-1 text-xs">Anual</TabsTrigger>
                      </TabsList>
                    </Tabs>
                    <Select value={newClient.plan} onValueChange={(v) => setNewClient(p => ({ ...p, plan: v }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar plan (opcional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {plans
                          .filter(plan => {
                            if (planFilter === 'monthly') return plan.duration < 365
                            if (planFilter === 'annual') return plan.duration >= 365
                            return true
                          })
                          .map((plan) => (
                            <SelectItem key={plan.id} value={plan.id}>
                              {plan.name} - {formatMXN(plan.price)} / {plan.duration >= 365 ? 'anual' : plan.duration >= 30 ? `${Math.round(plan.duration / 30)} mes(es)` : `${plan.duration} dias`}
                            </SelectItem>
                          ))}
                        {plans.filter(plan => {
                          if (planFilter === 'monthly') return plan.duration < 365
                          if (planFilter === 'annual') return plan.duration >= 365
                          return true
                        }).length === 0 && (
                          <div className="px-2 py-4 text-sm text-muted-foreground text-center">No hay planes en esta categoria</div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Agregando...</>
                      ) : (
                        <><UserPlus className="mr-2 h-4 w-4" />Agregar Cliente</>
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Clients Table */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Clientes</CardTitle>
              <CardDescription>
                {isLoading ? 'Cargando...' : `${filteredClients.length} clientes encontrados`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : clients.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Users className="h-16 w-16 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay clientes aún</h3>
                  <p className="text-muted-foreground mb-4">Agrega tu primer cliente haciendo clic en el botón &quot;Nuevo Cliente&quot;</p>
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar primer cliente
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Teléfono</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Fecha Alta</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredClients.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                  {client.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{client.name}</p>
                                <p className="text-sm text-muted-foreground">{client.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{client.phone || <span className="text-muted-foreground">—</span>}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{client.plan}</Badge>
                          </TableCell>
                          <TableCell>{getStatusBadge(client.status)}</TableCell>
                          <TableCell>{client.joinDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
