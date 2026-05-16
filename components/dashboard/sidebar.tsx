'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Package,
  CalendarDays,
  ClipboardList,
  Settings,
  LogOut,
  User,
  BarChart3,
  UserCog,
  ChevronDown,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  roles: ('admin' | 'client' | 'trainer')[]
}

const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" />, roles: ['admin', 'client', 'trainer'] },
  { title: 'Mi Perfil', href: '/dashboard/perfil', icon: <User className="h-5 w-5" />, roles: ['client', 'trainer'] },
  { title: 'Mi Membresía', href: '/dashboard/membresia', icon: <CreditCard className="h-5 w-5" />, roles: ['client'] },
  { title: 'Mis Pagos', href: '/dashboard/pagos', icon: <CreditCard className="h-5 w-5" />, roles: ['client'] },
  { title: 'Entrenadores', href: '/dashboard/entrenadores', icon: <UserCog className="h-5 w-5" />, roles: ['client'] },
  { title: 'Mis Rutinas', href: '/dashboard/rutinas', icon: <ClipboardList className="h-5 w-5" />, roles: ['client'] },
  { title: 'Mis Clientes', href: '/dashboard/trainer/clientes', icon: <Users className="h-5 w-5" />, roles: ['trainer'] },
  { title: 'Rutinas', href: '/dashboard/admin/rutinas', icon: <ClipboardList className="h-5 w-5" />, roles: ['trainer'] },
  { title: 'Clientes', href: '/dashboard/admin/clientes', icon: <Users className="h-5 w-5" />, roles: ['admin'] },
  { title: 'Membresías', href: '/dashboard/admin/membresias', icon: <CreditCard className="h-5 w-5" />, roles: ['admin'] },
  { title: 'Pagos', href: '/dashboard/admin/pagos', icon: <CreditCard className="h-5 w-5" />, roles: ['admin'] },
  { title: 'Entrenadores', href: '/dashboard/admin/entrenadores', icon: <UserCog className="h-5 w-5" />, roles: ['admin'] },
  { title: 'Productos', href: '/dashboard/admin/productos', icon: <Package className="h-5 w-5" />, roles: ['admin'] },
  { title: 'Rutinas', href: '/dashboard/admin/rutinas', icon: <ClipboardList className="h-5 w-5" />, roles: ['admin'] },
  { title: 'Asistencia', href: '/dashboard/admin/asistencia', icon: <CalendarDays className="h-5 w-5" />, roles: ['admin'] },
  { title: 'Reportes', href: '/dashboard/admin/reportes', icon: <BarChart3 className="h-5 w-5" />, roles: ['admin'] },
  { title: 'Configuración', href: '/dashboard/configuracion', icon: <Settings className="h-5 w-5" />, roles: ['admin'] },
]

export function DashboardSidebar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  if (!user) return null

  const filteredItems = navItems.filter(item => item.roles.includes(user.role))
  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  const roleLabels = { admin: 'Administrador', client: 'Cliente', trainer: 'Entrenador' }

  const SidebarContent = () => (
    <>
      <div className="p-3 border-b border-sidebar-border flex items-center">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="GYMROCK Logo" width={48} height={48} className="object-contain w-12 h-12" />
        </Link>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {filteredItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                pathname === item.href
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </nav>
      </ScrollArea>

      <div className="p-4 border-t border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-sidebar-accent transition-colors">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground">{roleLabels[user.role]}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => { logout(); window.location.href = '/' }}
              className="text-destructive cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-sidebar border-b border-sidebar-border">
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="GYMROCK Logo" width={40} height={40} className="object-contain w-10 h-10" />
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(!isMobileOpen)} className="text-sidebar-foreground">
            {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
      )}

      <aside className={cn(
        'lg:hidden fixed top-[65px] left-0 bottom-0 z-50 w-72 bg-sidebar flex flex-col transition-transform duration-300',
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <SidebarContent />
      </aside>

      <aside className="hidden lg:flex fixed top-0 left-0 bottom-0 w-64 bg-sidebar flex-col border-r border-sidebar-border">
        <SidebarContent />
      </aside>
    </>
  )
}
