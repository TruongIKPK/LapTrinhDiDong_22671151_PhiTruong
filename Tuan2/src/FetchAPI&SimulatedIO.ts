export async function fetchTodo(id:number) {
    try{
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`)

        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json();
        return data;
    }catch(error){
        console.error("Error fetching todo: ", error);
        throw error;;
    }
}

export async function fetchMultipleTodos() {
  const ids = [1, 2, 3, 4, 5]; 
  const results: any[] = [];  

  for (const id of ids) {
    const todo = await fetchTodo(id);
    results.push(todo);
  }

  return results; 
}

export async function fetchMultipleTodosFilters() {
  const ids = [1, 2, 3, 4, 5]; 
  const results: any[] = [];  

  for (const id of ids) {
    const todo = await fetchTodo(id);
   
    results.push(todo);
  }

  return results.filter(todo => todo.completed === true); 
}

export interface User{
  createdAt: string;
  name: string;
  avatar: string;
  id: string;
}

export async function postData(user: User) {
    try{
        const response = await fetch("https://68305f54f504aa3c70f78f4d.mockapi.io/user",{
            method: "POST",
            headers:{
                "Content-Type": "application/json",  
            },
            body: JSON.stringify(user),
        });

        if (!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: User = await response.json();
        console.log("POST ", data);
        return data;
    }catch (error) {
        console.error("Error posting data:", error);
        throw error;
    }
}

export function downloadFile(fileName: string): Promise<void> {
  return new Promise((resolve) => {
    console.log(`Starting download: ${fileName}...`);
    setTimeout(() => {
      console.log(`Download completed: ${fileName}`);
      resolve();
    }, 3000); 
  });
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function simulateWait() {
  console.log("Bắt đầu chờ 5s");
  await wait(5000); 
  console.log("Done");
}

export async function fetchWithRetry(url: string, retries: number): Promise<any> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("✅ Fetch successful!");
      return data;
    } catch (error) {
      if (attempt === retries) {
        throw new Error(`All ${retries} attempts failed.`);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

function asyncTask(id: number): Promise<string>{
  return new Promise((resolve)=> {
    const delay = Math.floor(Math.random() * 2000) + 1000;
    setTimeout(() => {
      resolve(`Nhiem vu ${id}`)
    }, delay);
  });
}

export async function batchProcess() {
  console.log("Hoan thanh task");
  const tasks = [
    asyncTask(1),
    asyncTask(2),
    asyncTask(3),
    asyncTask(4),
    asyncTask(5)
  ];
  const results = await Promise.all(tasks);
  console.log("Hoan thanh");
  console.log(results)
}

export async function queueProcess() {
  console.log("Starting queue of tasks...");

  const results: string[] = [];
  for (let i = 1; i <= 5; i++) {
    console.log(`Processing task ${i}...`);
    const result = await asyncTask(i); 
    console.log(result);
    results.push(result);
  }

  console.log("All tasks in queue completed!");
  return results;
}

async function fetchData(url: string): Promise<any> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
}


export async function handleMultipleCalls() {
  const urls = [
    "https://68305f54f504aa3c70f78f4d.mockapi.io/user",    
    "https://invalid-url.example.com",                     
    "https://68305f54f504aa3c70f78f4d.mockapi.io/user/1",  
  ];

  const promises = urls.map((url) => fetchData(url));

  const results = await Promise.allSettled(promises);

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      console.log(`API ${index + 1} success:`, result.value);
    } else {
      console.error(`API ${index + 1} failed:`, result.reason);
    }
  });
}
