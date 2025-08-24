// 24. Create an abstract class Appliance with method turnOn(). Implement Fan and AirConditioner.

abstract class Appliance {
    abstract turnOn(): void;
}

export class Fan extends Appliance {
    turnOn() {
        console.log("Fan is on");
    }
}

export class AirConditioner extends Appliance {
    turnOn() {
        console.log("Air conditioner is on");
    }
}