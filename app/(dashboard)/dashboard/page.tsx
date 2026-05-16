'use client'

import { useAuth } from '@/lib/auth-context'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Users, CreditCard, TrendingUp, CalendarDays, UserPlus, Package, BarChart3, ClipboardList } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()
  if (!user) return null

  if (user.role === 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-red-950/20">
        <DashboardSidebar />
        <main className="lg:pl-64 pt-[65px] lg:pt-0">
          <div className="p-6 lg:p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Panel de <span className="text-primary">Administración</span></h1>
              <p className="text-muted-foreground mt-1">Bienvenido, {user.name}</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Gestionar Clientes', desc: 'Ver y administrar clientes', icon: <Users className="h-8 w-8 text-primary" />, href: '/dashboard/admin/clientes' },
                { label: 'Membresías', desc: 'Planes y suscripciones', icon: <CreditCard className="h-8 w-8 text-primary" />, href: '/dashboard/admin/membresias' },
                { label: 'Pagos', desc: 'Gestionar transacciones', icon: <TrendingUp className="h-8 w-8 text-primary" />, href: '/dashboard/admin/pagos' },
                { label: 'Productos', desc: 'Inventario y ventas', icon: <Package className="h-8 w-8 text-primary" />, href: '/dashboard/admin/productos' },
                { label: 'Rutinas', desc: 'Planes de entrenamiento', icon: <ClipboardList className="h-8 w-8 text-primary" />, href: '/dashboard/admin/rutinas' },
                { label: 'Asistencia', desc: 'Control de asistencia', icon: <CalendarDays className="h-8 w-8 text-primary" />, href: '/dashboard/admin/asistencia' },
                { label: 'Reportes', desc: 'Análisis y estadísticas', icon: <BarChart3 className="h-8 w-8 text-primary" />, href: '/dashboard/admin/reportes' },
                { label: 'Nuevo Cliente', desc: 'Registrar cliente nuevo', icon: <UserPlus className="h-8 w-8 text-primary" />, href: '/dashboard/admin/clientes' },
              ].map((item) => (
                <Link key={item.href + item.label} href={item.href}>
                  <Card className="hover:border-primary/50 transition-all cursor-pointer h-full bg-card/80 backdrop-blur-sm hover:bg-card">
                    <CardContent className="p-4 flex items-center gap-3">
                      {item.icon}
                      <div>
                        <p className="font-medium text-foreground">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Client / Trainer dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-red-950/20">
      <DashboardSidebar />
      <main className="lg:pl-64 pt-[65px] lg:pt-0">
        <div className="p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Bienvenido, <span className="text-primary">{user.name}</span></h1>
            <p className="text-muted-foreground mt-1 capitalize">{user.role === 'client' ? 'Cliente' : 'Entrenador'}</p>
          </div>
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-foreground">Tu cuenta está activa</CardTitle>
              <CardDescription>Usa el menú lateral para navegar entre las secciones disponibles.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/perfil">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Ver mi perfil</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
