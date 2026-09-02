import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculatePrice(cost: number, markup: number, roundTo: number = 10): number {
  const price = cost * (1 + markup / 100)
  return Math.ceil(price / roundTo) * roundTo
}
