class StateMachine {
    constructor(client, t, n, emailService) {
        this.client = client;
        this.t = t; // время ожидания в миллисекундах
        this.n = n; // количество покупок для перехода в активное состояние
        this.emailService = emailService; // Инъекция сервиса отправки email

        // Таймеры для каждого состояния
        this.timerLead = null;
        this.timerNewClients = null;
        this.timerActiveClients = null;

    }

    // Запуск машины состояний
    start() {
        console.log(`Client ${this.client.id} now in LEAD STATE.`);
        this.checkState();
    }

    // Проверка и обновление состояния клиента
    checkState() {
        // Остановка предыдущих таймеров, если они были
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

    // Обработка состояния lead
    handleLeadState() {


        if (this.client.purchaseCount > 0) {
            this.client.updateState('new_clients');
            this.client.purchaseCount = 0;
            this.checkState(); // Проверяем новое состояние сразу
            return;
        }

        // Устанавливаем таймер на переход в 'sleep_leads' если нет покупок
        this.timerLead = setTimeout(() => {
            if (this.client.purchaseCount === 0) {
                this.client.updateState('sleep_leads');
                this.emailService.sendEmail(this.client.email, 'sleep'); // Использование emailService
            }
            this.checkState();
        }, this.t);
    }

    // Обработка состояния new_clients
    handleNewClientsState() {
        if (this.client.purchaseCount >= this.n) {
            this.client.updateState('active_clients');
            this.client.purchaseCount = 0;
            this.checkState(); // Проверяем новое состояние сразу
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

    // Обработка состояния active_clients
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

    // Обработка состояния need_reactivation_clients
    handleNeedReactivationClientsState() {

            if (this.client.purchaseCount >= this.n) {
                this.client.updateState('active_clients');
                this.checkState();
            }


    }

    // Обработка состояния sleep_leads
    handleSleepLeadsState() {
        this.emailService.sendEmail(this.client.email, 'reminder_sleep');
        console.log(`Client ${this.client.id} remains in sleep_leads state.`);
    }

    // Остановка всех таймеров
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
