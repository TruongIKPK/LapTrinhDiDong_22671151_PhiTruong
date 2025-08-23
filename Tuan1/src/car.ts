// 3. Create a class Car with properties brand, model, year. Write a method to show car info.
export class Car{
    brand: string;
    model: number;
    year: number;
    constructor(brand: string, model: number, year:number){
        this.brand = brand;
        this.model = model;
        this.year = year;
    }
    display(): void{
        console.log(this.brand + this.model + this.year)
    }
}