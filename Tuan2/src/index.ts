import { sayHello, getNumber, failPromise } from "./Basics_with_Promise";

// async function run() {
//     //Bai 1
//     const message = await sayHello;
//     console.log(message); 

//     //Bai 2
//     const num = await getNumber();
//     console.log(num); 
// }

// run();

//Bai 3
failPromise()
.then((res) => console.log(res))
.catch((err) => console.error(err.message));
