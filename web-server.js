const path = require('path');
const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendfile(path.join(__dirname, '/index.html'));
});

app.listen(process.env.PORT || port, function () {
    console.log('Express is running on ' + port);
});
