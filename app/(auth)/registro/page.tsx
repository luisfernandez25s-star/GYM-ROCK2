'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'

function PasswordChecklist({ password }: { password: string }) {
  const rules = [
    { label: 'Minimo 8 caracteres', met: password.length >= 8 },
    { label: '1 letra mayuscula', met: /[A-Z]/.test(password) },
    { label: '1 letra minuscula', met: /[a-z]/.test(password) },
    { label: '1 numero', met: /[0-9]/.test(password) },
    { label: '1 caracter especial (!@#$%...)', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ]

  if (!password) return null

  return (
    <div className="space-y-1 pt-1">
      {rules.map((rule) => (
        <div key={rule.label} className="flex items-center gap-2">
          {rule.met ? (
            <Check className="h-3 w-3 text-green-400 shrink-0" />
          ) : (
            <X className="h-3 w-3 text-red-400 shrink-0" />
          )}
          <span className={`text-xs ${rule.met ? 'text-green-400' : 'text-red-400'}`}>
            {rule.label}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function RegistroPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const { register } = useAuth()
  const router = useRouter()

  const validateEmail = (val: string): string | null => {
    if (!val) return 'El email es requerido'
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!re.test(val)) return 'Ingresa un email valido (ej: usuario@correo.com)'
    return null
  }

  const validatePhone = (val: string): string | null => {
    if (!val) return null
    const cleaned = val.replace(/[\s\-\(\)]/g, '')
    if (!/^\+?\d{10,15}$/.test(cleaned)) return 'Telefono invalido (10 digitos minimo, ej: 5512345678)'
    return null
  }

  const validatePassword = (val: string): string | null => {
    if (!val) return 'La contrasena es requerida'
    if (val.length < 8) return 'Minimo 8 caracteres'
    if (!/[A-Z]/.test(val)) return 'Falta una mayuscula'
    if (!/[a-z]/.test(val)) return 'Falta una minuscula'
    if (!/[0-9]/.test(val)) return 'Falta un numero'
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(val)) return 'Falta un caracter especial'
    return null
  }

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const errors = { ...fieldErrors }
    if (field === 'name' && !name.trim()) errors.name = 'El nombre es requerido'
    else if (field === 'name') delete errors.name
    if (field === 'email') {
      const err = validateEmail(email)
      if (err) errors.email = err; else delete errors.email
    }
    if (field === 'phone') {
      const err = validatePhone(phone)
      if (err) errors.phone = err; else delete errors.phone
    }
    if (field === 'password') {
      const err = validatePassword(password)
      if (err) errors.password = err; else delete errors.password
    }
    setFieldErrors(errors)
  }

  const isEmailValid = !validateEmail(email)
  const isPhoneValid = !phone || !validatePhone(phone)
  const isPasswordValid = !validatePassword(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const errors: Record<string, string> = {}

    if (!name.trim()) errors.name = 'El nombre es requerido'
    const emailErr = validateEmail(email)
    if (emailErr) errors.email = emailErr
    const phoneErr = validatePhone(phone)
    if (phoneErr) errors.phone = phoneErr
    const passErr = validatePassword(password)
    if (passErr) errors.password = passErr

    setFieldErrors(errors)
    setTouched({ name: true, email: true, phone: true, password: true })
    if (Object.keys(errors).length > 0) return
    
    setIsLoading(true)
    const result = await register(email, password, name, phone)
    if (result.success) {
      router.push('/dashboard')
    } else {
      setError(result.error || 'Error al registrarse')
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative">
      <div className="absolute inset-0 z-0">
        <Image src="/gym-bg.jpg" alt="Gym background" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-bl from-black/90 via-black/80 to-red-950/70" />
      </div>

      <div className="hidden lg:flex lg:w-1/2 relative z-10 items-center justify-center p-12">
        <div className="max-w-md text-center">
          <Image src="/logo.png" alt="GYMROCK Logo" width={280} height={112} className="object-contain mx-auto mb-10 drop-shadow-2xl" style={{ width: 'auto', height: 'auto' }} />
          <h1 className="text-4xl font-bold text-white mb-4 text-balance">
            {"Unete a la familia"}<br />
            <span className="text-red-500">GYMROCK</span>
          </h1>
          <p className="text-lg text-gray-300">
            Crea tu cuenta y empieza tu transformacion hoy mismo.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/">
              <Image src="/logo.png" alt="GYMROCK Logo" width={180} height={72} className="object-contain drop-shadow-xl" style={{ width: 'auto', height: 'auto' }} />
            </Link>
          </div>
          <Card className="border-white/10 bg-black/60 backdrop-blur-xl shadow-2xl">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl sm:text-3xl text-white">Crear Cuenta</CardTitle>
              <CardDescription className="text-base text-gray-400">{"Registrate en GYMROCK"}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">{error}</div>
                )}

                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">Nombre completo</Label>
                  <Input id="name" placeholder="Nombre Completo" value={name}
                    onChange={(e) => { setName(e.target.value); if (fieldErrors.name) setFieldErrors(prev => ({ ...prev, name: '' })) }}
                    onBlur={() => handleBlur('name')}
                    disabled={isLoading}
                    className={`h-11 bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-red-500 focus:ring-red-500/20 ${touched.name && fieldErrors.name ? 'border-red-500' : touched.name && name.trim() ? 'border-green-500' : ''}`} />
                  {touched.name && fieldErrors.name && <p className="text-xs text-red-400">{fieldErrors.name}</p>}
                  {touched.name && name.trim() && !fieldErrors.name && <p className="text-xs text-green-400 flex items-center gap-1"><Check className="h-3 w-3" /> Nombre valido</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <Input id="email" type="email" placeholder="tu@email.com" value={email}
                    onChange={(e) => { setEmail(e.target.value); if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: '' })) }}
                    onBlur={() => handleBlur('email')}
                    disabled={isLoading}
                    className={`h-11 bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-red-500 focus:ring-red-500/20 ${touched.email && fieldErrors.email ? 'border-red-500' : touched.email && isEmailValid ? 'border-green-500' : ''}`} />
                  {touched.email && fieldErrors.email && <p className="text-xs text-red-400">{fieldErrors.email}</p>}
                  {touched.email && isEmailValid && <p className="text-xs text-green-400 flex items-center gap-1"><Check className="h-3 w-3" /> Email valido</p>}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-300">{"Telefono (opcional)"}</Label>
                  <Input id="phone" placeholder="+52 55 0000 0000" value={phone}
                    onChange={(e) => { setPhone(e.target.value); if (fieldErrors.phone) setFieldErrors(prev => ({ ...prev, phone: '' })) }}
                    onBlur={() => handleBlur('phone')}
                    disabled={isLoading}
                    className={`h-11 bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-red-500 focus:ring-red-500/20 ${touched.phone && fieldErrors.phone ? 'border-red-500' : touched.phone && phone && isPhoneValid ? 'border-green-500' : ''}`} />
                  {touched.phone && fieldErrors.phone && <p className="text-xs text-red-400">{fieldErrors.phone}</p>}
                  {touched.phone && phone && isPhoneValid && <p className="text-xs text-green-400 flex items-center gap-1"><Check className="h-3 w-3" /> Telefono valido</p>}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300">{"Contrasena"}</Label>
                  <div className="relative">
                    <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: '' })) }}
                      onBlur={() => handleBlur('password')}
                      disabled={isLoading}
                      className={`pr-10 h-11 bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-red-500 focus:ring-red-500/20 ${touched.password && fieldErrors.password ? 'border-red-500' : touched.password && isPasswordValid ? 'border-green-500' : ''}`} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <PasswordChecklist password={password} />
                  {touched.password && isPasswordValid && <p className="text-xs text-green-400 flex items-center gap-1"><Check className="h-3 w-3" /> Contrasena segura</p>}
                </div>

                <Button type="submit" className="w-full h-11 text-base bg-red-600 hover:bg-red-700 text-white" disabled={isLoading}>
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Registrando...</> : 'Crear Cuenta'}
                </Button>
              </form>
              <div className="text-center">
                <p className="text-sm text-gray-400">
                  {"Ya tienes cuenta? "}
                  <Link href="/login" className="text-red-500 hover:text-red-400 hover:underline font-medium">Inicia Sesion</Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
