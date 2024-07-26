import { Schema, model } from 'mongoose';
import User from './user.js';

const eventSchema = new Schema({
    eventName: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    fromTime: {
        type: String,
        required: true
    },
    toTime: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true
    }
},
    {timestamps: true}
);

const Event = model('Event', eventSchema);

export default Event;