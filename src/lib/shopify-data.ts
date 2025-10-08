import { sampleProducts } from "@/data/sample-products";
import { sampleProductDetails } from "@/data/sample-product-details";
import {
  envHasShopifyConfig,
  getFeaturedProducts,
  getCollectionProducts,
  getProductByHandle,
} from "./shopify";

export async function getFeaturedProductsWithFallback() {
  if (!envHasShopifyConfig()) {
    return { products: sampleProducts, isFallback: true };
  }

  try {
    const products = await getFeaturedProducts();
    return { products, isFallback: false };
  } catch (error) {
    console.warn("Failed to load Shopify featured products", error);
    return { products: sampleProducts, isFallback: true };
  }
}

export async function getProductWithFallback(handle: string) {
  if (!envHasShopifyConfig()) {
    return {
      product: sampleProductDetails[handle] ?? null,
      isFallback: true,
    };
  }

  try {
    const product = await getProductByHandle(handle);

    if (!product) {
      return { product: null, isFallback: false };
    }

    return { product, isFallback: false };
  } catch (error) {
    console.warn("Failed to load Shopify product", error);
    return {
      product: sampleProductDetails[handle] ?? null,
      isFallback: true,
    };
  }
}

export async function getCollectionWithFallback(handle: string, limit = 24) {
  if (!envHasShopifyConfig()) {
    return {
      collection: {
        id: `fallback-${handle}`,
        title: "Coleção Slow",
        description:
          "Dados de exemplo. Configure as credenciais da Shopify para listar os produtos reais.",
        products: { nodes: sampleProducts },
      },
      isFallback: true,
    };
  }

  try {
    const collection = await getCollectionProducts(handle, limit);
    if (!collection) {
      return {
        collection: {
          id: `fallback-${handle}`,
          title: "Coleção não encontrada",
          description:
            "Não encontramos a coleção na Shopify. Verifique o handle informado.",
          products: { nodes: [] },
        },
        isFallback: false,
      };
    }

    return { collection, isFallback: false };
  } catch (error) {
    console.warn("Failed to load Shopify collection", error);
    return {
      collection: {
        id: `fallback-${handle}`,
        title: "Coleção Slow",
        description:
          "Dados de exemplo. Configure as credenciais da Shopify para listar os produtos reais.",
        products: { nodes: sampleProducts },
      },
      isFallback: true,
    };
  }
}
