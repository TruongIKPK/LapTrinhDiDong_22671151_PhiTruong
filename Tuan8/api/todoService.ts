const API_BASE_URL = 'https://68f33ca1fd14a9fcc4282834.mockapi.io/todo';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt?: string;
}

class TodoService {
  // Lấy tất cả todos
  async getAllTodos(): Promise<Todo[]> {
    try {
      const response = await fetch(API_BASE_URL);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Get all todos response:', data);
      return data;
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  }

  // Tạo todo mới
  async createTodo(title: string): Promise<Todo> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          completed: false,
          createdAt: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Create todo response:', data);
      return data;
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  }

  // Cập nhật todo
  async updateTodo(id: string, updates: Partial<Todo>): Promise<Todo> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Update todo response:', data);
      return data;
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  }

  // Xóa todo
  async deleteTodo(id: string): Promise<void> {
    try {
      console.log('Deleting todo with id:', id);
      console.log('Delete URL:', `${API_BASE_URL}/${id}`);
      
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('Delete response status:', response.status);
      console.log('Delete response ok:', response.ok);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Một số API trả về data, một số không
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log('Delete todo response data:', data);
        return data;
      }
      
      console.log('Delete successful - no response data');
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  }
}

export const todoService = new TodoService();