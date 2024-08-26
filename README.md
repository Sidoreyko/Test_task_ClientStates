1. Ensure dependencies are installed as specified in package.json. Run:

       npm install


2. Set environment variables in the .env file, e.g.:

        process.env.PORT || 3000,
        stateMachineTimeout: parseInt(process.env.STATE_MACHINE_TIMEOUT, 10) || 15000,
        stateMachinePurchaseCount: parseInt(process.env.STATE_MACHINE_PURCHASE_COUNT, 10) || 5
   

3. Start the server:
	"npm start" or directly( node app.js)



4. Registering a Client
    Method: POST

        URL: /api/register

	Request Body:

        (json)

    	  {
      	  "id": "unique_identifier",
      	  "email": "email@example.com"
    	  }

--- Description: Registers a new client. If the client makes a purchase immediately, they transition to the new_clients state. If no purchases are made, after the specified time, the client transitions to sleep_leads. ---


5. Making a Purchase
     Method: POST

    	URL: /api/purchase

	Request Body:

       (json)
    
    	{
      	"id": "unique_identifier"
    	}

--- Description: Increments the client's purchase count and checks their state. If the client reaches the required number of purchases, they transition to active_clients. Otherwise, a timer starts for transitioning to need_reactivation_clients or sleep_leads, depending on the current state. ---



6. Client States:

1) lead: Initial state. Transitions to new_clients upon the first purchase, or sleep_leads if no purchases are made.

2) new_clients: Transitions to active_clients if the required number of purchases is reached, or to need_reactivation_clients if not.

3) active_clients: Transitions to need_reactivation_clients if the required number of purchases is not met within the time frame.

4) need_reactivation_clients: Transitions to active_clients, if the required number of purchases is reached, sends an email reminder if not.

5) sleep_leads: The client remains in this state and may receive email reminders.


7. Example Usage with Postman

Register a Client:

    Request: POST /api/register
    Body: {"id": "client1", "email": "client1@example.com"}


Make a Purchase:

    Request: POST /api/purchase
    Body: {"id": "client1"}



