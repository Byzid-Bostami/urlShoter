const express = require('express');
const app = express();
const cors = require('cors');
const router = require('./Routes/allRoutes');


app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(router); 

module.exports = app;
