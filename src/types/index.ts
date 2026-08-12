export interface Product {
    id: number;
    name: string;
    category: string;
    specifications: string;
    unit: string;
    pricePerUnit: number;
    stockQuantity: number;
    description: string;
    badge: string;
    imageUrl: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface CreateOrderPayload {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    shippingAddress: string;
    note?: string;
    items: {
        productId: number;
        quantity: number;
    }[];
}