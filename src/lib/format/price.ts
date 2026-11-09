// P-PRECO format (docs/01-BRAND-BOOK.md rule 10): "R$ 1.299,90", plain space after R$.

const number = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function formatPrice(cents: number): string {
  return `R$ ${number.format(cents / 100)}`;
}
