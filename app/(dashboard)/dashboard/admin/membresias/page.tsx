'use client'

import { useState, useEffect } from 'react'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { formatMXN } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Check, Loader2, CreditCard, Users, Star, Crown, Calendar, Clock, Zap, Shield, Search, Plus, Pencil, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'

interface Plan {
  id: string
  name: string
  description: string
  price: number
  duration: number
  features: string[]
  isActive: boolean
  includesTrainer: boolean
}

const emptyPlan = {
  name: '',
  description: '',
  price: 0,
  duration: 30,
  features: [] as string[],
  isActive: true,
  includesTrainer: false,
}

function getDurationLabel(duration: number): string {
  if (duration === 1) return '1 dia'
  if (duration === 7) return '1 semana'
  if (duration === 15) return '15 dias'
  if (duration === 30) return '1 mes'
  if (duration === 90) return '3 meses'
  if (duration === 180) return '6 meses'
  if (duration === 365) return '1 ano'
  return `${duration} dias`
}

const planIcons: Record<string, typeof Star> = {
  'Pase Diario': Zap,
  'Membresia Semanal': Clock,
  'Membresia Quincenal': Calendar,
  'Membresia Mensual': Calendar,
  'Membresia Trimestral': Star,
  'Membresia Semestral': Star,
  'Membresia Anual Bronce': Shield,
  'Membresia Anual Plata': Star,
  'Membresia Anual Oro': Crown,
  'Membresia Promocional': Zap,
}

export default function AdminMembresiasPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [deletingPlan, setDeletingPlan] = useState<Plan | null>(null)
  const [formData, setFormData] = useState(emptyPlan)
  const [newFeature, setNewFeature] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadPlans()
  }, [])

  const loadPlans = async () => {
    try {
      const res = await fetch('/api/membership-plans')
      const data = await res.json()
      if (data.success) {
        setPlans(data.plans || [])
      }
    } catch {
      toast.error('Error al cargar planes')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenCreate = () => {
    setEditingPlan(null)
    setFormData(emptyPlan)
    setNewFeature('')
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (plan: Plan) => {
    setEditingPlan(plan)
    setFormData({
      name: plan.name,
      description: plan.description,
      price: plan.price,
      duration: plan.duration,
      features: [...plan.features],
      isActive: plan.isActive,
      includesTrainer: plan.includesTrainer,
    })
    setNewFeature('')
    setIsDialogOpen(true)
  }

  const handleOpenDelete = (plan: Plan) => {
    setDeletingPlan(plan)
    setIsDeleteDialogOpen(true)
  }

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({ ...prev, features: [...prev.features, newFeature.trim()] }))
      setNewFeature('')
    }
  }

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }))
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('El nombre es requerido')
      return
    }
    if (!formData.description.trim()) {
      toast.error('La descripcion es requerida')
      return
    }
    if (formData.price <= 0) {
      toast.error('El precio debe ser mayor a 0')
      return
    }

    setIsSaving(true)
    try {
      if (editingPlan) {
        const res = await fetch(`/api/membership-plans/${editingPlan.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
        const data = await res.json()
        if (data.success) {
          toast.success('Plan actualizado correctamente')
          setIsDialogOpen(false)
          loadPlans()
        } else {
          toast.error(data.error || 'Error al actualizar')
        }
      } else {
        const res = await fetch('/api/membership-plans', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
        const data = await res.json()
        if (data.success) {
          toast.success('Plan creado correctamente')
          setIsDialogOpen(false)
          loadPlans()
        } else {
          toast.error(data.error || 'Error al crear plan')
        }
      }
    } catch {
      toast.error('Error de conexion')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingPlan) return
    setIsSaving(true)
    try {
      const res = await fetch(`/api/membership-plans/${deletingPlan.id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Plan eliminado correctamente')
        setIsDeleteDialogOpen(false)
        setDeletingPlan(null)
        loadPlans()
      } else {
        toast.error(data.error || 'Error al eliminar')
      }
    } catch {
      toast.error('Error de conexion')
    } finally {
      setIsSaving(false)
    }
  }

  const filteredPlans = plans.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const shortTermPlans = filteredPlans.filter(p => p.duration < 365)
  const annualPlans = filteredPlans.filter(p => p.duration >= 365)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-red-950/20">
      <DashboardSidebar />
      <main className="lg:pl-64 pt-[65px] lg:pt-0">
        <div className="p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold">{"Gestion de"} <span className="text-primary">Membresias</span></h1>
              <p className="text-muted-foreground">{"Administra los planes y precios de tu gimnasio"}</p>
            </div>
            <Button onClick={handleOpenCreate} className="bg-red-600 hover:bg-red-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Plan
            </Button>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Planes</p>
                    <p className="text-3xl font-bold">{plans.length}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Planes Cortos</p>
                    <p className="text-3xl font-bold">{plans.filter(p => p.duration < 365).length}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-red-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Planes Anuales</p>
                    <p className="text-3xl font-bold">{plans.filter(p => p.duration >= 365).length}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                    <Crown className="h-6 w-6 text-yellow-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar planes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-8">
              {shortTermPlans.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    {"Pases y Planes Cortos"}
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {shortTermPlans.map((plan) => {
                      const Icon = planIcons[plan.name] || Calendar
                      return (
                        <Card key={plan.id} className="border-border hover:border-primary/30 transition-all relative group">
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleOpenEdit(plan)}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleOpenDelete(plan)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                  <Icon className="h-4 w-4 text-primary" />
                                </div>
                                <CardTitle className="text-base">{plan.name}</CardTitle>
                              </div>
                              <Badge variant={plan.isActive ? 'default' : 'secondary'} className="text-xs">
                                {plan.isActive ? 'Activo' : 'Inactivo'}
                              </Badge>
                            </div>
                            <CardDescription className="text-xs">{plan.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-2xl font-bold text-primary">{formatMXN(plan.price)}</span>
                              <Badge variant="outline" className="text-xs">{getDurationLabel(plan.duration)}</Badge>
                            </div>
                            <ul className="space-y-1">
                              {plan.features.slice(0, 4).map((f, i) => (
                                <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                                  <Check className="h-3 w-3 text-green-500 shrink-0 mt-0.5" />
                                  <span>{f}</span>
                                </li>
                              ))}
                              {plan.features.length > 4 && (
                                <li className="text-xs text-muted-foreground pl-4">
                                  +{plan.features.length - 4} beneficios mas...
                                </li>
                              )}
                            </ul>
                            {plan.includesTrainer && (
                              <div className="mt-2 p-1.5 rounded bg-primary/5 border border-primary/20 text-center">
                                <span className="text-xs text-primary font-medium flex items-center justify-center gap-1">
                                  <Users className="h-3 w-3" /> Incluye entrenador
                                </span>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              )}

              {annualPlans.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Crown className="h-5 w-5 text-yellow-500" />
                    {"Planes Anuales"}
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {annualPlans.map((plan) => {
                      const Icon = planIcons[plan.name] || Calendar
                      const isGold = plan.name.includes('Oro')
                      const isSilver = plan.name.includes('Plata')
                      return (
                        <Card key={plan.id} className={`border-border hover:border-primary/30 transition-all relative group ${
                          isGold ? 'ring-2 ring-yellow-500/30 border-yellow-500/30' :
                          isSilver ? 'ring-1 ring-primary/20 border-primary/20' : ''
                        }`}>
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleOpenEdit(plan)}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleOpenDelete(plan)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                                  isGold ? 'bg-yellow-500/20' : isSilver ? 'bg-primary/20' : 'bg-muted'
                                }`}>
                                  <Icon className={`h-5 w-5 ${
                                    isGold ? 'text-yellow-500' : isSilver ? 'text-primary' : 'text-muted-foreground'
                                  }`} />
                                </div>
                                <div>
                                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                                  {isGold && <Badge className="bg-yellow-500/20 text-yellow-500 border-0 text-xs">PREMIUM</Badge>}
                                  {isSilver && <Badge className="bg-primary/20 text-primary border-0 text-xs">RECOMENDADO</Badge>}
                                </div>
                              </div>
                              <Badge variant={plan.isActive ? 'default' : 'secondary'} className="text-xs">
                                {plan.isActive ? 'Activo' : 'Inactivo'}
                              </Badge>
                            </div>
                            <CardDescription>{plan.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <span className="text-3xl font-bold text-primary">{formatMXN(plan.price)}</span>
                                <span className="text-sm text-muted-foreground"> /ano</span>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground">~${(plan.price / 12).toFixed(0)} MXN/mes</p>
                                <p className="text-xs text-muted-foreground">~${(plan.price / 365).toFixed(0)} MXN/dia</p>
                              </div>
                            </div>
                            <ul className="space-y-1.5 mb-3">
                              {plan.features.map((f, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                  <Check className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />
                                  <span>{f}</span>
                                </li>
                              ))}
                            </ul>
                            {plan.includesTrainer && (
                              <div className="p-2 rounded bg-primary/5 border border-primary/20 text-center">
                                <span className="text-xs text-primary font-medium flex items-center justify-center gap-1">
                                  <Users className="h-3 w-3" /> Incluye sesiones con entrenador personal
                                </span>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              )}

              {filteredPlans.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <CreditCard className="h-16 w-16 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No se encontraron planes</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm ? 'Intenta con otro termino de busqueda' : 'Crea tu primer plan de membresia'}
                  </p>
                  {!searchTerm && (
                    <Button onClick={handleOpenCreate} className="bg-red-600 hover:bg-red-700 text-white">
                      <Plus className="mr-2 h-4 w-4" /> Crear Plan
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPlan ? 'Editar Plan' : 'Nuevo Plan de Membresia'}</DialogTitle>
            <DialogDescription>
              {editingPlan ? 'Modifica los datos del plan' : 'Crea un nuevo plan para tu gimnasio'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="plan-name">Nombre del plan *</Label>
              <Input
                id="plan-name"
                placeholder="Ej: Membresia Mensual"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan-desc">Descripcion *</Label>
              <Textarea
                id="plan-desc"
                placeholder="Descripcion del plan..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="plan-price">Precio (MXN) *</Label>
                <Input
                  id="plan-price"
                  type="number"
                  min={0}
                  placeholder="999"
                  value={formData.price || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan-duration">Duracion</Label>
                <Select
                  value={String(formData.duration)}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, duration: Number(v) }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 dia</SelectItem>
                    <SelectItem value="7">1 semana</SelectItem>
                    <SelectItem value="15">15 dias</SelectItem>
                    <SelectItem value="30">1 mes</SelectItem>
                    <SelectItem value="90">3 meses</SelectItem>
                    <SelectItem value="180">6 meses</SelectItem>
                    <SelectItem value="365">1 ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Incluye entrenador</Label>
                <p className="text-xs text-muted-foreground">El plan incluye sesiones con entrenador personal</p>
              </div>
              <Switch
                checked={formData.includesTrainer}
                onCheckedChange={(v) => setFormData(prev => ({ ...prev, includesTrainer: v }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Plan activo</Label>
                <p className="text-xs text-muted-foreground">Los clientes pueden contratar este plan</p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(v) => setFormData(prev => ({ ...prev, isActive: v }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Beneficios / Caracteristicas</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Ej: Acceso ilimitado al gimnasio"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddFeature() } }}
                />
                <Button type="button" variant="outline" onClick={handleAddFeature} disabled={!newFeature.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.features.length > 0 && (
                <ul className="space-y-1 mt-2">
                  {formData.features.map((f, i) => (
                    <li key={i} className="flex items-center justify-between gap-2 text-sm bg-muted/50 rounded px-3 py-1.5">
                      <span className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-green-500 shrink-0" />
                        {f}
                      </span>
                      <button type="button" onClick={() => handleRemoveFeature(i)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="bg-red-600 hover:bg-red-700 text-white">
              {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Guardando...</> : editingPlan ? 'Actualizar' : 'Crear Plan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Plan</AlertDialogTitle>
            <AlertDialogDescription>
              {"Estas seguro de que deseas eliminar el plan"} <strong>{deletingPlan?.name}</strong>? Esta accion no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSaving}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isSaving} className="bg-red-600 hover:bg-red-700 text-white">
              {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Eliminando...</> : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
