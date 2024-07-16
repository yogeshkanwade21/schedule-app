const jwt = require('jsonwebtoken');

const secretPhrase = 'mYsecreTphrasEfoRsecreTtoken';

function createTokenForUser(user) {
    const payload = {
        _id : user._id,
        name : user.name,
        email : user.email
    }

    console.log("user payload", payload);

    const token = jwt.sign(payload, secretPhrase, { expiresIn: '300s' });
    // console.log(token);
    return token;
}

module.exports = {createTokenForUser};