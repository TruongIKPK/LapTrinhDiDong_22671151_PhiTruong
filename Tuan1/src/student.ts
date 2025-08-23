// 2. Write a class Student extending Person with an additional attribute grade. Add a method to
// display all info.
import { Person } from "./person";

export class Student extends Person{
    grade: number;
    constructor(name: string, age: number, grade: number){
        super(name, age);
        this.grade = grade;
    }
    display(): void {
        console.log(`Name: ${this.name}, Age: ${this.age}, Grade: ${this.grade}`);
    }
}