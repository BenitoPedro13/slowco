"use server";

import { addToCart } from "@/lib/cart";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addToCartAction(formData: FormData) {
  const variantId = formData.get("variantId");
  const quantityRaw = formData.get("quantity");

  if (typeof variantId !== "string" || variantId.length === 0) {
    throw new Error("variantId is required");
  }

  const quantity =
    typeof quantityRaw === "string" && !Number.isNaN(Number.parseInt(quantityRaw, 10))
      ? Math.max(1, Number.parseInt(quantityRaw, 10))
      : 1;

  await addToCart(variantId, quantity);

  revalidatePath("/carrinho");
  redirect("/carrinho");
}
