import { simulateTask } from "./Basics_with_Promise";

export const sayHello1 = async (): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Hello Async");
    }, 2000);
  });
};

export async function runTask(){
    try{
        const result = await simulateTask(2000);
        console.log(result);
    }catch(error){
        console.error("Error: ", error);
    }
}

export function failTask(): Promise<string> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject("Something went wrong!");
    }, 1000);
  });
}

export async function runFailTask() {
  try {
    const result = await failTask();
    console.log("Result:", result);
  } catch (error) {
    console.error("Caught error:", error);
  } finally {
    console.log("Done (success or error).");
  }
}

export async function tripleAfter1s(num:number) {
  return new Promise((resovle)=>{
    setTimeout(()=>{
      resovle(num * 3);
    }, 1000);
  });
}


export async function fetchUser(id: number){
  return new Promise((resolve)=>{
    setTimeout(()=>{
      resolve({
        id,
        name: `User_${id}`
      })
    }, 1000);
  })
}
