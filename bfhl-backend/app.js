require('dotenv').config(); // Add this line at the top of app.js

const mongoUri = process.env.MONGO_URI;
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Replace with your MongoDB connection string
const mongoUri = process.env.MONGO_URI || 'your_mongodb_connection_string';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

const app = express();
app.use(bodyParser.json());

// Define a schema for storing responses
const responseSchema = new mongoose.Schema({
    is_success: Boolean,
    user_id: String,
    email: String,
    roll_number: String,
    numbers: [String],
    alphabets: [String],
    highest_lowercase_alphabet: [String]
});

const Response = mongoose.model('Response', responseSchema);

app.post('/bfhl', async (req, res) => {
    try {
        const data = req.body.data || [];
        const userId = "thogarakunta_rehana_02072000";  // Example User ID, update with your actual details
        const email = "rehana@vitap.ac.in";
        const rollNumber = "BTECH12345";

        const numbers = data.filter(item => !isNaN(item));
        const alphabets = data.filter(item => /^[a-zA-Z]+$/.test(item));
        const lowercaseAlphabets = alphabets.filter(item => item === item.toLowerCase());
        const highestLowercaseAlphabet = lowercaseAlphabets.length > 0 ? [lowercaseAlphabets.sort().pop()] : [];

        const responsePayload = {
            is_success: true,
            user_id: userId,
            email: email,
            roll_number: rollNumber,
            numbers: numbers,
            alphabets: alphabets,
            highest_lowercase_alphabet: highestLowercaseAlphabet
        };

        // Store the response in MongoDB
        const response = new Response(responsePayload);
        await response.save();

        res.status(200).json(responsePayload);
    } catch (error) {
        res.status(400).json({ is_success: false, error: error.message });
    }
});

app.get('/bfhl', (req, res) => {
    res.status(200).json({ operation_code: 1 });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}...`));

