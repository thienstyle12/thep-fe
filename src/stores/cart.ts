import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Product, CartItem } from '../types';

export const useCartStore = defineStore('cart', () => {
    const items = ref<CartItem[]>([]);

    const totalItemsCount = computed(() => {
        return items.value.reduce((sum, item) => sum + item.quantity, 0);
    });

    const totalPrice = computed(() => {
        return items.value.reduce((sum, item) => sum + (item.product.pricePerUnit * item.quantity), 0);
    });

    function addToCart(product: Product, quantity = 1) {
        const existing = items.value.find(i => i.product.id === product.id);
        if (existing) {
            existing.quantity += quantity;
        } else {
            items.value.push({ product, quantity });
        }
    }

    function removeFromCart(productId: number) {
        items.value = items.value.filter(i => i.product.id !== productId);
    }

    function clearCart() {
        items.value = [];
    }

    return { items, totalItemsCount, totalPrice, addToCart, removeFromCart, clearCart };
});