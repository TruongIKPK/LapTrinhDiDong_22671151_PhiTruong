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