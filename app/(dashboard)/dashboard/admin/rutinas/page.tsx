'use client'

import { useState, useEffect } from 'react'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Plus, ClipboardList, Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface Routine {
  id: string
  name: string
  description: string
  category: string
  difficulty: string
  duration: number
}

export default function AdminRutinasPage() {
  const [routines, setRoutines] = useState<Routine[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newRoutine, setNewRoutine] = useState({ 
    name: '', 
    description: '', 
    category: '', 
    difficulty: 'beginner', 
    duration: '' 
  })

  useEffect(() => {
    loadRoutines()
  }, [])

  const loadRoutines = async () => {
    try {
      const res = await fetch('/api/routines')
      const data = await res.json()
      if (data.success) {
        setRoutines(data.routines || [])
      }
    } catch (error) {
      toast.error('Error al cargar rutinas')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRoutine.name) { 
      toast.error('El nombre es requerido')
      return 
    }
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/routines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newRoutine.name,
          description: newRoutine.description,
          category: newRoutine.category || 'General',
          difficulty: newRoutine.difficulty,
          duration: parseInt(newRoutine.duration) || 45
        })
      })
      const data = await res.json()
      if (data.success) {
        setRoutines(prev => [...prev, data.routine])
        setNewRoutine({ name: '', description: '', category: '', difficulty: 'beginner', duration: '' })
        setIsDialogOpen(false)
        toast.success(`Rutina "${data.routine.name}" creada`)
      } else {
        toast.error(data.error || 'Error al crear rutina')
      }
    } catch {
      toast.error('Error de conexión')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/routines?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setRoutines(prev => prev.filter(r => r.id !== id))
        toast.success('Rutina eliminada')
      }
    } catch {
      toast.error('Error al eliminar')
    }
  }

  const difficultyLabel: Record<string, string> = { beginner: 'Principiante', intermediate: 'Intermedio', advanced: 'Avanzado' }
  const difficultyColor: Record<string, string> = { beginner: 'bg-green-500/10 text-green-500', intermediate: 'bg-yellow-500/10 text-yellow-500', advanced: 'bg-red-500/10 text-red-500' }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-red-950/20">
      <DashboardSidebar />
      <main className="lg:pl-64 pt-[65px] lg:pt-0">
        <div className="p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold">Rutinas</h1>
              <p className="text-muted-foreground">Planes de entrenamiento</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="mr-2 h-4 w-4" />Nueva Rutina</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Crear Rutina</DialogTitle>
                  <DialogDescription>Define una nueva rutina de entrenamiento</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAdd} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nombre *</Label>
                    <Input placeholder="Full Body Principiante" value={newRoutine.name}
                      onChange={(e) => setNewRoutine(p => ({ ...p, name: e.target.value }))} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Descripción</Label>
                    <Textarea placeholder="Descripción de la rutina" value={newRoutine.description}
                      onChange={(e) => setNewRoutine(p => ({ ...p, description: e.target.value }))} rows={3} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Categoría</Label>
                      <Input placeholder="Full Body, Upper..." value={newRoutine.category}
                        onChange={(e) => setNewRoutine(p => ({ ...p, category: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Duración (min)</Label>
                      <Input type="number" placeholder="45" value={newRoutine.duration}
                        onChange={(e) => setNewRoutine(p => ({ ...p, duration: e.target.value }))} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Dificultad</Label>
                    <Select value={newRoutine.difficulty} onValueChange={(v) => setNewRoutine(p => ({ ...p, difficulty: v }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Principiante</SelectItem>
                        <SelectItem value="intermediate">Intermedio</SelectItem>
                        <SelectItem value="advanced">Avanzado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creando...</> : 'Crear Rutina'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Rutinas Disponibles</CardTitle>
              <CardDescription>{isLoading ? 'Cargando...' : `${routines.length} rutinas creadas`}</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : routines.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <ClipboardList className="h-16 w-16 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Sin rutinas</h3>
                  <p className="text-muted-foreground mb-4">Crea rutinas de entrenamiento para asignarlas a tus clientes</p>
                  <Button onClick={() => setIsDialogOpen(true)}><Plus className="mr-2 h-4 w-4" />Crear primera rutina</Button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {routines.map((routine) => (
                    <Card key={routine.id} className="border-border hover:border-primary/30 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium">{routine.name}</h3>
                          <Badge className={difficultyColor[routine.difficulty] || ''}>
                            {difficultyLabel[routine.difficulty] || routine.difficulty}
                          </Badge>
                        </div>
                        {routine.description && <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{routine.description}</p>}
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <Badge variant="outline">{routine.category}</Badge>
                            <Badge variant="outline">{routine.duration} min</Badge>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleDelete(routine.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
