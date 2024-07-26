import express from 'express';
import userRouter from './routes/user.js';
import eventRouter from './routes/events.js';
import mongoose from 'mongoose';
import cors from "cors";
import bodyParser from'body-parser';
const app = express();
const PORT = 3001;

// Database Connection
mongoose.connect('mongodb://127.0.0.1:27017/schedular-app')
    .then(() => {
        console.log('mongodb connection established');
    })
    .catch(err => console.log(err.message));

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.json());
app.use(cors({ credentials: true, allowedHeaders: ["Content-Type", "Authorization"], exposedHeaders: ["Authorization"] }));

app.use('/user', userRouter);
app.use('/event', eventRouter);

const server = app.listen(PORT, ()=> {
    console.log(`listening on port ${PORT}`);
})

server.on('error', (err)=> {
    console.log(`error: ${err.message}`);
});

export default server;