import chai from 'chai';
import mongoose from 'mongoose';
import request from 'supertest';
import server from '../../index.js';
const { expect } = chai;

describe('User Route', () => {

    after((done) => {
        server.close((err) => {
            if(err) {
                console.log(err);
            }
            mongoose.connection.close();
            done();
        });
    });

    it('should return a token on successful login', async () => {
        const response = await request(server)
            .post('/user/login')
            .send({ email : 'Amit@test', password : '12345' });

        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('Login successful');
        const authHeader = response.header['authorization'];
        // console.log('Response Headers:', response.header);
        expect(authHeader).to.be.a('string');
        expect(authHeader).to.not.be.empty;
        expect(authHeader).to.match(/^Bearer\s/);
    });

    it('should return 404 if user is not found', async () => {
        const response = await request(server)
            .post('/user/login')
            .send({ email: 'unknown@example.com', password: 'password' })

        expect(response.status).to.have.equal(404);
        expect(response.body.message).to.equal('User not found');
        
    });

    it('should return 401 if password is incorrect', async () => {
        const response = await request(server)
            .post('/user/login')
            .send({ email: 'Amit@test', password: 'wrongpassword' })

        expect(response.status).to.have.equal(401);
        expect(response.body.message).to.equal('Password mismatch');

    });
})