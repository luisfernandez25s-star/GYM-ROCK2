'use client'

import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ClipboardList } from 'lucide-react'

export default function MisRutinasPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <main className="lg:pl-64 pt-[65px] lg:pt-0">
        <div className="p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Mis <span className="text-primary">Rutinas</span></h1>
            <p className="text-muted-foreground">Planes de entrenamiento asignados</p>
          </div>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <ClipboardList className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Sin rutinas asignadas</h3>
              <p className="text-muted-foreground">Tu entrenador asignará rutinas personalizadas para ti pronto.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
