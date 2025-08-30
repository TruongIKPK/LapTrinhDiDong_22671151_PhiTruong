export async function fetchTodo() {
    try{
        const response = await fetch("https://jsonplaceholder.typicode.com/todos/1")

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