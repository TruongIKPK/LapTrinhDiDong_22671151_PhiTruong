import { Book } from "./book";
import { User } from "./user";

export class Library {
  private books: Book[] = [];
  private users: User[] = [];

  addBook(book: Book): void {
    this.books.push(book);
  }

  addUser(user: User): void {
    this.users.push(user);
  }

  showBooks(): void {
    this.books.forEach((book) => {
      console.log(`- $: ${book.title} - ${book.author}`);
    });
  }
}