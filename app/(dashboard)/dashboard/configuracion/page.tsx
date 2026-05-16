'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { 
  Settings, Globe, Share2, Building2, User, Save, Loader2,
  Facebook, Instagram, Twitter, Youtube, MessageCircle, MapPin, Phone, Mail
} from 'lucide-react'
import { toast } from 'sonner'

interface SiteConfig {
  gymName: string
  address: string
  phone: string
  email: string
  welcomeTitle: string
  welcomeSubtitle: string
  aboutText: string
  schedule: string
  googleMapsUrl: string
  showTestimonials: boolean
  showTrainers: boolean
  showPricing: boolean
}

interface SocialLinks {
  facebook: string
  instagram: string
  twitter: string
  youtube: string
  whatsapp: string
  tiktok: string
}

const defaultConfig: SiteConfig = {
  gymName: 'GYMROCK',
  address: '',
  phone: '',
  email: '',
  welcomeTitle: 'Transforma tu cuerpo, transforma tu vida',
  welcomeSubtitle: 'El gimnasio mas completo de la ciudad con entrenadores certificados y equipo de ultima generacion.',
  aboutText: 'En GYMROCK nos dedicamos a ayudarte a alcanzar tus metas de fitness con instalaciones de primera y entrenadores profesionales.',
  schedule: 'Lunes a Viernes: 6:00 AM - 10:00 PM\nSabados: 7:00 AM - 8:00 PM\nDomingos: 8:00 AM - 2:00 PM',
  googleMapsUrl: '',
  showTestimonials: true,
  showTrainers: true,
  showPricing: true,
}

const defaultSocial: SocialLinks = {
  facebook: '',
  instagram: '',
  twitter: '',
  youtube: '',
  whatsapp: '',
  tiktok: '',
}

export default function ConfiguracionPage() {
  const { user } = useAuth()
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(defaultConfig)
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(defaultSocial)
  const [isSaving, setIsSaving] = useState(false)
  const [adminName, setAdminName] = useState('')

  useEffect(() => {
    if (user) {
      setAdminName(user.name)
    }
    // Load saved config from localStorage for demo purposes
    const savedConfig = localStorage.getItem('gymrock_site_config')
    const savedSocial = localStorage.getItem('gymrock_social_links')
    if (savedConfig) {
      try { setSiteConfig(JSON.parse(savedConfig)) } catch { /* ignore */ }
    }
    if (savedSocial) {
      try { setSocialLinks(JSON.parse(savedSocial)) } catch { /* ignore */ }
    }
  }, [user])

  if (!user) return null

  const handleSaveSite = async () => {
    setIsSaving(true)
    // Simulate save
    await new Promise(r => setTimeout(r, 800))
    localStorage.setItem('gymrock_site_config', JSON.stringify(siteConfig))
    setIsSaving(false)
    toast.success('Configuracion del sitio guardada correctamente')
  }

  const handleSaveSocial = async () => {
    setIsSaving(true)
    await new Promise(r => setTimeout(r, 800))
    localStorage.setItem('gymrock_social_links', JSON.stringify(socialLinks))
    setIsSaving(false)
    toast.success('Redes sociales guardadas correctamente')
  }

  const handleSaveAdmin = async () => {
    setIsSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setIsSaving(false)
    toast.success('Perfil actualizado correctamente')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-red-950/20">
      <DashboardSidebar />
      <main className="lg:pl-64 pt-[65px] lg:pt-0">
        <div className="p-6 lg:p-8 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">{"Configuracion"} <span className="text-primary">del Sistema</span></h1>
            <p className="text-muted-foreground">{"Administra la informacion del sitio web, redes sociales y tu cuenta"}</p>
          </div>

          <Tabs defaultValue="sitio" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="sitio" className="flex items-center gap-2">
                <Globe className="h-4 w-4" /> Sitio Web
              </TabsTrigger>
              <TabsTrigger value="redes" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" /> Redes Sociales
              </TabsTrigger>
              <TabsTrigger value="cuenta" className="flex items-center gap-2">
                <User className="h-4 w-4" /> Mi Cuenta
              </TabsTrigger>
            </TabsList>

            {/* Site Content Tab */}
            <TabsContent value="sitio" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    {"Informacion del Gimnasio"}
                  </CardTitle>
                  <CardDescription>{"Datos generales que se muestran en la pagina principal"}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gym-name">Nombre del gimnasio</Label>
                      <Input 
                        id="gym-name"
                        value={siteConfig.gymName}
                        onChange={(e) => setSiteConfig(prev => ({ ...prev, gymName: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gym-email" className="flex items-center gap-1">
                        <Mail className="h-3 w-3" /> Email de contacto
                      </Label>
                      <Input 
                        id="gym-email"
                        type="email"
                        placeholder="info@gymrock.mx"
                        value={siteConfig.email}
                        onChange={(e) => setSiteConfig(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gym-phone" className="flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {"Telefono"}
                      </Label>
                      <Input 
                        id="gym-phone"
                        placeholder="+52 55 1234 5678"
                        value={siteConfig.phone}
                        onChange={(e) => setSiteConfig(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gym-address" className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {"Direccion"}
                      </Label>
                      <Input 
                        id="gym-address"
                        placeholder="Av. Reforma 500, Col. Juarez, CDMX"
                        value={siteConfig.address}
                        onChange={(e) => setSiteConfig(prev => ({ ...prev, address: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gym-maps">URL de Google Maps</Label>
                    <Input 
                      id="gym-maps"
                      placeholder="https://maps.google.com/..."
                      value={siteConfig.googleMapsUrl}
                      onChange={(e) => setSiteConfig(prev => ({ ...prev, googleMapsUrl: e.target.value }))}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    {"Contenido de la Pagina Principal"}
                  </CardTitle>
                  <CardDescription>{"Personaliza los textos que se muestran en tu sitio web"}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="welcome-title">{"Titulo de bienvenida"}</Label>
                    <Input 
                      id="welcome-title"
                      placeholder="Transforma tu cuerpo, transforma tu vida"
                      value={siteConfig.welcomeTitle}
                      onChange={(e) => setSiteConfig(prev => ({ ...prev, welcomeTitle: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="welcome-sub">{"Subtitulo"}</Label>
                    <Textarea 
                      id="welcome-sub"
                      placeholder="El gimnasio mas completo..."
                      value={siteConfig.welcomeSubtitle}
                      onChange={(e) => setSiteConfig(prev => ({ ...prev, welcomeSubtitle: e.target.value }))}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="about-text">{"Texto 'Sobre Nosotros'"}</Label>
                    <Textarea 
                      id="about-text"
                      placeholder="En GYMROCK nos dedicamos..."
                      value={siteConfig.aboutText}
                      onChange={(e) => setSiteConfig(prev => ({ ...prev, aboutText: e.target.value }))}
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="schedule">Horarios</Label>
                    <Textarea 
                      id="schedule"
                      placeholder="Lunes a Viernes: 6:00 AM - 10:00 PM"
                      value={siteConfig.schedule}
                      onChange={(e) => setSiteConfig(prev => ({ ...prev, schedule: e.target.value }))}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    {"Secciones Visibles"}
                  </CardTitle>
                  <CardDescription>{"Controla que secciones se muestran en la pagina principal"}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div>
                      <p className="text-sm font-medium">{"Mostrar testimonios"}</p>
                      <p className="text-xs text-muted-foreground">{"Seccion de resenas de clientes"}</p>
                    </div>
                    <Switch
                      checked={siteConfig.showTestimonials}
                      onCheckedChange={(v) => setSiteConfig(prev => ({ ...prev, showTestimonials: v }))}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div>
                      <p className="text-sm font-medium">Mostrar entrenadores</p>
                      <p className="text-xs text-muted-foreground">{"Seccion del equipo de entrenadores"}</p>
                    </div>
                    <Switch
                      checked={siteConfig.showTrainers}
                      onCheckedChange={(v) => setSiteConfig(prev => ({ ...prev, showTrainers: v }))}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div>
                      <p className="text-sm font-medium">Mostrar precios</p>
                      <p className="text-xs text-muted-foreground">{"Seccion de planes y membresias"}</p>
                    </div>
                    <Switch
                      checked={siteConfig.showPricing}
                      onCheckedChange={(v) => setSiteConfig(prev => ({ ...prev, showPricing: v }))}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={handleSaveSite} disabled={isSaving} className="bg-red-600 hover:bg-red-700 text-white">
                  {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Guardando...</> : <><Save className="mr-2 h-4 w-4" />Guardar Configuracion</>}
                </Button>
              </div>
            </TabsContent>

            {/* Social Media Tab */}
            <TabsContent value="redes" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-primary" />
                    Redes Sociales
                  </CardTitle>
                  <CardDescription>
                    {"Agrega los links de tus redes sociales para que se muestren en la pagina web y el footer"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="social-fb" className="flex items-center gap-2">
                      <Facebook className="h-4 w-4 text-blue-600" /> Facebook
                    </Label>
                    <Input 
                      id="social-fb"
                      placeholder="https://facebook.com/gymrock"
                      value={socialLinks.facebook}
                      onChange={(e) => setSocialLinks(prev => ({ ...prev, facebook: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="social-ig" className="flex items-center gap-2">
                      <Instagram className="h-4 w-4 text-pink-500" /> Instagram
                    </Label>
                    <Input 
                      id="social-ig"
                      placeholder="https://instagram.com/gymrock"
                      value={socialLinks.instagram}
                      onChange={(e) => setSocialLinks(prev => ({ ...prev, instagram: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="social-tw" className="flex items-center gap-2">
                      <Twitter className="h-4 w-4 text-sky-500" /> Twitter / X
                    </Label>
                    <Input 
                      id="social-tw"
                      placeholder="https://twitter.com/gymrock"
                      value={socialLinks.twitter}
                      onChange={(e) => setSocialLinks(prev => ({ ...prev, twitter: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="social-yt" className="flex items-center gap-2">
                      <Youtube className="h-4 w-4 text-red-600" /> YouTube
                    </Label>
                    <Input 
                      id="social-yt"
                      placeholder="https://youtube.com/@gymrock"
                      value={socialLinks.youtube}
                      onChange={(e) => setSocialLinks(prev => ({ ...prev, youtube: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="social-wa" className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-green-500" /> WhatsApp
                    </Label>
                    <Input 
                      id="social-wa"
                      placeholder="https://wa.me/5255123456789"
                      value={socialLinks.whatsapp}
                      onChange={(e) => setSocialLinks(prev => ({ ...prev, whatsapp: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="social-tt" className="flex items-center gap-2">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.3 0 .58.05.86.12V9.01a6.27 6.27 0 0 0-.86-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.68a8.2 8.2 0 0 0 4.78 1.53V6.76a4.82 4.82 0 0 1-1.02-.07z"/></svg>
                      TikTok
                    </Label>
                    <Input 
                      id="social-tt"
                      placeholder="https://tiktok.com/@gymrock"
                      value={socialLinks.tiktok}
                      onChange={(e) => setSocialLinks(prev => ({ ...prev, tiktok: e.target.value }))}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={handleSaveSocial} disabled={isSaving} className="bg-red-600 hover:bg-red-700 text-white">
                  {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Guardando...</> : <><Save className="mr-2 h-4 w-4" />Guardar Redes Sociales</>}
                </Button>
              </div>
            </TabsContent>

            {/* Account Tab */}
            <TabsContent value="cuenta" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Cuenta de Administrador
                  </CardTitle>
                  <CardDescription>{"Informacion de tu cuenta de administrador"}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-name">Nombre</Label>
                      <Input 
                        id="admin-name"
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-email">Email</Label>
                      <Input 
                        id="admin-email"
                        type="email"
                        defaultValue={user.email}
                        disabled
                        className="opacity-60"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-role">Rol</Label>
                    <Input 
                      id="admin-role"
                      defaultValue="Administrador"
                      disabled
                      className="opacity-60"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{"Cambiar Contrasena"}</CardTitle>
                  <CardDescription>{"Actualiza tu contrasena de acceso"}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-pass">{"Contrasena actual"}</Label>
                    <Input id="current-pass" type="password" placeholder="********" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-pass">{"Nueva contrasena"}</Label>
                      <Input id="new-pass" type="password" placeholder="********" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-pass">{"Confirmar contrasena"}</Label>
                      <Input id="confirm-pass" type="password" placeholder="********" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {"Minimo 8 caracteres, incluir mayuscula, minuscula, numero y caracter especial"}
                  </p>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={handleSaveAdmin} disabled={isSaving} className="bg-red-600 hover:bg-red-700 text-white">
                  {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Guardando...</> : <><Save className="mr-2 h-4 w-4" />Actualizar Perfil</>}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
