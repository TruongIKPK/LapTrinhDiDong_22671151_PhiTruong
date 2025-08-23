// 5. Create a class BankAccount with balance. Add methods deposit() and withdraw().
export class BankAccount {
    balance: number;

    constructor(initialBalance: number = 0) {
        this.balance = initialBalance;
    }

    deposit(amount: number): void {
        if (amount > 0) {
            this.balance += amount;
        } else {
            console.log("Tiền phải lớn hơn 0");
        }
    }

    withdraw(amount: number): void {
        if (amount > 0 && amount <= this.balance) {
            this.balance -= amount;
        } else {
            console.log("Rút tiền không hợp lệ");
        }
    }
    display(): void{
        console.log(this.balance)
    }
}