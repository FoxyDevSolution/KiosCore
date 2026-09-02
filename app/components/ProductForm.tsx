"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createProduct, updateProduct } from "@/actions/product"
import { calculatePrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Category } from "@prisma/client"

interface ProductFormProps {
  initialData?: any
}

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState(initialData || {
    barcode: "",
    name: "",
    category: Category.KIOSCO,
    costPrice: 0,
    markupPercentage: 60,
    cashPrice: 0,
    qrPrice: 0,
    stock: 0,
    minStock: 0,
  })

  useEffect(() => {
    const newCashPrice = calculatePrice(formData.costPrice, formData.markupPercentage)
    const newQrPrice = newCashPrice * 1.05 
    setFormData(prev => ({ ...prev, cashPrice: newCashPrice, qrPrice: newQrPrice }))
  }, [formData.costPrice, formData.markupPercentage])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (initialData) {
      await updateProduct(initialData.id, formData)
    } else {
      await createProduct(formData)
    }
    router.push("/inventario")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <Label>Nombre</Label>
        <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
      </div>
      <div>
        <Label>Costo</Label>
        <Input type="number" value={formData.costPrice} onChange={e => setFormData({...formData, costPrice: parseFloat(e.target.value)})} required />
      </div>
      <div>
        <Label>Margen (%)</Label>
        <Input type="number" value={formData.markupPercentage} onChange={e => setFormData({...formData, markupPercentage: parseFloat(e.target.value)})} required />
      </div>
      <div className="p-4 bg-slate-100 rounded">
        <p>Precio Sugerido (Efectivo): ${formData.cashPrice}</p>
        <p>Precio Sugerido (QR): ${formData.qrPrice}</p>
      </div>
      <Button type="submit">{initialData ? "Actualizar" : "Guardar"} Producto</Button>
    </form>
  )
}
