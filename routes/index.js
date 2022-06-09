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
    let score = new Score(req.body);
    await score.save();
    res.send(score);
});

module.exports = router;
