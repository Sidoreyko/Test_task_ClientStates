const express = require('express');
const Client = require('./client');
const StateMachine = require('./stateMachine');
const EmailService = require('./emailService');
const config = require('./config');
require('dotenv').config();

const app = express();
app.use(express.json());

const clients = {}; // Хранилище клиентов

// Функция для упрощения клиента перед отправкой
function simplifyClient(client) {
    return {
        id: client.id,
        email: client.email,
        state: client.state,
        purchaseCount: client.purchaseCount,
        lastPurchaseDate: client.lastPurchaseDate,
    };
}

// Регистрация клиента
app.post('/api/register', (req, res) => {
    const { id, email } = req.body;
    if (clients[id]) {
        return res.status(400).json({ message: 'Client already registered' });
    }
    const client = new Client(id, email);
    clients[id] = client;

    // Запуск машины состояний для клиента
    const emailService = new EmailService();
    const stateMachine = new StateMachine(client, config.stateMachineTimeout, config.stateMachinePurchaseCount, emailService);
    client.setStateMachine(stateMachine); // Устанавливаем машину состояний
    stateMachine.start();

    res.status(201).json({ message: 'Client registered', client: client.toJSON() });
});

// Совершение покупки
app.post('/api/purchase', (req, res) => {
    const { id } = req.body;
    const client = clients[id];
    if (!client) {
        return res.status(404).json({ message: 'Client not found' });
    }

    client.makePurchase();

    res.status(200).json({ message: 'Purchase made', client: client.toJSON() });
});

// Запуск сервера
app.listen(config.port, () => {
    console.log(`Server is running on http://localhost:${config.port}`);
});
