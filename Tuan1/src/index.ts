import { Car } from "./vehicle";
import { Bike } from "./vehicle";

const car = new Car();
car.drive();
const bike = new Bike();
bike.drive();

//Bai 19
// import { Cat, Dog } from "./animals";
// const dog = new Dog("");
// dog.sound();
// const cat = new Cat("");
// cat.sound();

//Bai 18
// import { MathUtil } from "./mathUtil";
// console.log("Math Add: " + MathUtil.add(13,5));
// console.log("Math Subtract: " + MathUtil.subtract(17,5));
// console.log("Math Multiply: " + MathUtil.multiply(17,5));
// console.log("Math Divide: " + MathUtil.divide(17,5));

//Bai 17
// import { Logger } from "./logger";
// const logger1 = Logger.getInstance();
// const logger2 = Logger.getInstance();
// logger1.log("log");
// logger2.error("loi");

//Bai 16
// import { Box } from "./box";
// const numberBox = new Box<number>(123);
// console.log("Number:", numberBox.getValue());
// const stringBox = new Box<string>("Hop den");
// console.log("String:", stringBox.getValue());
// const booleanBox = new Box<boolean>(true);
// console.log("Boolean:", booleanBox.getValue()); 

//Bai 15
// import { Book } from "./book";
// import { Library } from "./library";
// import { User } from "./user";
// const library = new Library();
// library.addBook(new Book("Tat den", "Ngo Tat To",2021));
// library.addBook(new Book("Nhat Ha", "Truong Le", 2012));
// library.addUser(new User("Phi Truong"));
// library.showBooks();

//Bai 14
// import { Developer, Manager } from "./employee";
// const manager = new Manager("Phuc", 1000);
// manager.work();
// manager.manageTeam();
// const developer = new Developer("Khanh", 2000);
// developer.work();
// developer.writeCode();

//Bai 13
// import { Circle, Square } from "./shape";
// const square = new Square(5);
// const circle = new Circle(3);
// console.log(circle.area());
// console.log(square.area());

//Bai 12
// import { Bird, Fish } from "./animals";
// const chim = new Bird("chao mao");
// chim.fly();
// const ca = new Fish("ca ngu");
// ca.swim();

//Bai 11
// import { Cat, Dog } from "./animals";
// const cho = new Dog("nau");
// const meo = new Cat("muop");
// cho.sound();
// meo.sound();


//Bai 10
// import { Account } from "./account";
// const taikhoan = new Account(1, "Truong", "1234");
// console.log("Ten " + taikhoan.username)
// console.log("Mật khẩu " + taikhoan.getPassword())

//Bai 8
// import { Product } from "./product";
// const products: Product[] = [
//     new Product("Book", 50),
//     new Product("Phone", 200),
//     new Product("Pen", 20),
//     new Product("Laptop", 1500),
//     new Product("Bag", 80)
// ];
// const loc = products.filter(product => product.price > 100);
// console.log(loc);

//Bai 7
// import { User } from "./user";
// const nguoi = new User("Truong");
// nguoi.display();
// nguoi.name = "Hien";
// nguoi.display();

//Bai 6
// import { Book } from "./book";
// const sach = new Book("tat den", "ngo tat to", 1970)
// sach.display();

//Bai 5
// import { BankAccount } from "./bankAccount";
// const TruongGui = new BankAccount(2);
// TruongGui.display();
// TruongGui.deposit(2);
// TruongGui.display();
// TruongGui.withdraw(1);
// TruongGui.display();

//Bai 4
// import { Rectangle } from "./rectangle";
// const hinhTamGiac = new Rectangle(21, 23);
// console.log(hinhTamGiac.calculate_area());
// console.log(hinhTamGiac.calculate_perimeter());

//Bai 3
// import { Car} from "./car";
// const xeTo = new Car("Toyota", 12321, 2024);
// xeTo.display();

//Bai 2
// import { Student } from "./student";
// const Truong1 = new Student("Hien", 21, 10);
// Truong1.display();

//Bai 1
// import { Person } from "./person";
// const Truong = new Person("Truong", 23);
// Truong.display();







