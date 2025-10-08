"use client";

import { useFormStatus } from "react-dom";
import * as Button from "@/components/ui/button";

type AddToCartSubmitProps = {
  disabled?: boolean;
};

export function AddToCartSubmit({ disabled }: AddToCartSubmitProps) {
  const { pending } = useFormStatus();

  return (
    <Button.Root
      variant="primary"
      mode="filled"
      size="medium"
      className="w-full bg-white text-black hover:bg-white/90"
      type="submit"
      disabled={disabled || pending}
    >
      {pending ? "Adicionando..." : "Adicionar ao carrinho"}
    </Button.Root>
  );
}
