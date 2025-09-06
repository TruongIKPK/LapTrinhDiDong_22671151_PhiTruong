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