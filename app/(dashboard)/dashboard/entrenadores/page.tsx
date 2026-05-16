'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Users, Star, Award, Loader2, CheckCircle2, User, Dumbbell, DollarSign, Clock, CreditCard, Banknote } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import { formatMXN } from '@/lib/utils'

interface Trainer {
  id: string
  name: string
  email: string
  avatar?: string
  photo?: string
  specialties: string[]
  bio: string
  certifications: string[]
  experience?: string
  hourlyRate?: number
  status?: string
}

export default function EntrenadoresPage() {
  const { user } = useAuth()
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null)
  const [myTrainer, setMyTrainer] = useState<Trainer | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'membership' | 'cash'>('membership')
  const [paymentReason, setPaymentReason] = useState('')

  useEffect(() => {
    loadTrainers()
  }, [])

  const loadTrainers = async () => {
    try {
      const res = await fetch('/api/trainers')
      const data = await res.json()
      if (data.success) {
        setTrainers(data.trainers || [])
      }
    } catch (error) {
      toast.error('Error al cargar entrenadores')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectTrainer = (trainer: Trainer) => {
    setSelectedTrainer(trainer)
    setPaymentMethod('membership')
    setPaymentReason('')
    setIsDialogOpen(true)
  }

  const handleConfirmTrainer = async () => {
    if (!selectedTrainer || !user) return
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/clients/trainer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: user.id, trainerId: selectedTrainer.id })
      })
      const data = await res.json()
      if (data.success) {
        setMyTrainer(selectedTrainer)
        toast.success(`${selectedTrainer.name} es ahora tu entrenador`)
        setIsDialogOpen(false)
      } else {
        toast.error(data.error || 'Error al asignar entrenador')
      }
    } catch {
      toast.error('Error de conexión')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-red-950/20">
      <DashboardSidebar />
      <main className="lg:pl-64 pt-[65px] lg:pt-0">
        <div className="p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Nuestros <span className="text-primary">Entrenadores</span></h1>
            <p className="text-muted-foreground">Escoge al entrenador que mejor se adapte a tus objetivos</p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : trainers.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Users className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay entrenadores disponibles</h3>
                <p className="text-muted-foreground">Pronto tendremos entrenadores listos para ayudarte</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Current Trainer */}
              {myTrainer && (
                <Card className="mb-8 border-green-500/30 bg-green-500/5">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <CardTitle className="text-green-500">Tu Entrenador Actual</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-green-500/30">
                        {myTrainer.photo ? (
                          <Image src={myTrainer.photo} alt={myTrainer.name} fill className="object-cover" />
                        ) : (
                          <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary text-xl font-bold">
                              {myTrainer.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-xl font-bold">{myTrainer.name}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {myTrainer.specialties.map((s, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{s}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Trainer Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trainers.map((trainer) => (
                  <Card key={trainer.id} className={`relative hover:border-primary/50 transition-colors ${myTrainer?.id === trainer.id ? 'border-green-500/50' : ''}`}>
                    {myTrainer?.id === trainer.id && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-green-500">Tu Entrenador</Badge>
                      </div>
                    )}
                    <CardHeader className="text-center pb-2">
                      <div className="relative h-32 w-32 mx-auto mb-3 rounded-full overflow-hidden border-2 border-primary/30">
                        {trainer.photo ? (
                          <Image src={trainer.photo} alt={trainer.name} fill className="object-cover" />
                        ) : (
                          <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary text-3xl font-bold">
                              {trainer.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                            </span>
                          </div>
                        )}
                      </div>
                      <CardTitle>{trainer.name}</CardTitle>
                      {trainer.experience && (
                        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                          <Clock className="h-3 w-3" /> {trainer.experience}
                        </p>
                      )}
                      <div className="flex flex-wrap justify-center gap-1 mt-2">
                        {trainer.specialties.slice(0, 3).map((specialty, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{specialty}</Badge>
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {trainer.bio && (
                        <p className="text-sm text-muted-foreground text-center mb-4 line-clamp-3">
                          {trainer.bio}
                        </p>
                      )}
                      
                      {trainer.certifications.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                            <Award className="h-3 w-3" /> Certificaciones
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {trainer.certifications.slice(0, 2).map((cert, i) => (
                              <Badge key={i} variant="outline" className="text-xs">{cert}</Badge>
                            ))}
                            {trainer.certifications.length > 2 && (
                              <Badge variant="outline" className="text-xs">+{trainer.certifications.length - 2}</Badge>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {trainer.hourlyRate ? (
                        <div className="mb-4 p-2 rounded-lg bg-primary/5 border border-primary/20 text-center">
                          <p className="text-xs text-muted-foreground">Tarifa por hora</p>
                          <p className="text-lg font-bold text-primary">{formatMXN(trainer.hourlyRate)}</p>
                        </div>
                      ) : null}
                      
                      <Button 
                        className="w-full" 
                        variant={myTrainer?.id === trainer.id ? 'outline' : 'default'}
                        onClick={() => handleSelectTrainer(trainer)}
                        disabled={myTrainer?.id === trainer.id}
                      >
                        {myTrainer?.id === trainer.id ? 'Entrenador Actual' : 'Seleccionar'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Confirm Trainer Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Entrenador</DialogTitle>
            <DialogDescription>
              {selectedTrainer?.name} será tu entrenador personal
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-col items-center text-center p-4">
              <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-primary/30 mb-3">
                {selectedTrainer?.photo ? (
                  <Image src={selectedTrainer.photo} alt={selectedTrainer?.name || ''} fill className="object-cover" />
                ) : (
                  <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary text-2xl font-bold">
                      {selectedTrainer?.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-xl font-bold">{selectedTrainer?.name}</p>
              <div className="flex flex-wrap justify-center gap-1 mt-2">
                {selectedTrainer?.specialties.map((s, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">{s}</Badge>
                ))}
              </div>
              {selectedTrainer?.hourlyRate && (
                <p className="text-sm text-muted-foreground mt-2">
                  Tarifa: <span className="text-primary font-semibold">{formatMXN(selectedTrainer.hourlyRate)}/hr</span>
                </p>
              )}
            </div>
            
            {selectedTrainer?.bio && (
              <p className="text-sm text-muted-foreground text-center">
                {selectedTrainer.bio}
              </p>
            )}

            {/* Payment Method Selection */}
            <div className="border border-border rounded-lg p-4 space-y-3">
              <p className="text-sm font-semibold">{"Como deseas pagar la tarifa del entrenador?"}</p>
              <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as 'membership' | 'cash')}>
                <div className="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary/30 transition-colors">
                  <RadioGroupItem value="membership" id="pay-membership" className="mt-0.5" />
                  <Label htmlFor="pay-membership" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <CreditCard className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">Cargar a la membresia</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      La tarifa del entrenador se sumara al cobro de tu membresia
                    </p>
                  </Label>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary/30 transition-colors">
                  <RadioGroupItem value="cash" id="pay-cash" className="mt-0.5" />
                  <Label htmlFor="pay-cash" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <Banknote className="h-4 w-4 text-green-500" />
                      <span className="font-medium text-sm">Pago en efectivo</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Pagaras directamente al entrenador en efectivo en cada sesion
                    </p>
                  </Label>
                </div>
              </RadioGroup>
              {paymentMethod === 'membership' && (
                <div className="space-y-2 pt-1">
                  <Label htmlFor="pay-reason" className="text-xs text-muted-foreground">
                    {"Motivo o comentario (opcional)"}
                  </Label>
                  <Textarea
                    id="pay-reason"
                    placeholder="Ej: Quiero mejorar mi tecnica de sentadilla, necesito un plan personalizado..."
                    value={paymentReason}
                    onChange={(e) => setPaymentReason(e.target.value)}
                    rows={2}
                    className="text-sm"
                  />
                </div>
              )}
              {paymentMethod === 'cash' && (
                <div className="space-y-2 pt-1">
                  <Label htmlFor="pay-reason-cash" className="text-xs text-muted-foreground">
                    {"Motivo o comentario (opcional)"}
                  </Label>
                  <Textarea
                    id="pay-reason-cash"
                    placeholder="Ej: Prefiero pagar en efectivo porque..."
                    value={paymentReason}
                    onChange={(e) => setPaymentReason(e.target.value)}
                    rows={2}
                    className="text-sm"
                  />
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button onClick={handleConfirmTrainer} disabled={isSubmitting}>
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Asignando...</>
                ) : (
                  'Confirmar'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
