const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const routes = require('./routes');

require('dotenv').config({
	path: '.env'
});

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
    console.log(`An error occured while connecting to the database: ${err}`);
});

app.use(express.static(__dirname + '/dist/footx'));

app.use('/', routes);

/*
app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname+'/dist/footx/index.html'));
});
*/

app.listen(process.env.PORT || 4200);
