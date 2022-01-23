const express = require('express');
const bodyParser = require('body-parser');
const apiEndpoints = require('./endpoints');
const openEndpoints = require('./openEndpoints');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(openEndpoints);
app.use('/api', apiEndpoints);

const PORT = 3000;
app.listen(PORT, () => {
  console.log('listening on port', PORT);
})