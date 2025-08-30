import { fetchUser, fetchUsers, runFailTask, runTask, sayHello1, tripleAfter1s } from "./AsyncAwait";
import { sayHello, getNumber, failPromise, getRandomNumber, simulateTask, filterEvenNumbers , successPromise} from "./Basics_with_Promise";

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
// const start = Promise.resolve(2)

// start
// .then((num)=>{
//     const binhPhuong = num * num;
//     console.log("Binh phuong:", binhPhuong);
//     return binhPhuong;
// })
// .then((num)=>{
//     const nhanDoi = num * 2;
//     console.log("Nhan doi: ", nhanDoi);
//     return nhanDoi;
// })
// .then((num)=>{
//     const cong = num + 1;
//     console.log("Ket qua: ", cong);
//     return cong;
// })
// .catch((err)=>{
//     console.error("Error: ", err);
// });

//Bai 9
// const number = [1, 2, 3, 4, 5, 6];

// filterEvenNumbers(number)
// .then((evens)=>{
//     console.log("Even numbers: ", evens);
// })
// .catch((err)=>{
//     console.error("Error: ", err);
// });

//Bai 10
// successPromise
// .then((msg) => {
// console.log("Result:", msg);
// })
// .catch((err) => {
// console.error("Error:", err);
// })
// .finally(() => {
// console.log("Done"); 
// });

//Bai 11
// (async () => {
//   const message = await sayHello1();
//   console.log(message); 
// })();

//Bai 12
// runTask();
//Bai 13
// runFailTask();

//Bai 14
// async function run() {
//     const result = await tripleAfter1s(5);
//     console.log(result);
// }

// run();

//Bai 15
// export async function runSequential() {
//     console.log("Bat dau");

//     const result1 = await tripleAfter1s(2);
//     console.log("Result 1: ", result1);
//     const result2 = await tripleAfter1s(3);
//     console.log("Result 2: ", result2);
//     const result3 = await tripleAfter1s(4);
//     console.log("Result 3: ", result3);
// }
// runSequential();

//Bai 16
// async function runParallel() {
//     console.log("Bat dau");

//     const results = await Promise.all([
//         tripleAfter1s(2),
//         tripleAfter1s(3),
//         tripleAfter1s(4)
//     ])

//     console.log("Results: ", results);
// }

// runParallel();

//Bai 17
// async function  runForAwaitOf() {
//     const promises = [
//         tripleAfter1s(2),
//         tripleAfter1s(3),
//         tripleAfter1s(4),
//     ]

//     console.log("Start");

//     for await (const result of promises){
//         console.log("Result ", result);
//     }
//     console.log("Done")
// }
// runForAwaitOf();

//Bai 18
// async function testFetchUser() {
//   console.log("Fetching user...");
//   const user = await fetchUser(1);
//   console.log("User:", user);
// }

// testFetchUser();

//Bai 19
async function testFetchUsers() {
    const users = await fetchUsers([1, 2, 3])
    console.log("Users:", users);
}

testFetchUsers()
