const express = require('express');
const bcrypt = require ('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();


//login
router.post('/login', (req,res) => {
    const {email, password} = req.body;
    const user = db .get('users').find({email}).value();
    if(user && bcrypt.compareSync(password, user.password)){
        const token = jwt.sign({id: user.id}, 'secretKey', {expiresIn: '1h'});
    }
    return res.status(401).send('Invalid credentials');
})

//profile
router.get('/profile', (req, res) =>{
    const token = req.headers.authorization;
    try{
        const decoded = jwt.verify(token, 'secretKey');
        const user = db.get('users').find({id: decoded.id}).value();
    }catch {
        res.status(401).send('Unauthorized');
    }
})

module.exports = router;