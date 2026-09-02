import { getProduct } from "@/actions/product"
import { ProductForm } from "@/components/ProductForm"
import { notFound } from "next/navigation"

export default async function EditProductoPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  // Convert Decimal to number for the form
  const initialData = {
    ...product,
    costPrice: Number(product.costPrice),
    markupPercentage: Number(product.markupPercentage),
    cashPrice: Number(product.cashPrice),
    qrPrice: Number(product.qrPrice),
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Editar Producto</h1>
      <ProductForm initialData={initialData} />
    </div>
  )
}
