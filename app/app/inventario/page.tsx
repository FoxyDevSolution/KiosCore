import { getProducts } from "@/actions/product"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function InventarioPage() {
  const products = await getProducts()

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Inventario</h1>
        <Link href="/inventario/nuevo" className="bg-black text-white px-4 py-2 rounded">
          Nuevo Producto
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Código</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.barcode}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>${product.cashPrice.toString()}</TableCell>
              <TableCell>
                <Link href={`/inventario/${product.id}/edit`} className="text-blue-500 hover:underline">
                  Editar
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
