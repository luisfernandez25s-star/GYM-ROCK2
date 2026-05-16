'use client'

import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { formatMXN } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { TrendingUp, Users, CreditCard, CalendarDays, Download, BarChart3 } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts'

const monthlyRevenue = [
  { month: 'Ene', revenue: 0 }, { month: 'Feb', revenue: 0 }, { month: 'Mar', revenue: 0 },
  { month: 'Abr', revenue: 0 }, { month: 'May', revenue: 0 }, { month: 'Jun', revenue: 0 },
]

const attendanceData = [
  { day: 'Lun', attendance: 0 }, { day: 'Mar', attendance: 0 }, { day: 'Mie', attendance: 0 },
  { day: 'Jue', attendance: 0 }, { day: 'Vie', attendance: 0 }, { day: 'Sab', attendance: 0 }, { day: 'Dom', attendance: 0 },
]

const planDistribution = [
  { name: 'Basico', value: 33, color: '#DC2626' },
  { name: 'Premium', value: 34, color: '#EF4444' },
  { name: 'VIP', value: 33, color: '#F87171' },
]

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <main className="lg:pl-64 pt-[65px] lg:pt-0">
        <div className="p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold">Reportes</h1>
              <p className="text-muted-foreground">Análisis y estadísticas del gimnasio</p>
            </div>
            <div className="flex items-center gap-3">
              <Select defaultValue="6months">
                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Período" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="30days">Últimos 30 días</SelectItem>
                  <SelectItem value="3months">Últimos 3 meses</SelectItem>
                  <SelectItem value="6months">Últimos 6 meses</SelectItem>
                  <SelectItem value="year">Este año</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline"><Download className="mr-2 h-4 w-4" />Exportar</Button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Ingresos Totales', value: formatMXN(0), icon: <TrendingUp className="h-8 w-8 text-primary/20" /> },
              { label: 'Nuevos Miembros', value: '0', icon: <Users className="h-8 w-8 text-primary/20" /> },
              { label: 'Tasa de Retención', value: '—', icon: <CreditCard className="h-8 w-8 text-primary/20" /> },
              { label: 'Asistencia Media', value: '—', icon: <CalendarDays className="h-8 w-8 text-primary/20" /> },
            ].map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    {stat.icon}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Ingresos Mensuales</CardTitle>
                <CardDescription>Evolución de ingresos (datos iniciales en 0)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                        formatter={(value) => [formatMXN(value as number), 'Ingresos']}
                      />
                      <Bar dataKey="revenue" fill="#DC2626" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Asistencia Semanal</CardTitle>
                <CardDescription>Promedio de asistencia por día</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={attendanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                        formatter={(value) => [value, 'Asistencias']}
                      />
                      <Bar dataKey="attendance" fill="#EF4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Distribución de Planes</CardTitle>
              <CardDescription>Porcentaje de miembros por tipo de plan (estimado)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <BarChart3 className="h-24 w-24 text-muted-foreground/20" />
                  <p className="text-muted-foreground">Los datos aparecerán aquí cuando haya clientes registrados</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
