// import { Person } from "./person";
// import { Student } from "./student";
// import { Car} from "./car";
// import { Rectangle } from "./rectangle";
import { BankAccount } from "./bankAccount";


// const Truong = new Person("Truong", 23);
// const Truong1 = new Student("Hien", 21, 10);
// const xeTo = new Car("Toyota", 12321, 2024);
// const hinhTamGiac = new Rectangle(21, 23);
const TruongGui = new BankAccount(2);

// Truong.display();
// Truong1.display();
// xeTo.display();
// console.log(hinhTamGiac.calculate_area());
// console.log(hinhTamGiac.calculate_perimeter());
TruongGui.display();
TruongGui.deposit(2);
TruongGui.display();
TruongGui.withdraw(1);
TruongGui.display();
