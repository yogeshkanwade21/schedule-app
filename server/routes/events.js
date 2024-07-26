import { Router } from 'express';
const router = Router();
import Event from '../models/event.js';

/**
 * @swagger
 * components:
 *  schemas:
 *      Event:
 *          type: object
 *          properties:
 *              eventName:
 *                  type: string
 *              date:
 *                  type: string
 *              fromTime:
 *                  type: string
 *              toTime:
 *                  type: string
 *              createdBy:
 *                  type: string
 *          required:
 *              - eventName
 *              - date
 *              - fromTime
 *              - toTime
 *              - createdBy
 */

/** 
 * @swagger
 * /event/add:
 *   post:
 *     summary: Add an Event
 *     tags: [Event]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       201:
 *         description: Event created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Event Created
 *       500:
 *         description: Internal Server Error
 */

router.post('/add', async (req, res) => {

    const { eventName, date, fromTime, toTime, userId} = req.body;
    console.log(eventName, date, fromTime, toTime, userId);
    try {
        const event = await Event.create({ eventName, date, fromTime, toTime, createdBy: userId });
        console.log(event);
        return res.status(201).send({ message: 'Event Created' });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Internal Server Error' });
    }
})

/**
 * @swagger
 * /event/getEvents/{userId}:
 *   get:
 *     summary: Get all events for a user
 *     tags: [Event]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *           required: true
 *           description: The userId of the user
 *     responses:
 *       200:
 *         description: Returns events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 events:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 *       500:
 *         description: Internal Server Error 
*/

router.get('/getEvents/:userId', async (req, res) => {
    const userId = req.params.userId;
    console.log("query events by an userId", userId);
    try {
        const events = await Event.find({ createdBy: userId });
        console.log("query events by an user", events);
        return res.status(200).send({ events });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Internal Server Error' });
    }
})

export default router;