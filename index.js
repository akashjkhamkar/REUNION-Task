const express = require('express');
const bodyParser = require('body-parser');
const apiEndpoints = require('./endpoints/endpoints');
const openEndpoints = require('./endpoints/openEndpoints');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(openEndpoints);
app.use('/api', apiEndpoints);

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log('listening on port', PORT);
})