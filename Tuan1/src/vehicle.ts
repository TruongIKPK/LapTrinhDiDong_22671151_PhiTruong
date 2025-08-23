// 20. Write a Vehicle interface and implement it in Car and Bike classes.

interface Vehicle {
    drive(): void;
}

export class Car implements Vehicle {
    drive(): void {
        console.log("Car is driving");
    }
}

export class Bike implements Vehicle {
    drive(): void {
        console.log("Bike is riding");
    }
}