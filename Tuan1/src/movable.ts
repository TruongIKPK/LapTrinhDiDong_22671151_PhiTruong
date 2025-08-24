// 29. Create an interface Movable with method move(). Implement it in Car and Robot.
interface Movable {
    move(): void;
}

export class Car implements Movable {
    move() {
        console.log("Car is moving");
    }
}

export class Robot implements Movable {
    move() {
        console.log("Robot is moving");
    }
}


