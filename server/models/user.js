import { Schema, model } from 'mongoose';
import { createHmac, randomBytes } from'node:crypto';
import createTokenForUser from'../services/auth.js';

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
    }
},
    {timestamps: true}
);

userSchema.pre('save', function (next){
    const user = this;

    if(!user.isModified("password")) return;

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256', salt)
                            .update(user.password)
                            .digest('hex');

    user.salt = salt;
    user.password = hashedPassword;

    next();
});

userSchema.static('matchPasswordAndGenerateToken', async function (email, password) {
    console.log('Finding user with email:', email);
    const user = await this.findOne({email});
    console.log('User found:', user);
    if(!user){
        throw new Error('User not found');
    }

    const salt = user.salt;
    const registeredPassword = user.password;

    const loginPassword = createHmac('sha256', salt)
                                .update(password)
                                .digest('hex');

    if(loginPassword !== registeredPassword){
        // console.log('Password mismatch');
        throw new Error('Password mismatch');
    }

    const token = createTokenForUser(user);
    // console.log('Token:', token);
    return token;
})

const User = model('User', userSchema);
export default User;