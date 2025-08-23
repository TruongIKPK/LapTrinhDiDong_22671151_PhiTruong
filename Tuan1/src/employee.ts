// 14. Create a base class Employee. Extend Manager and Developer with specific methods.

export class Employee {
    name: string;
    salary: number;

    constructor(name: string, salary: number) {
        this.name = name;
        this.salary = salary;
    }

    work(): void {
        console.log(`Class cha: ${this.name}`);
    }
}

export class Manager extends Employee {
    manageTeam(): void {
        console.log(`Manager: ${this.name}`);
    }
}

export class Developer extends Employee {
    writeCode(): void {
        console.log(`Developer: ${this.name}`);
    }
}