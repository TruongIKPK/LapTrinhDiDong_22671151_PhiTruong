// 1. Create a Promise that returns the string "Hello Async" after 2 seconds.
export const sayHello: Promise<string> = new Promise((resolve) => {
    setTimeout(()=>{
        resolve("Hello Async");
    },2000);
},);

export function getNumber(): Promise<number>{
    return new Promise((resolve) => {
        setTimeout(()=>{
            resolve(10);
        },1000);
    });
}

export function failPromise(): Promise<never>{
    return new Promise((_, reject)=>{
        setTimeout(()=>{
            reject(new Error("Something went wrong"));
        }, 1000);
    });
}

export function getRandomNumber(): Promise<number>{
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            const num = Math.floor(Math.random() * 10);
            if(num >= 0){
                resolve(num);
            } else{
                reject(new Error("Failed to generate number"));
            }
        }, 1000);
    })
}

export function simulateTask(time: number): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Task done: ${time}`);
    }, time);
  });
}