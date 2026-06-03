const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

const dataFile = path.join(__dirname, '../database/requests.json');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/requests', (req, res) => {
    const data = fs.readFileSync(dataFile);
    const requests = JSON.parse(data);
    res.json(requests);
});

app.post('/requests', (req, res) => {
    const data = fs.readFileSync(dataFile);
    const requests = JSON.parse(data);

    const newRequest = {
        id: Date.now(),
        title: req.body.title,
        category: req.body.category,
        description: req.body.description,
        status: 'New',
        createdAt: new Date().toLocaleString()
    };

    requests.push(newRequest);

    fs.writeFileSync(dataFile, JSON.stringify(requests, null, 2));

    res.json(newRequest);
});

app.put('/requests/:id', (req, res) => {
    const data = fs.readFileSync(dataFile);
    const requests = JSON.parse(data);

    const requestId = Number(req.params.id);
    const request = requests.find(item => item.id === requestId);

    if (!request) {
        return res.status(404).json({ message: 'Request not found' });
    }

    request.status = req.body.status;

    fs.writeFileSync(dataFile, JSON.stringify(requests, null, 2));

    res.json(request);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});