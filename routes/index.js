const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const Score = require('../models/Score');

const router = express.Router();

router.get('/scores', async (req, res) => {
    let scores = await Score.find().sort({score: -1}).limit(10);
    res.send(scores);
});

router.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../dist/footx/index.html'));
});

router.post('/scores', async (req, res) => {
    const token = req.headers['x-access-token'] || req.headers['authorization'];
    if (!token) {
        res.status(401).send('Access denied. No token provided.');
        return;
    }
    if (token !== process.env.SECRET) {
        res.status(401).send('Access denied. Invalid token.');
        return;
    }
    if (!req.body.name || !req.body.score) {
        res.status(400).send('Bad Request');
        return;
    }
    let score = new Score(req.body);
    await score.save();
    res.send(score);
});

module.exports = router;
