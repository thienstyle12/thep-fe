import type { Product, CartItem } from '../types';
export declare const useCartStore: import("pinia").StoreDefinition<"cart", Pick<{
    items: import("vue").Ref<{
        product: {
            id: number;
            name: string;
            sku?: string;
            category: string;
            specifications: string;
            unit: string;
            pricePerUnit: number;
            stockQuantity: number;
            description: string;
            badge: string;
            imageUrl: string;
        };
        quantity: number;
    }[], CartItem[] | {
        product: {
            id: number;
            name: string;
            sku?: string;
            category: string;
            specifications: string;
            unit: string;
            pricePerUnit: number;
            stockQuantity: number;
            description: string;
            badge: string;
            imageUrl: string;
        };
        quantity: number;
    }[]>;
    totalItemsCount: import("vue").ComputedRef<number>;
    totalPrice: import("vue").ComputedRef<number>;
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (productId: number) => void;
    clearCart: () => void;
}, "items">, Pick<{
    items: import("vue").Ref<{
        product: {
            id: number;
            name: string;
            sku?: string;
            category: string;
            specifications: string;
            unit: string;
            pricePerUnit: number;
            stockQuantity: number;
            description: string;
            badge: string;
            imageUrl: string;
        };
        quantity: number;
    }[], CartItem[] | {
        product: {
            id: number;
            name: string;
            sku?: string;
            category: string;
            specifications: string;
            unit: string;
            pricePerUnit: number;
            stockQuantity: number;
            description: string;
            badge: string;
            imageUrl: string;
        };
        quantity: number;
    }[]>;
    totalItemsCount: import("vue").ComputedRef<number>;
    totalPrice: import("vue").ComputedRef<number>;
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (productId: number) => void;
    clearCart: () => void;
}, "totalItemsCount" | "totalPrice">, Pick<{
    items: import("vue").Ref<{
        product: {
            id: number;
            name: string;
            sku?: string;
            category: string;
            specifications: string;
            unit: string;
            pricePerUnit: number;
            stockQuantity: number;
            description: string;
            badge: string;
            imageUrl: string;
        };
        quantity: number;
    }[], CartItem[] | {
        product: {
            id: number;
            name: string;
            sku?: string;
            category: string;
            specifications: string;
            unit: string;
            pricePerUnit: number;
            stockQuantity: number;
            description: string;
            badge: string;
            imageUrl: string;
        };
        quantity: number;
    }[]>;
    totalItemsCount: import("vue").ComputedRef<number>;
    totalPrice: import("vue").ComputedRef<number>;
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (productId: number) => void;
    clearCart: () => void;
}, "addToCart" | "removeFromCart" | "clearCart">>;
