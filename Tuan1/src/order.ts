// 26. Create a class Order with list of products. Add method to calculate total price.

import { Product } from "./product";

export class Order {
    private products: Product[] = [];
    
    addProduct(product: Product) {
        this.products.push(product);
    }
    
    calculateTotalPrice() {
        return this.products.reduce((total, product) => total + product.price, 0);
    }
}