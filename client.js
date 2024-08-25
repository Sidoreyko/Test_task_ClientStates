class Client {
    constructor(id, email) {
        this.id = id;
        this.email = email;
        this.state = 'lead'; // Начальное состояние
        this.purchaseCount = 0; // Количество покупок
        this.lastPurchaseDate = null; // Дата последней покупки
        this.ownClientStateMachine = null;
    }


    // Установка машины состояний
    setStateMachine(stateMachine) {
        this.ownClientStateMachine = stateMachine;
    }

    // Метод для регистрации покупки
    makePurchase() {
        this.purchaseCount += 1;
        this.lastPurchaseDate = new Date();
        console.log(`Client ${this.id} made a purchase. Total purchases: ${this.purchaseCount}`);

        // Проверка состояния
        if (this.ownClientStateMachine) {
            this.ownClientStateMachine.checkState();
        } else {
            console.log('State machine not initialized.');
        }
    }

    async sendEmail(textId) {
        await this.emailService.sendEmail(this.email, textId);
    }


    // Обновление состояния клиента
    updateState(newState) {
        this.state = newState;
        console.log(`Client ${this.id} moved to state: ${this.state}`);
    }

    // Метод для преобразования клиента в JSON
    toJSON() {
        return {
            id: this.id,
            email: this.email,
            state: this.state,
            purchaseCount: this.purchaseCount,
            lastPurchaseDate: this.lastPurchaseDate
        };
    }
}

module.exports = Client;
