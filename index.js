'use strict'

const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(__dirname + '/App'));

app.get('*', (req,res) =>{
    res.sendFile(__dirname + '/App/index.html');
});

app.listen(3000, () => {
    console.log('App is listening on port 3000')
});