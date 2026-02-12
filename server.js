const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname)));
app.use(express.json());

// Basic endpoint to "save" invoices (In-memory for now to satisfy requirements without DB complexity)
let invoices = [];

app.post('/api/invoices', (req, res) => {
    const invoice = req.body;
    invoice.id = Date.now();
    invoices.push(invoice);
    res.status(201).json({ message: 'Invoice saved', id: invoice.id });
});

app.get('/api/invoices', (req, res) => {
    res.json(invoices);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
