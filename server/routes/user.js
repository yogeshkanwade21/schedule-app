const { Router } = require('express');
const router = Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const secretPhrase = 'mYsecreTphrasEfoRsecreTtoken';

router.post('/login', async (req, res) => {

    try {
        const { email, password } = req.body;
        const token = await User.matchPasswordAndGenerateToken(email, password);
        console.log("login route token", token);
        //res.header('Authorization', token);
        res.setHeader('Authorization', `Bearer ${token}`);
        res.send({ message: 'Login successful' });
    } catch (error) {
        console.error(error.message);
        if(error.message === 'User not found'){
            return res.status(404).send({ message: 'User not found' });
        }else if(error.message === 'Password mismatch'){
            return res.status(401).send({ message: 'Password mismatch' });
        }
    }
})

router.post('/validateToken', (req, res) => {
    const token = req.body.token;
    console.log("token in validate token route", token);

    if(!token){
        return res.status(401).send({ message: 'No token provided' });
    }
    try {
        const decodedUser = jwt.verify(token, secretPhrase);
        console.log("decodedUser", decodedUser);
        res.send({ message: 'Token is valid', user: decodedUser });
    } catch (error) {
        // console.error(error);
        return res.status(401).send({ message: 'Invalid token' });
    }
})

router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: 'Email already in use' });
        }

        await User.create({
            name,
            email,
            password,
        });
        return res.status(201).send({ message: 'User Created' });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) { // Duplicate key error code
            return res.status(400).send({ message: 'Email already in use' });
        }
        return res.status(500).send({ message: 'Internal Server Error' });
    }
});

module.exports = router;