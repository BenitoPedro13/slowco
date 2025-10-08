# Slow Company Storefront

Next.js + AlignUI storefront preparado para integrar com a Shopify Storefront API. Já inclui páginas bases (home, catálogo, coleções, artistas, contato) com o visual escuro da marca e fallback de produtos para desenvolvimento offline.

## Stack

- Next.js 15 App Router & React Server Components
- Tailwind/AlignUI (componentes já prontos dentro de `src/components/ui`)
- Shopify Storefront GraphQL API (via fetch server-side)

## Como rodar localmente

```bash
pnpm install
cp .env.example .env.local   # ajuste com as credenciais reais da Shopify
pnpm dev
```

> Enquanto as variáveis de ambiente não estiverem configuradas, o site usa produtos de demonstração definidos em `src/data/sample-products.ts`.

## Configurando a Shopify

1. Crie uma loja Shopify (pode ser trial) e habilite o canal Storefront API.
2. Em *Settings → Apps and sales channels → Develop apps*, gere uma Storefront Access Token.
3. Preencha as variáveis no `.env.local`:

```
SHOPIFY_STORE_DOMAIN=seu-loja.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=token_gerado
SHOPIFY_API_VERSION=2024-10
```

4. Crie collections na Shopify com os handles:
   - `produtos` (catálogo geral)
   - `apparel`
   - `merch`
   - `new-drop`
5. Publique os produtos nessas collections para que apareçam nas respectivas páginas do site.

> Se preferir outros handles, atualize os arquivos em `src/app/*/page.tsx`.

## Estrutura de pastas principal

- `src/app/` — rotas (home, contato, artistas, coleções)
- `src/components/layout/` — header, footer e shell global
- `src/components/sections/` — blocos de seção usados na home
- `src/components/product/` — cards e grid de produtos
- `src/lib/shopify.ts` — cliente GraphQL da Shopify
- `src/lib/shopify-data.ts` — helpers com fallback para dados de exemplo
- `src/data/sample-products.ts` — produtos mockados

## Próximos passos sugeridos

- Implementar carrinho e checkout usando o Storefront Cart API + Shopify Checkout URL.
- Conectar blog/artistas a um CMS (Notion, Sanity ou o Blog da Shopify).
- Configurar analytics e pixels (Meta, TikTok, GA4) no layout.
- Adicionar recomendações ou produtos relacionados na página de produto.
- Implantar no Vercel ou infraestrutura equivalente (ajusta as envs no painel).
