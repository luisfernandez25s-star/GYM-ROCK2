'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Ingresa un email valido')
      return
    }
    if (password.length < 1) {
      setError('La contrasena es requerida')
      return
    }

    setIsLoading(true)
    const result = await login(email, password)
    if (result.success) {
      router.push('/dashboard')
    } else {
      setError(result.error || 'Error al iniciar sesión')
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/gym-bg.jpg"
          alt="Gym background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-red-950/70" />
      </div>

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 items-center justify-center p-12">
        <div className="max-w-md text-center">
          <Image src="/logo.png" alt="GYMROCK Logo" width={280} height={112} className="object-contain mx-auto mb-10 drop-shadow-2xl" style={{ width: 'auto', height: 'auto' }} />
          <h1 className="text-4xl font-bold text-white mb-4 text-balance">
            Transforma tu cuerpo,<br />
            <span className="text-red-500">transforma tu vida</span>
          </h1>
          <p className="text-lg text-gray-300">
            Únete a GYMROCK y descubre una experiencia fitness de primer nivel.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/">
              <Image src="/logo.png" alt="GYMROCK Logo" width={180} height={72} className="object-contain drop-shadow-xl" style={{ width: 'auto', height: 'auto' }} />
            </Link>
          </div>
          <Card className="border-white/10 bg-black/60 backdrop-blur-xl shadow-2xl">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl sm:text-3xl text-white">Bienvenido</CardTitle>
              <CardDescription className="text-base text-gray-400">Inicia sesión en tu cuenta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">{error}</div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <Input id="email" type="email" placeholder="tu@email.com" value={email}
                    onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} 
                    className="h-11 bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-red-500 focus:ring-red-500/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300">Contraseña</Label>
                  <div className="relative">
                    <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      required disabled={isLoading} 
                      className="pr-10 h-11 bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-red-500 focus:ring-red-500/20" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full h-11 text-base bg-red-600 hover:bg-red-700 text-white" disabled={isLoading}>
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Iniciando sesión...</> : 'Iniciar Sesión'}
                </Button>
              </form>
              <div className="text-center">
                <p className="text-sm text-gray-400">
                  ¿No tienes cuenta?{' '}
                  <Link href="/registro" className="text-red-500 hover:text-red-400 hover:underline font-medium">Regístrate</Link>
                </p>
              </div>

              {/* Demo Credentials */}
              <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
                <p className="text-center text-sm font-semibold text-white">Credenciales de Prueba:</p>
                
                {/* Admin Credentials */}
                <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 space-y-1">
                  <p className="text-xs font-semibold text-red-400">Admin</p>
                  <div className="space-y-0.5 text-xs text-gray-400 font-mono">
                    <p>Email: <span className="text-white">admin@gymrock.com</span></p>
                    <p>Pass: <span className="text-white">Admin123!</span></p>
                  </div>
                </div>

                {/* Usuario Credentials */}
                <div className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-1">
                  <p className="text-xs font-semibold text-white">Usuario</p>
                  <div className="space-y-0.5 text-xs text-gray-400 font-mono">
                    <p>Email: <span className="text-white">usuario@gymrock.com</span></p>
                    <p>Pass: <span className="text-white">Usuario123!</span></p>
                  </div>
                </div>

                {/* Entrenador Credentials */}
                <div className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-1">
                  <p className="text-xs font-semibold text-white">Entrenador</p>
                  <div className="space-y-0.5 text-xs text-gray-400 font-mono">
                    <p>Email: <span className="text-white">carlos@gymrock.com</span></p>
                    <p>Pass: <span className="text-white">CarlosGR2024!</span></p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
