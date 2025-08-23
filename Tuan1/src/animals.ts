import { Flyable } from "./flyable";
import { Swimmable } from "./swimmable";

// 11. Create a base class Animal. Extend Dog and Cat classes with methods bark() and meow().
export class Animal {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
    sound(): void {
        console.log("Some animal sound");
    }
}

export class Dog extends Animal {
    constructor(name: string) {
        super(name);
    }
    bark(): void {
        console.log("Woof!");
    }
    sound(): void {
        this.bark();
    }
}

export class Cat extends Animal {
    constructor(name: string) {
        super(name);
    }
    meow(): void {
        console.log("Meow!");
    }
    sound(): void {
        this.meow();
    }
}

export class Bird extends Animal implements Flyable {
    constructor(name: string) {
        super(name);
    }

    chirp(): void {
        console.log("Chirp!");
    }

    sound(): void {
        this.chirp();
    }

    fly(): void {
        console.log(`${this.name} is flying!`);
    }
}

export class Fish extends Animal implements Swimmable {
    constructor(name: string) {
        super(name);
    }

    swim(): void {
        console.log(`${this.name} is swimming!`);
    }

    sound(): void {
        console.log("Blub blub!");
    }
}