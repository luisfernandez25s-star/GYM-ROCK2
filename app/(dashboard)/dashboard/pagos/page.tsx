'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertCircle, Clock, CreditCard, Building2, Loader2, CheckCircle2 } from 'lucide-react'
import { formatMXN } from '@/lib/utils'
import { toast } from 'sonner'

interface Payment {
  id: string
  clientId: string
  membershipId?: string
  amount: number
  method: string
  status: 'pending' | 'completed' | 'failed'
  description: string
  date: string
  dueDate?: string
}

export default function PagosPage() {
  const { user } = useAuth()
  const [payments, setPayments] = useState<Payment[]>([])
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) loadPayments()
  }, [user])

  const loadPayments = async () => {
    try {
      const res = await fetch(`/api/payments?clientId=${user?.id}`)
      const data = await res.json()
      if (data.success) {
        setPayments(data.payments || [])
      }
    } catch (error) {
      toast.error('Error al cargar pagos')
    } finally {
      setIsLoading(false)
    }
  }

  const handleShowPaymentOptions = (payment: Payment) => {
    setSelectedPayment(payment)
    setIsDialogOpen(true)
  }

  const pendingPayments = payments.filter(p => p.status === 'pending')
  const completedPayments = payments.filter(p => p.status === 'completed')
  const totalPending = pendingPayments.reduce((acc, p) => acc + p.amount, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-red-950/20">
      <DashboardSidebar />
      <main className="lg:pl-64 pt-[65px] lg:pt-0">
        <div className="p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Mis <span className="text-primary">Pagos</span></h1>
            <p className="text-muted-foreground">Historial y pagos pendientes</p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <Card className={pendingPayments.length > 0 ? 'border-yellow-500/30 bg-yellow-500/5' : ''}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Pagos Pendientes</p>
                        <p className="text-3xl font-bold">{pendingPayments.length}</p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                        <Clock className="h-6 w-6 text-yellow-500" />
                      </div>
                    </div>
                    {totalPending > 0 && (
                      <p className="text-sm text-yellow-500 mt-2">
                        Total: {formatMXN(totalPending)}
                      </p>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Pagos Completados</p>
                        <p className="text-3xl font-bold">{completedPayments.length}</p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Pending Payments Alert */}
              {pendingPayments.length > 0 && (
                <Card className="mb-8 border-yellow-500/30 bg-yellow-500/5">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                      <CardTitle className="text-yellow-500">Tienes pagos pendientes</CardTitle>
                    </div>
                    <CardDescription>
                      Puedes realizar tu pago por transferencia o directamente en el gimnasio
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {pendingPayments.map((payment) => (
                      <div key={payment.id} className="p-4 rounded-lg bg-background/50 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="font-medium">{payment.description}</p>
                          <p className="text-sm text-muted-foreground">
                            Fecha: {new Date(payment.date).toLocaleDateString('es-MX')}
                          </p>
                          {payment.dueDate && (
                            <p className="text-sm text-yellow-500">
                              Vence: {new Date(payment.dueDate).toLocaleDateString('es-MX')}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xl font-bold text-primary">{formatMXN(payment.amount)}</span>
                          <Button onClick={() => handleShowPaymentOptions(payment)}>
                            Ver opciones
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Payment History */}
              <Card>
                <CardHeader>
                  <CardTitle>Historial de Pagos</CardTitle>
                  <CardDescription>{payments.length} pagos registrados</CardDescription>
                </CardHeader>
                <CardContent>
                  {payments.length === 0 ? (
                    <div className="text-center py-12">
                      <CreditCard className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-muted-foreground">No tienes pagos registrados</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {payments.map((payment) => (
                        <div key={payment.id} className="p-4 rounded-lg bg-muted/30 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                              payment.status === 'completed' ? 'bg-green-500/10' : 'bg-yellow-500/10'
                            }`}>
                              {payment.status === 'completed' ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                              ) : (
                                <Clock className="h-5 w-5 text-yellow-500" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{payment.description}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(payment.date).toLocaleDateString('es-MX')}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{formatMXN(payment.amount)}</p>
                            <Badge variant={payment.status === 'completed' ? 'default' : 'outline'}>
                              {payment.status === 'completed' ? 'Pagado' : 'Pendiente'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>

      {/* Payment Options Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Opciones de Pago</DialogTitle>
            <DialogDescription>
              Selecciona cómo deseas realizar tu pago
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <p className="text-sm text-muted-foreground">Monto a pagar</p>
              <p className="text-3xl font-bold text-primary">{selectedPayment && formatMXN(selectedPayment.amount)}</p>
            </div>

            <div className="space-y-3">
              {/* Transfer Option */}
              <Card className="cursor-pointer hover:border-primary/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                      <CreditCard className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium">Transferencia Bancaria</p>
                      <p className="text-sm text-muted-foreground mb-2">
                        Realiza una transferencia y envía el comprobante
                      </p>
                      <div className="text-xs space-y-1 p-2 rounded bg-muted/50">
                        <p><strong>Banco:</strong> BBVA</p>
                        <p><strong>CLABE:</strong> 012180001234567890</p>
                        <p><strong>Beneficiario:</strong> GYMROCK SA DE CV</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Envía tu comprobante al WhatsApp del gimnasio
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* In-Person Option */}
              <Card className="cursor-pointer hover:border-primary/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                      <Building2 className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">Pago en el Gimnasio</p>
                      <p className="text-sm text-muted-foreground">
                        Acude a recepción para realizar tu pago en efectivo o con tarjeta
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Horario: Lunes a Viernes 6:00 - 22:00, Sábados 8:00 - 14:00
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Button variant="outline" className="w-full" onClick={() => setIsDialogOpen(false)}>
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
