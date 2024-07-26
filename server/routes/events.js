import { Router } from 'express';
const router = Router();
import Event from '../models/event.js';

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