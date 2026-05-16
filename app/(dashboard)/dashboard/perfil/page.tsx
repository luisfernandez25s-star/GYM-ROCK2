'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { User, Mail, Shield, Lock, CreditCard, Eye, EyeOff, Loader2, Plus, Trash2, CheckCircle2, AlertCircle, ScanFace } from 'lucide-react'
import { toast } from 'sonner'
import { FaceUpload } from '@/components/face-upload'

interface CreditCardData {
  id: string
  lastFour: string
  brand: string
  holderName: string
  expiryMonth: string
  expiryYear: string
  isDefault: boolean
}

export default function ProfilePage() {
  const { user } = useAuth()
  const [cards, setCards] = useState<CreditCardData[]>([])
  const [isLoadingCards, setIsLoadingCards] = useState(false)
  
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const [isCardDialogOpen, setIsCardDialogOpen] = useState(false)
  const [cardNumber, setCardNumber] = useState('')
  const [cardHolder, setCardHolder] = useState('')
  const [cardExpMonth, setCardExpMonth] = useState('')
  const [cardExpYear, setCardExpYear] = useState('')
  const [cardBrand, setCardBrand] = useState('visa')
  const [isAddingCard, setIsAddingCard] = useState(false)

  useEffect(() => {
    if (user) loadCards()
  }, [user])

  const loadCards = async () => {
    if (!user) return
    setIsLoadingCards(true)
    try {
      const res = await fetch(`/api/credit-cards?userId=${user.id}`)
      const data = await res.json()
      if (data.success) {
        setCards(data.cards || [])
      }
    } catch {
      // Silent fail
    } finally {
      setIsLoadingCards(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (newPassword !== confirmPassword) {
      toast.error('Las contrasenas no coinciden')
      return
    }
    if (newPassword.length < 6) {
      toast.error('La nueva contrasena debe tener al menos 6 caracteres')
      return
    }

    setIsChangingPassword(true)
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          currentPassword,
          newPassword
        })
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Contrasena cambiada exitosamente')
        setIsPasswordDialogOpen(false)
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        toast.error(data.error || 'Error al cambiar contrasena')
      }
    } catch {
      toast.error('Error de conexion')
    } finally {
      setIsChangingPassword(false)
    }
  }

  const detectCardBrand = (num: string) => {
    const clean = num.replace(/\s/g, '')
    if (clean.startsWith('4')) return 'visa'
    if (clean.startsWith('5') || clean.startsWith('2')) return 'mastercard'
    if (clean.startsWith('3')) return 'amex'
    return 'visa'
  }

  const formatCardNumber = (value: string) => {
    const clean = value.replace(/\D/g, '').slice(0, 16)
    return clean.replace(/(\d{4})/g, '$1 ').trim()
  }

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const cleanNumber = cardNumber.replace(/\s/g, '')
    if (cleanNumber.length < 15) {
      toast.error('Numero de tarjeta invalido')
      return
    }

    setIsAddingCard(true)
    try {
      const res = await fetch('/api/credit-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          lastFour: cleanNumber.slice(-4),
          brand: detectCardBrand(cleanNumber),
          holderName: cardHolder,
          expiryMonth: cardExpMonth,
          expiryYear: cardExpYear,
          isDefault: cards.length === 0
        })
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Tarjeta agregada exitosamente')
        setIsCardDialogOpen(false)
        setCardNumber('')
        setCardHolder('')
        setCardExpMonth('')
        setCardExpYear('')
        loadCards()
      } else {
        toast.error(data.error || 'Error al agregar tarjeta')
      }
    } catch {
      toast.error('Error de conexion')
    } finally {
      setIsAddingCard(false)
    }
  }

  const handleDeleteCard = async (cardId: string) => {
    try {
      const res = await fetch(`/api/credit-cards?id=${cardId}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        toast.success('Tarjeta eliminada')
        loadCards()
      }
    } catch {
      toast.error('Error al eliminar tarjeta')
    }
  }

  if (!user) return null

  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  const roleLabels: Record<string, string> = { admin: 'Administrador', client: 'Cliente', trainer: 'Entrenador' }

  const brandIcons: Record<string, string> = {
    visa: 'VISA',
    mastercard: 'MC',
    amex: 'AMEX'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-red-950/20">
      <DashboardSidebar />
      <main className="lg:pl-64 pt-[65px] lg:pt-0">
        <div className="p-6 lg:p-8 max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Mi <span className="text-primary">Perfil</span></h1>
            <p className="text-muted-foreground">{"Informacion de tu cuenta y metodos de pago"}</p>
          </div>

          {/* Profile Info Card */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  {user.avatar ? (
                    <AvatarImage src={user.avatar} />
                  ) : (
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">{initials}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{user.name}</CardTitle>
                  <Badge variant="outline" className="mt-1">{roleLabels[user.role]}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Nombre</p>
                  <p className="font-medium">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Rol</p>
                  <p className="font-medium">{roleLabels[user.role]}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Face Scan / Check-in Photo */}
          <Card className="mb-6">
            <CardHeader>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ScanFace className="h-5 w-5 text-primary" />
                  {"Foto de Escaneo Facial"}
                </CardTitle>
                <CardDescription>{"Tu foto se usa para el sistema de reconocimiento facial al ingresar al gym. Solo se aceptan fotos con un rostro visible."}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <FaceUpload
                userId={user.id}
                currentPhoto={user.avatar}
                onPhotoUploaded={(url) => {
                  toast.success('Foto actualizada. Se usara para el escaneo facial.')
                }}
              />
            </CardContent>
          </Card>

          {/* Password Change Card */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    {"Seguridad"}
                  </CardTitle>
                  <CardDescription>{"Cambia tu contrasena de acceso"}</CardDescription>
                </div>
                <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Lock className="mr-2 h-4 w-4" />
                      {"Cambiar Contrasena"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>{"Cambiar Contrasena"}</DialogTitle>
                      <DialogDescription>
                        {"Ingresa tu contrasena actual y la nueva contrasena"}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                      <div className="space-y-2">
                        <Label>{"Contrasena Actual"}</Label>
                        <div className="relative">
                          <Input 
                            type={showCurrentPassword ? 'text' : 'password'} 
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            className="pr-10"
                          />
                          <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                            {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>{"Nueva Contrasena"}</Label>
                        <div className="relative">
                          <Input 
                            type={showNewPassword ? 'text' : 'password'} 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            minLength={6}
                            className="pr-10"
                          />
                          <button type="button" onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>{"Confirmar Nueva Contrasena"}</Label>
                        <Input 
                          type="password" 
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          minLength={6}
                        />
                        {confirmPassword && newPassword !== confirmPassword && (
                          <p className="text-xs text-destructive flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> {"Las contrasenas no coinciden"}
                          </p>
                        )}
                      </div>
                      <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button type="submit" disabled={isChangingPassword || newPassword !== confirmPassword}>
                          {isChangingPassword ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Cambiando...</>
                          ) : (
                            'Cambiar Contrasena'
                          )}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Lock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{"Contrasena"}</p>
                  <p className="text-xs text-muted-foreground">{"Ultima actualizacion: Reciente"}</p>
                </div>
                <Badge variant="outline" className="ml-auto text-green-500 border-green-500/30">Activa</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Credit Cards Section */}
          {(user.role === 'trainer' || user.role === 'client') && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      {"Metodos de Pago"}
                    </CardTitle>
                    <CardDescription>{"Tarjetas de credito/debito para cobros y pagos"}</CardDescription>
                  </div>
                  <Dialog open={isCardDialogOpen} onOpenChange={setIsCardDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar Tarjeta
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Agregar Tarjeta</DialogTitle>
                        <DialogDescription>
                          {"Agrega una tarjeta de credito o debito para tus cobros"}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddCard} className="space-y-4">
                        <div className="space-y-2">
                          <Label>{"Numero de Tarjeta"}</Label>
                          <Input 
                            placeholder="0000 0000 0000 0000"
                            value={cardNumber}
                            onChange={(e) => {
                              const formatted = formatCardNumber(e.target.value)
                              setCardNumber(formatted)
                              setCardBrand(detectCardBrand(formatted))
                            }}
                            maxLength={19}
                            required
                          />
                          {cardNumber.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {brandIcons[cardBrand] || 'CARD'}
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Nombre del Titular</Label>
                          <Input 
                            placeholder="Como aparece en la tarjeta"
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Mes</Label>
                            <Select value={cardExpMonth} onValueChange={setCardExpMonth}>
                              <SelectTrigger>
                                <SelectValue placeholder="Mes" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 12 }, (_, i) => {
                                  const month = String(i + 1).padStart(2, '0')
                                  return <SelectItem key={month} value={month}>{month}</SelectItem>
                                })}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>{"Ano"}</Label>
                            <Select value={cardExpYear} onValueChange={setCardExpYear}>
                              <SelectTrigger>
                                <SelectValue placeholder="Ano" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 10 }, (_, i) => {
                                  const year = String(2024 + i)
                                  return <SelectItem key={year} value={year}>{year}</SelectItem>
                                })}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                          <p className="text-xs text-blue-400">
                            {"Tu informacion de pago se almacena de forma segura. Solo guardamos los ultimos 4 digitos."}
                          </p>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                          <Button type="button" variant="outline" onClick={() => setIsCardDialogOpen(false)}>
                            Cancelar
                          </Button>
                          <Button type="submit" disabled={isAddingCard}>
                            {isAddingCard ? (
                              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Agregando...</>
                            ) : (
                              'Agregar Tarjeta'
                            )}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingCards ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : cards.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <CreditCard className="h-12 w-12 text-muted-foreground/30 mb-3" />
                    <p className="text-sm text-muted-foreground mb-1">No tienes tarjetas registradas</p>
                    <p className="text-xs text-muted-foreground">
                      {"Agrega una tarjeta para facilitar tus cobros y pagos"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cards.map((card) => (
                      <div key={card.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-14 rounded bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">
                              {brandIcons[card.brand] || 'CARD'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">
                              {"**** **** **** "}{card.lastFour}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {card.holderName} - {card.expiryMonth}/{card.expiryYear}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {card.isDefault && (
                            <Badge variant="outline" className="text-green-500 border-green-500/30 text-xs">
                              <CheckCircle2 className="h-3 w-3 mr-1" /> Principal
                            </Badge>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => handleDeleteCard(card.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
