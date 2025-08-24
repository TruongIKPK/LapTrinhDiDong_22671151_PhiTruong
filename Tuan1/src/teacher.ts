// 27. Create a class Teacher that extends Person. Add subject attribute and introduce method.

import { Person } from "./person";

export class Teacher extends Person {
    subject: string;
    
    constructor(name: string, age: number, subject: string) {
        super(name, age);
        this.subject = subject;
    }
    
    introduce() {
        console.log(`Giao vien ${this.name} tuoi ${this.age} mon ${this.subject}.`);
    }
}

