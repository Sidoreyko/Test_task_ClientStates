class Client {
    constructor(id, email) {
        this.id = id;
        this.email = email;
        this.state = 'lead';
        this.purchaseCount = 0;
        this.lastPurchaseDate = null;
        this.ownClientStateMachine = null;
    }



    setStateMachine(stateMachine) {
        this.ownClientStateMachine = stateMachine;
    }


    makePurchase() {
        this.purchaseCount += 1;
        this.lastPurchaseDate = new Date();
        console.log(`Client ${this.id} made a purchase. Total purchases: ${this.purchaseCount}`);

        if (this.ownClientStateMachine) {
            this.ownClientStateMachine.checkState();
        } else {
            console.log('State machine not initialized.');
        }
    }

    async sendEmail(textId) {
        await this.emailService.sendEmail(this.email, textId);
    }



    updateState(newState) {
        this.state = newState;
        console.log(`Client ${this.id} moved to state: ${this.state}`);
    }


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
