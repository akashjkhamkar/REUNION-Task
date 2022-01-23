const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const { authenticateUser } = require('./queries');

router.get('/', async (req, res) => {
    res.json({'Message': "Hello, This is Akash', 'App': 'This API was created as an submission to the REUNON'S internship task"});
})

router.post('/api/authenticate', async (req, res) => {
    const user = req.body;
    const result = await authenticateUser(user);

    if(!result){
        return res.json({'Message': 'Email or Password is wrong'});
    }

    const token = jwt.sign(result, 'secretstuff', { expiresIn: '1h' });
    res.json({ token });
})

module.exports = router;