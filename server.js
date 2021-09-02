const express = require('express');
const app = express();
const port = 3333;

app.use('/', express.static('src'));

app.listen(port, function () {
    console.log('Example app listening on port : ' + port);
});