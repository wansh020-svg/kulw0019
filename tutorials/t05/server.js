import express from 'express';

const app = express();

app.use(express.json());

app.get('/api/status', (req, res) => {
    res.status(200).json({
        status: 'API Online',
        timestamp: Date.now()
    });
});

app.post('/api/users', (req, res) => {
    const incomingData = req.body;

    res.status(201).json({
        message: "User successfully created",
        data: incomingData
    });
});

app.post('/api/search', (req, res) => {
    const queryParams = req.query;
    const bodyData = req.body;

    const combined = {
        ...queryParams,
        ...bodyData
    };

    res.status(200).json(combined);
});

const PORT = 5100;

app.listen(PORT, () => {
    console.log(`Server actively running on port ${PORT}`);
});