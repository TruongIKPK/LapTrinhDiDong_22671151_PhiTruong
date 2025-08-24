// 23. Create an interface Payment with method pay(amount). Implement CashPayment and
// CardPayment.

interface Payment {
    pay(amount: number): void;
}

export class CashPayment implements Payment {
    pay(amount: number) {
        console.log(`Paid ${amount} using cash.`);
    }
}

export class CardPayment implements Payment {
    pay(amount: number) {
        console.log(`Paid ${amount} using card.`);
    }
}
