//Bai 8
import { Product } from "./product";

const products: Product[] = [
    new Product("Book", 50),
    new Product("Phone", 200),
    new Product("Pen", 20),
    new Product("Laptop", 1500),
    new Product("Bag", 80)
];

const loc = products.filter(product => product.price > 100);
console.log(loc);

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







