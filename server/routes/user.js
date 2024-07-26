import { Router } from 'express';
const router = Router();
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
const secretPhrase = 'mYsecreTphrasEfoRsecreTtoken';

/** 
 * @swagger
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          properties:
 *              name:
 *                  type: string
 *              email:
 *                  type: string
 *              password:
 *                  type: string
 *          required:
 *              - name
 *              - email
 *              - password
 *          example:
 *              name: Amit
 *              email: Amit@test
 *              password: 12345
 */

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Logs in a user and returns a JWT token
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         headers:
 *           Authorization:
 *             schema:
 *               description: JWT token
 *               type: string
 *       404:
 *         description: User not found
 *       401:
 *         description: Password mismatch
 */

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

/**
 * @swagger
 * /user/validateToken:
 *   post:
 *     summary: Validates a token
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: The JWT token to validate
 *     responses:
 *       200:
 *         description: Token is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token is valid
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60d0fe4f5311236168a109ca
 *                     name:
 *                       type: string
 *                       example: John Doe
 *       401:
 *         description: Invalid token
 */

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

/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: Creates a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Email already in use
 */

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

export default router;