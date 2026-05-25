const jwt = require('jsonwebtoken');

function Jwt_Service() {

    const secret = "Thisisaverysecurewebtokensecret"

    return {
        createToken(payload) {
            const token = jwt.sign(payload, secret, {algorithm: 'HS256', expiresIn: '1h'});
            console.log("Token: ", token);
            return token;
        },
        verifyToken(token) {
            try {
                const decoded = jwt.verify(token, secret);
                console.log(decoded);
                return decoded;
            }
            catch(err) {
                console.error("Error decoding token");
            }
        }
    }
}

module.exports = Jwt_Service;