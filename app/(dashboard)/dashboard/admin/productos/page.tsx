'use client'

import { useState } from 'react'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { formatMXN } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Plus, Package, Search, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  isActive: boolean
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', stock: '', category: '' })

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProduct.name || !newProduct.price) {
      toast.error('Nombre y precio son requeridos')
      return
    }
    setIsSubmitting(true)
    // Simulate adding to local state
    const product: Product = {
      id: Math.random().toString(36).slice(2),
      name: newProduct.name,
      description: newProduct.description,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock) || 0,
      category: newProduct.category || 'General',
      isActive: true
    }
    setProducts(prev => [...prev, product])
    setNewProduct({ name: '', description: '', price: '', stock: '', category: '' })
    setIsDialogOpen(false)
    toast.success(`Producto "${product.name}" agregado`)
    setIsSubmitting(false)
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <main className="lg:pl-64 pt-[65px] lg:pt-0">
        <div className="p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold">Productos</h1>
              <p className="text-muted-foreground">Gestión de inventario y productos</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="mr-2 h-4 w-4" />Nuevo Producto</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Agregar Producto</DialogTitle>
                  <DialogDescription>Ingresa los datos del nuevo producto</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nombre *</Label>
                    <Input placeholder="Proteína Whey 1kg" value={newProduct.name}
                      onChange={(e) => setNewProduct(p => ({ ...p, name: e.target.value }))} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Descripción</Label>
                    <Input placeholder="Descripción del producto" value={newProduct.description}
                      onChange={(e) => setNewProduct(p => ({ ...p, description: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Precio (MXN) *</Label>
                      <Input type="number" placeholder="0.00" value={newProduct.price}
                        onChange={(e) => setNewProduct(p => ({ ...p, price: e.target.value }))} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Stock</Label>
                      <Input type="number" placeholder="0" value={newProduct.stock}
                        onChange={(e) => setNewProduct(p => ({ ...p, stock: e.target.value }))} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Categoría</Label>
                    <Input placeholder="Suplementos, Accesorios, Ropa..." value={newProduct.category}
                      onChange={(e) => setNewProduct(p => ({ ...p, category: e.target.value }))} />
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Agregar Producto'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar producto..." value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventario</CardTitle>
              <CardDescription>{filteredProducts.length} productos</CardDescription>
            </CardHeader>
            <CardContent>
              {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Package className="h-16 w-16 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Sin productos</h3>
                  <p className="text-muted-foreground mb-4">Agrega tus primeros productos al inventario</p>
                  <Button onClick={() => setIsDialogOpen(true)}><Plus className="mr-2 h-4 w-4" />Agregar producto</Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Precio</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-muted-foreground">{product.description}</p>
                            </div>
                          </TableCell>
                          <TableCell><Badge variant="outline">{product.category}</Badge></TableCell>
                          <TableCell>
                            <span className={product.stock < 5 ? 'text-red-500 font-medium' : ''}>{product.stock}</span>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Activo</Badge>
                          </TableCell>
                          <TableCell className="text-right font-semibold">{formatMXN(product.price)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
