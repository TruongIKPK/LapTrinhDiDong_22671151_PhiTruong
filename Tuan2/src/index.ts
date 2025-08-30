import { sayHello, getNumber, failPromise, getRandomNumber, simulateTask } from "./Basics_with_Promise";

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
// failPromise()
// .then((res) => console.log(res))
// .catch((err) => console.error(err.message));

//Bai 4
// getRandomNumber()
// .then((num)=>{
//     console.log("Rundom number: ", num);
// })
// .catch((err)=>{
//     console.error("Error: ", err.message);
// });

//Bai 5
// simulateTask(2000)
// .then((msg)=>{
//     console.log(msg)
// })

//Bai 6
// const tasks = [
//     simulateTask(1000),
//     simulateTask(2000),
//     simulateTask(3000),
// ];

// Promise.all(tasks)
// .then((results)=>{
//     console.log("All task done: ", results);
// })
// .catch((err)=>{
//     console.error("Error: ", err);
// });

// Bai 7
// const tasks1 = [
//     simulateTask(1000),
//     simulateTask(2000),
//     simulateTask(3000),
// ];

// Promise.race(tasks1)
// .then((results)=>{
//     console.log("First finished: ", results);
// })
// .catch((err)=>{
//     console.error("Error: ", err);
// });

//Bai 8
const start = Promise.resolve(2)

start
.then((num)=>{
    const binhPhuong = num * num;
    console.log("Binh phuong:", binhPhuong);
    return binhPhuong;
})
.then((num)=>{
    const nhanDoi = num * 2;
    console.log("Nhan doi: ", nhanDoi);
    return nhanDoi;
})
.then((num)=>{
    const cong = num + 1;
    console.log("Ket qua: ", cong);
    return cong;
})
.catch((err)=>{
    console.error("Error: ", err);
});

