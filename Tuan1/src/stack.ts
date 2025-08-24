// 22. Create a class Stack with push, pop, peek, isEmpty methods.

export class Stack {
    private items: any[] = [];
    
    push(item: any) {
        this.items.push(item);
    }
    
    pop() {
        return this.items.pop();
    }
    
    peek() {
        return this.items[this.items.length - 1];
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
}