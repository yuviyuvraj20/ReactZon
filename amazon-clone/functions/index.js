const functions = require("firebase-functions");
const logger = require("firebase-functions/logger");
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")('sk_test_51OhOH0SGOMJC9CuZLi9NuG8BrgpGXCnriVh82zxYBvj2iqBFokJN5KmrMexcg9WObQRkmZurKmWVjoFrn6RzsJKd00R5UQqcXW');

// App config
const app = express();

// Middlewares
app.use(cors({ origin: true }));
app.use(express.json());

// API routes
app.get('/', (request, response) => response.status(200).send('hello world'));
app.post('/payments/create', async (request, response)=>{
    const total=request.query.total;
    console.log('Payment Request Recieved BOOM!!! for this amount',total)
    const paymentIntent=await stripe.paymentIntents.create({
        amount: total,
        currency:"usd",
    });
    response.status(201).send({
        clientSecret:paymentIntent.client_secret,
    })
})
// Listen command
exports.api = functions.https.onRequest(app);
//http://127.0.0.1:5001/challenge-48a75/us-central1/api