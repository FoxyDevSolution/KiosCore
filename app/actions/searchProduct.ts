"use server"

import { prisma } from "@/lib/prisma"

export async function searchProductByBarcode(barcode: string) {
  return await prisma.product.findUnique({
    where: { barcode },
  })
}
