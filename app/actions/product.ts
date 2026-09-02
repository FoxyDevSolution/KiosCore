"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { Category } from "@prisma/client"

export async function createProduct(data: {
  barcode: string
  name: string
  category: Category
  costPrice: number
  markupPercentage: number
  cashPrice: number
  qrPrice: number
  stock: number
  minStock: number
}) {
  await prisma.product.create({
    data: {
      ...data,
      costPrice: data.costPrice.toString(),
      markupPercentage: data.markupPercentage.toString(),
      cashPrice: data.cashPrice.toString(),
      qrPrice: data.qrPrice.toString(),
    },
  })
  revalidatePath("/inventario")
}

export async function updateProduct(id: string, data: {
  barcode: string
  name: string
  category: Category
  costPrice: number
  markupPercentage: number
  cashPrice: number
  qrPrice: number
  stock: number
  minStock: number
}) {
  await prisma.product.update({
    where: { id },
    data: {
      ...data,
      costPrice: data.costPrice.toString(),
      markupPercentage: data.markupPercentage.toString(),
      cashPrice: data.cashPrice.toString(),
      qrPrice: data.qrPrice.toString(),
    },
  })
  revalidatePath("/inventario")
}

export async function getProducts() {
  return await prisma.product.findMany()
}

export async function getProduct(id: string) {
  return await prisma.product.findUnique({ where: { id } })
}
