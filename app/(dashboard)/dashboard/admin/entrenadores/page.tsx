'use client'

import { useState, useEffect } from 'react'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, UserCog, Eye, EyeOff, Loader2, Award, Camera, Copy, CheckCircle2, Dumbbell, Clock, DollarSign, Star, Upload, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface Trainer {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  specialties: string[]
  bio: string
  certifications: string[]
  experience?: string
  hourlyRate?: number
  photo?: string
  status: string
}

export default function TrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [copiedPassword, setCopiedPassword] = useState(false)
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
  const [newTrainer, setNewTrainer] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    password: '', 
    specialties: '', 
    bio: '',
    certifications: '',
    experience: '',
    hourlyRate: ''
  })

  useEffect(() => {
    loadTrainers()
  }, [])

  useEffect(() => {
    if (newTrainer.name.length > 2) {
      const clean = newTrainer.name.replace(/\s+/g, '').slice(0, 6)
      setNewTrainer(p => ({ ...p, password: `${clean}GR2024!` }))
    }
  }, [newTrainer.name])

  const loadTrainers = async () => {
    try {
      const res = await fetch('/api/trainers')
      const data = await res.json()
      if (data.success) {
        setTrainers(data.trainers || [])
      }
    } catch {
      toast.error('Error al cargar entrenadores')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(newTrainer.password)
    setCopiedPassword(true)
    toast.success('Contrasena copiada al portapapeles')
    setTimeout(() => setCopiedPassword(false), 2000)
  }

  const handleAddTrainer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTrainer.name || !newTrainer.email || !newTrainer.password) {
      toast.error('Nombre, email y contrasena son requeridos')
      return
    }
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: newTrainer.name,
          email: newTrainer.email,
          phone: newTrainer.phone,
          password: newTrainer.password,
          role: 'trainer' 
        })
      })
      const data = await res.json()
      
      if (data.success && data.user) {
        await fetch('/api/trainers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: data.user.id,
            specialties: newTrainer.specialties.split(',').map(s => s.trim()).filter(Boolean),
            bio: newTrainer.bio,
            certifications: newTrainer.certifications.split(',').map(c => c.trim()).filter(Boolean),
            experience: newTrainer.experience,
            hourlyRate: newTrainer.hourlyRate ? parseFloat(newTrainer.hourlyRate) : undefined
          })
        })

        // Upload photo if one was selected
        const trainerWithPhoto = newTrainer as typeof newTrainer & { photoFile?: File }
        if (trainerWithPhoto.photoFile) {
          await handleUploadTrainerPhoto(data.user.id, trainerWithPhoto.photoFile)
        }
        
        await loadTrainers()
        setNewTrainer({ name: '', email: '', phone: '', password: '', specialties: '', bio: '', certifications: '', experience: '', hourlyRate: '' })
        setIsDialogOpen(false)
        toast.success(`Entrenador "${newTrainer.name}" agregado exitosamente`)
      } else {
        toast.error(data.error || 'Error al agregar entrenador')
      }
    } catch {
      toast.error('Error de conexion')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleViewTrainer = (trainer: Trainer) => {
    setSelectedTrainer(trainer)
    setIsDetailOpen(true)
  }

  const handleUploadTrainerPhoto = async (trainerId: string, file: File) => {
    setIsUploadingPhoto(true)
    try {
      const formData = new FormData()
      formData.append('photo', file)
      const res = await fetch(`/api/trainers/${trainerId}/photo`, {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Foto del entrenador actualizada')
        await loadTrainers()
        // Update selected trainer if viewing detail
        if (selectedTrainer && selectedTrainer.id === trainerId) {
          setSelectedTrainer(prev => prev ? { ...prev, photo: data.photoUrl } : null)
        }
      } else {
        toast.error(data.error || 'Error al subir foto')
      }
    } catch {
      toast.error('Error de conexion al subir foto')
    } finally {
      setIsUploadingPhoto(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-red-950/20">
      <DashboardSidebar />
      <main className="lg:pl-64 pt-[65px] lg:pt-0">
        <div className="p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold">Entrenadores</h1>
              <p className="text-muted-foreground">{"Gestion del equipo de entrenadores profesionales"}</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="mr-2 h-4 w-4" />Nuevo Entrenador</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Agregar Entrenador</DialogTitle>
                  <DialogDescription>{"Registra un nuevo entrenador profesional. Se genera una contrasena generica que el entrenador podra cambiar despues."}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddTrainer} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nombre Completo *</Label>
                    <Input placeholder="Nombre Completo" value={newTrainer.name}
                      onChange={(e) => setNewTrainer(p => ({ ...p, name: e.target.value }))} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Email *</Label>
                    <Input type="email" placeholder="entrenador@gymrock.com" value={newTrainer.email}
                      onChange={(e) => setNewTrainer(p => ({ ...p, email: e.target.value }))} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Telefono</Label>
                    <Input placeholder="+52 55 0000 0000" value={newTrainer.phone}
                      onChange={(e) => setNewTrainer(p => ({ ...p, phone: e.target.value }))} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>{"Contrasena Generica *"}</Label>
                    <p className="text-xs text-muted-foreground">{"Se genera automaticamente. El entrenador podra cambiarla al iniciar sesion."}</p>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input type={showPassword ? 'text' : 'password'} value={newTrainer.password}
                          onChange={(e) => setNewTrainer(p => ({ ...p, password: e.target.value }))} required className="pr-10" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <Button type="button" variant="outline" size="icon" onClick={handleCopyPassword} className="shrink-0">
                        {copiedPassword ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Especialidades (separadas por coma)</Label>
                    <Input placeholder="Musculacion, Cardio, Yoga, CrossFit..." value={newTrainer.specialties}
                      onChange={(e) => setNewTrainer(p => ({ ...p, specialties: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Certificaciones (separadas por coma)</Label>
                    <Input placeholder="NSCA-CPT, ACE, NASM..." value={newTrainer.certifications}
                      onChange={(e) => setNewTrainer(p => ({ ...p, certifications: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Experiencia</Label>
                      <Input placeholder="5 anos" value={newTrainer.experience}
                        onChange={(e) => setNewTrainer(p => ({ ...p, experience: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Tarifa por hora (MXN)</Label>
                      <Input type="number" placeholder="350" value={newTrainer.hourlyRate}
                        onChange={(e) => setNewTrainer(p => ({ ...p, hourlyRate: e.target.value }))} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Biografia</Label>
                    <Textarea placeholder="Breve descripcion del entrenador..." value={newTrainer.bio}
                      onChange={(e) => setNewTrainer(p => ({ ...p, bio: e.target.value }))} rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label>Foto del Entrenador</Label>
                    <p className="text-xs text-muted-foreground">{"Sube una foto del entrenador (JPG, PNG o WebP, max 5MB)"}</p>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-primary/40 bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors">
                        <Upload className="h-4 w-4 text-primary" />
                        <span className="text-sm text-primary font-medium">Seleccionar imagen</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              setNewTrainer(p => ({ ...p, photoFile: file } as typeof p & { photoFile: File }))
                              toast.success(`Imagen "${file.name}" lista para subir`)
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Agregando...</> : 'Agregar Entrenador'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Summary */}
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Entrenadores</p>
                    <p className="text-3xl font-bold">{trainers.length}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserCog className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Activos</p>
                    <p className="text-3xl font-bold text-green-500">{trainers.filter(t => t.status === 'active').length}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Especialidades</p>
                    <p className="text-3xl font-bold text-primary">
                      {new Set(trainers.flatMap(t => t.specialties)).size}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Equipo de Entrenadores Profesionales</CardTitle>
              <CardDescription>{isLoading ? 'Cargando...' : `${trainers.length} entrenadores registrados`}</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : trainers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <UserCog className="h-16 w-16 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Sin entrenadores</h3>
                  <p className="text-muted-foreground mb-4">Agrega tu primer entrenador al equipo</p>
                  <Button onClick={() => setIsDialogOpen(true)}><Plus className="mr-2 h-4 w-4" />Agregar entrenador</Button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trainers.map((trainer) => (
                    <Card key={trainer.id} className="border-border hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5 cursor-pointer group overflow-hidden" onClick={() => handleViewTrainer(trainer)}>
                      <CardContent className="p-0">
                        <div className="relative h-48 bg-gradient-to-br from-primary/20 to-red-950/40 overflow-hidden">
                          {(trainer.photo || trainer.avatar) ? (
                            <img 
                              src={trainer.photo || trainer.avatar} 
                              alt={trainer.name} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Avatar className="h-24 w-24">
                                <AvatarFallback className="bg-primary/20 text-primary text-3xl">
                                  {trainer.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                          )}
                          <div className="absolute top-3 right-3">
                            <Badge className={trainer.status === 'active' ? 'bg-green-600 text-foreground border-0' : 'bg-muted text-muted-foreground border-0'}>
                              {trainer.status === 'active' ? 'Activo' : 'Inactivo'}
                            </Badge>
                          </div>
                          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent" />
                        </div>
                        
                        <div className="p-4">
                          <h3 className="font-bold text-lg mb-1">{trainer.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{trainer.email}</p>
                          
                          {trainer.bio && (
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {trainer.bio}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
                            {trainer.experience && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {trainer.experience}
                              </span>
                            )}
                            {trainer.hourlyRate && (
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3" /> ${trainer.hourlyRate}/hr
                              </span>
                            )}
                          </div>
                          
                          {trainer.specialties.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {trainer.specialties.slice(0, 3).map((s, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">{s}</Badge>
                              ))}
                              {trainer.specialties.length > 3 && (
                                <Badge variant="outline" className="text-xs">+{trainer.specialties.length - 3}</Badge>
                              )}
                            </div>
                          )}
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

      {/* Trainer Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          {selectedTrainer && (
            <>
              <DialogHeader>
                <DialogTitle>Detalle del Entrenador</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="relative h-28 w-28 rounded-lg overflow-hidden shrink-0 bg-primary/10 group">
                    {(selectedTrainer.photo || selectedTrainer.avatar) ? (
                      <img 
                        src={selectedTrainer.photo || selectedTrainer.avatar} 
                        alt={selectedTrainer.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <UserCog className="h-12 w-12 text-primary/40" />
                      </div>
                    )}
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
                      {isUploadingPhoto ? (
                        <Loader2 className="h-6 w-6 text-white animate-spin" />
                      ) : (
                        <>
                          <Camera className="h-6 w-6 text-white mb-1" />
                          <span className="text-white text-xs font-medium">Cambiar foto</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        disabled={isUploadingPhoto}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file && selectedTrainer) {
                            handleUploadTrainerPhoto(selectedTrainer.id, file)
                          }
                        }}
                      />
                    </label>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{selectedTrainer.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedTrainer.email}</p>
                    {selectedTrainer.phone && (
                      <p className="text-sm text-muted-foreground">{selectedTrainer.phone}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={selectedTrainer.status === 'active' ? 'bg-green-500/20 text-green-500 border-green-500/30' : ''}>
                        {selectedTrainer.status === 'active' ? 'Activo' : 'Inactivo'}
                      </Badge>
                      {selectedTrainer.experience && (
                        <Badge variant="outline">
                          <Clock className="h-3 w-3 mr-1" /> {selectedTrainer.experience}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                {selectedTrainer.bio && (
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-sm font-medium mb-1">Biografia</p>
                    <p className="text-sm text-muted-foreground">{selectedTrainer.bio}</p>
                  </div>
                )}
                
                {selectedTrainer.specialties.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2 flex items-center gap-1">
                      <Dumbbell className="h-4 w-4 text-primary" /> Especialidades
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedTrainer.specialties.map((s, i) => (
                        <Badge key={i} variant="secondary">{s}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedTrainer.certifications.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2 flex items-center gap-1">
                      <Award className="h-4 w-4 text-primary" /> Certificaciones
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedTrainer.certifications.map((c, i) => (
                        <Badge key={i} variant="outline">{c}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedTrainer.hourlyRate && (
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-sm font-medium mb-1">Tarifa por hora</p>
                    <p className="text-2xl font-bold text-primary">${selectedTrainer.hourlyRate} MXN</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
