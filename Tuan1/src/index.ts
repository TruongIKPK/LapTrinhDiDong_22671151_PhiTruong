import { Person } from "./person";
import { Student } from "./student";
import { Car} from "./car";
const Truong = new Person("Truong", 23);
const Truong1 = new Student("Hien", 21, 10);
const xeTo = new Car("Toyota", 12321, 2024);
Truong.display();
Truong1.display();
xeTo.display();