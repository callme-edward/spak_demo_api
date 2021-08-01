const myEnv = require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



let hashPassword = function (password) {
    console.log("password: ", password);
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
}


let comparePassword = function (hashPassword, password) {

    return bcrypt.compareSync(password, hashPassword);
}

let loginToken = function (id) {
    const token = jwt.sign({
        userId: id
    },
        myEnv.parsed.SECRET, { expiresIn: '7d' }
    );
    return token;
}

module.exports = { hashPassword, comparePassword, loginToken }
