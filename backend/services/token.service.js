const jwt = require('jsonwebtoken');

class TokenService {
    generate(payload) {

        return jwt.sign({ user: payload }, "salom-dunyo", { expiresIn: "30d" })

    }

    verify(token) {
        return jwt.verify(token, "salom-dunyo")
    }
}


module.exports = new TokenService()