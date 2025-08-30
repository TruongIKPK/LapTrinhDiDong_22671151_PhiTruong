import { sayHello, getNumber } from "./Basics_with_Promise";

async function run() {
    //Bai 1
    const message = await sayHello;
    console.log(message); 

    //Bai 2
    const num = await getNumber();
    console.log(num); 
}

run();
