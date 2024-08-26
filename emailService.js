const axios = require('axios');

class EmailService {
    constructor() {
        this.apiUrl = 'https://esputnik.com/api/v1/message/email';
        this.apiKey = process.env.ESPUTNIK_API_KEY;
        this.senderEmail = 'sidoreyko@gmail.com';
    }

    async sendEmail(recipientEmail, textId) {
        const options = {
            method: 'POST',
            url: this.apiUrl,
            headers: {
                accept: 'application/json; charset=UTF-8',
                'content-type': 'application/json',
                authorization: 'Basic c2lkb3JleWtvQGdtYWlsLmNvbTo1NDYzNzI4MTlhQSo='
            },
            data: {
                from: this.senderEmail,
                subject: 'REMINDER',
                htmlText: `${textId}`,
                plainText: `${textId}`,
                ampHtmlText: '---',
                externalRequestId: this.senderEmail,
                emails: [recipientEmail]
            }
        };



        try {
            const response = await axios.request(options);
            console.log(`Email sent to ${recipientEmail}:`, response.data);
        } catch (error) {
            console.error(`Failed to send email to ${recipientEmail}:`, error);
        }
    }
}

module.exports = EmailService;
