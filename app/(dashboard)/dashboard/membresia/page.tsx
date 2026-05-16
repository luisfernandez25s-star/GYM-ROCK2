'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CreditCard, AlertCircle, Check, Loader2, Calendar, Clock, Star, Crown, Zap, Shield } from 'lucide-react'
import { formatMXN } from '@/lib/utils'
import { toast } from 'sonner'

interface Plan {
  id: string
  name: string
  description: string
  price: number
  duration: number
  features: string[]
  includesTrainer: boolean
}

interface Membership {
  id: string
  clientId: string
  planId: string
  startDate: string
  endDate: string
  status: 'active' | 'expired' | 'cancelled' | 'pending'
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

const planHighlight: Record<string, boolean> = {
  'Membresia Anual Plata': true,
  'Membresia Semestral': true,
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

function getPricePerDay(price: number, duration: number): string {
  return (price / duration).toFixed(0)
}

export default function MembresiaPage() {
  const { user } = useAuth()
  const [plans, setPlans] = useState<Plan[]>([])
  const [myMembership, setMyMembership] = useState<Membership | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState<'short' | 'annual'>('short')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const res = await fetch('/api/memberships')
      const data = await res.json()
      if (data.success) {
        setPlans(data.plans || [])
        if (user && data.memberships) {
          const mine = data.memberships.find((m: Membership) => m.status === 'active')
          setMyMembership(mine || null)
        }
      }
    } catch {
      toast.error('Error al cargar membresias')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan)
    setIsDialogOpen(true)
  }

  const handleConfirmSubscription = async () => {
    if (!selectedPlan || !user) return
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/memberships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: user.id, planId: selectedPlan.id })
      })
      const data = await res.json()
      if (data.success) {
        toast.success(`Membresia "${selectedPlan.name}" activada exitosamente.`)
        setIsDialogOpen(false)
        loadData()
      } else {
        toast.error(data.error || 'Error al solicitar membresia')
      }
    } catch {
      toast.error('Error de conexion')
    } finally {
      setIsSubmitting(false)
    }
  }

  const shortTermPlans = plans.filter(p => p.duration < 365)
  const annualPlans = plans.filter(p => p.duration >= 365)

  const activePlans = activeTab === 'short' ? shortTermPlans : annualPlans

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-red-950/20">
      <DashboardSidebar />
      <main className="lg:pl-64 pt-[65px] lg:pt-0">
        <div className="p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Nuestros <span className="text-primary">Planes</span></h1>
            <p className="text-muted-foreground">{"Elige el plan que mejor se adapte a tus objetivos"}</p>
          </div>

          {/* Current Membership Banner */}
          {myMembership && (
            <Card className="mb-6 border-primary/30 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Check className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Membresia Activa</h3>
                      <p className="text-sm text-muted-foreground">
                        Vence el {new Date(myMembership.endDate).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Activa</Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tab Selector */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={activeTab === 'short' ? 'default' : 'outline'}
              onClick={() => setActiveTab('short')}
              className="flex-1 sm:flex-none"
            >
              <Clock className="mr-2 h-4 w-4" />
              {"Pases y Planes Cortos"}
            </Button>
            <Button
              variant={activeTab === 'annual' ? 'default' : 'outline'}
              onClick={() => setActiveTab('annual')}
              className="flex-1 sm:flex-none"
            >
              <Crown className="mr-2 h-4 w-4" />
              {"Planes Anuales"}
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activePlans.map((plan) => {
                const Icon = planIcons[plan.name] || Calendar
                const isHighlighted = planHighlight[plan.name]
                
                return (
                  <Card 
                    key={plan.id} 
                    className={`relative overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/5 ${
                      isHighlighted 
                        ? 'border-primary ring-2 ring-primary/20' 
                        : 'border-border hover:border-primary/30'
                    }`}
                  >
                    {isHighlighted && (
                      <div className="absolute top-0 right-0">
                        <div className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                          POPULAR
                        </div>
                      </div>
                    )}
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                          isHighlighted ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{plan.name}</CardTitle>
                          <Badge variant="outline" className="text-xs mt-1">
                            {getDurationLabel(plan.duration)}
                          </Badge>
                        </div>
                      </div>
                      <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-bold text-primary">{formatMXN(plan.price)}</span>
                        </div>
                        {plan.duration > 1 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            ~${getPricePerDay(plan.price, plan.duration)} MXN/dia
                          </p>
                        )}
                      </div>
                      
                      <ul className="space-y-2 mb-6">
                        {plan.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{f}</span>
                          </li>
                        ))}
                      </ul>
                      
                      {plan.includesTrainer && (
                        <div className="flex items-center gap-2 mb-4 p-2 rounded bg-primary/5 border border-primary/20">
                          <Star className="h-4 w-4 text-primary shrink-0" />
                          <span className="text-xs text-primary font-medium">Incluye entrenador personal</span>
                        </div>
                      )}

                      <Button 
                        className="w-full" 
                        variant={isHighlighted ? 'default' : 'outline'}
                        onClick={() => handleSelectPlan(plan)}
                        disabled={!!myMembership}
                      >
                        {myMembership ? 'Ya tienes membresia' : 'Seleccionar Plan'}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Info Banner */}
          <Card className="mt-8 border-blue-500/20 bg-blue-500/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm mb-1">{"Informacion sobre membresias"}</h4>
                  <p className="text-sm text-muted-foreground">
                    {"Al contratar un plan, tu membresia se activa de inmediato. Los pagos se realizan en recepcion con efectivo, tarjeta o transferencia. Si prefieres, puedes activar tu membresia directamente en el gym."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Plan</DialogTitle>
            <DialogDescription>
              {"Estas a punto de solicitar el siguiente plan:"}
            </DialogDescription>
          </DialogHeader>
          {selectedPlan && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50 border">
                <h3 className="font-bold text-lg">{selectedPlan.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{selectedPlan.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{getDurationLabel(selectedPlan.duration)}</Badge>
                  <span className="text-2xl font-bold text-primary">{formatMXN(selectedPlan.price)}</span>
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                <p className="text-xs text-green-400 flex items-start gap-2">
                  <CreditCard className="h-4 w-4 shrink-0 mt-0.5" />
                  {"Al confirmar, tu membresia se activara inmediatamente. El pago se puede realizar en recepcion con efectivo, tarjeta o transferencia."}
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleConfirmSubscription} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Activando...</>
                  ) : (
                    'Confirmar y Activar'
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
