import chai from 'chai';
import mongoose from 'mongoose';
import request from 'supertest';
import server from '../../index.js';
const { expect } = chai;

describe('Dashboard API Flow', () => {

    after((done) => {
        server.close((err) => {
            if(err) {
                console.log(err);
            }
            mongoose.connection.close();
            done();
        });
    });

    let token = '';
    const validEmail = 'Amit@test';
    const validPassword = '12345';

    // Step 1: Login to obtain a token
    before(async () => {
        const loginResponse = await request(server)
            .post('/user/login')
            .send({ email: validEmail, password: validPassword });

        expect(loginResponse.status).to.equal(200);
        expect(loginResponse.body.message).to.equal('Login successful');
        console.log("login successful");
        
        token = loginResponse.header['authorization'];
        expect(token).to.be.a('string');
        expect(token).to.match(/^Bearer\s/);
        console.log("token set");
    });

    // Step 2: Validate token and fetch events
    it('should validate token and fetch user events', async () => {
        const validateResponse = await request(server)
            .post('/user/validateToken')
            .send({ token: token.replace('Bearer ', '') }); // Removing 'Bearer' prefix

        expect(validateResponse.status).to.equal(200);
        expect(validateResponse.body.message).to.equal('Token is valid');
        console.log("token validated");

        const userId = validateResponse.body.user._id;

        // Fetching events using the validated user ID
        const eventsResponse = await request(server)
            .get(`/event/getEvents/${userId}`)
            // .set('Authorization', token); // Set the token in the request header

        expect(eventsResponse.status).to.equal(200);
        expect(eventsResponse.body.events).to.be.an('array');
        expect(eventsResponse.body.events.length).to.be.greaterThan(0);
        console.log("events fetched");
    });
})