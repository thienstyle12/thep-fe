import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
export const useCartStore = defineStore('cart', () => {
    const items = ref([]);
    const totalItemsCount = computed(() => {
        return items.value.reduce((sum, item) => sum + item.quantity, 0);
    });
    const totalPrice = computed(() => {
        return items.value.reduce((sum, item) => sum + (item.product.pricePerUnit * item.quantity), 0);
    });
    function addToCart(product, quantity = 1) {
        const existing = items.value.find(i => i.product.id === product.id);
        if (existing) {
            existing.quantity += quantity;
        }
        else {
            items.value.push({ product, quantity });
        }
    }
    function removeFromCart(productId) {
        items.value = items.value.filter(i => i.product.id !== productId);
    }
    function clearCart() {
        items.value = [];
    }
    return { items, totalItemsCount, totalPrice, addToCart, removeFromCart, clearCart };
});
