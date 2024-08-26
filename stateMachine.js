class StateMachine {
    constructor(client, t, n, emailService) {
        this.client = client;
        this.t = t;
        this.n = n;
        this.emailService = emailService;


        this.timerLead = null;
        this.timerNewClients = null;
        this.timerActiveClients = null;

    }


    start() {
        console.log(`Client ${this.client.id} now in LEAD STATE.`);
        this.checkState();
    }

    checkState() {

        this.stopAllTimers();

        switch (this.client.state) {
            case 'lead':
                this.handleLeadState();
                break;
            case 'new_clients':
                this.handleNewClientsState();
                break;
            case 'active_clients':
                this.handleActiveClientsState();
                break;
            case 'need_reactivation_clients':
                this.handleNeedReactivationClientsState();
                break;
            case 'sleep_leads':
                this.handleSleepLeadsState();
                break;
            default:
                console.log(`Unknown state: ${this.client.state}`);
        }
    }


    handleLeadState() {


        if (this.client.purchaseCount > 0) {
            this.client.updateState('new_clients');
            this.client.purchaseCount = 0;
            this.checkState();
            return;
        }


        this.timerLead = setTimeout(() => {
            if (this.client.purchaseCount === 0) {
                this.client.updateState('sleep_leads');
                this.emailService.sendEmail(this.client.email, 'sleep');
            }
            this.checkState();
        }, this.t);
    }


    handleNewClientsState() {
        if (this.client.purchaseCount >= this.n) {
            this.client.updateState('active_clients');
            this.client.purchaseCount = 0;
            this.checkState();
            return;
        }

        this.timerNewClients = setTimeout(() => {
            if (this.client.purchaseCount < this.n) {
                this.client.updateState('need_reactivation_clients');
                this.emailService.sendEmail(this.client.email, 'need_reactivation');
            } else {
                this.client.updateState('active_clients');
            }
            this.checkState();
        }, this.t);
    }


    handleActiveClientsState() {


        this.timerActiveClients = setTimeout(() => {
            if (this.client.purchaseCount < this.n) {
                this.client.updateState('need_reactivation_clients');
                this.emailService.sendEmail(this.client.email, 'need_reactivation');
            }else {
                this.client.updateState('active_clients');
                this.checkState();
            }
            this.checkState();
        }, this.t);
    }


    handleNeedReactivationClientsState() {

            if (this.client.purchaseCount >= this.n) {
                this.client.updateState('active_clients');
                this.checkState();
            }


    }


    handleSleepLeadsState() {
        this.emailService.sendEmail(this.client.email, 'reminder_sleep');
        console.log(`Client ${this.client.id} remains in sleep_leads state.`);
    }


    stopAllTimers() {
        if (this.timerLead) {
            clearTimeout(this.timerLead);
            this.timerLead = null;
        }
        if (this.timerNewClients) {
            clearTimeout(this.timerNewClients);
            this.timerNewClients = null;
        }
        if (this.timerActiveClients) {
            clearTimeout(this.timerActiveClients);
            this.timerActiveClients = null;
        }

    }
}

module.exports = StateMachine;
