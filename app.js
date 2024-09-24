const express = require("express");

const port = 3001;

const bodyParser = require('body-parser');

const db  = require("./config/mongoose")

const app = express();

app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.urlencoded({ extended: true }))

app.use('/', require('./routes/routes'));

app.listen(port, (err) => {
    if (err) {
        console.log(err);
        return false;
    }
    console.log("sever is running on localhost:", port);
});


