const User = require('../models/userModel');
const util = require('./util');
const { v4: uuid } = require('uuid');
const tokenModel = require('../models/tokenModel');

module.exports.createUser = (req, res) => {
    try {
        if (!req.body || !req.body.name || !req.body.password) {
            return res.send({ data: {}, success: false, message: "data missing" });
        }

        let user = new User({
            name: req.body.name,
            password: util.hashPassword(req.body.password),
            contact: req.body.contact,
            address: req.body.address,
            gender: req.body.gender,
            country: req.body.country
        })

        user.save()
            .then(data => {
                res.send({ data, success: true, message: "User created" });
            }, (error => {
                res.send({ error, success: false, message: "DB error in user create" });
            }));
    }
    catch (error) {
        res.send({ error, success: false, message: "Unknown error" });
    }
}


module.exports.login = (req, res) => {
    try {
        if (!req.body.name || !req.body.password) {
            return res.send({ success: false, data: {}, message: "name or password missing" });
        }
        User.findOne({ name: req.body.name })
            .then(user => {
                if (!user) return res.send({ data: {}, success: false, message: "No user found" });

                else {
                    if (!util.comparePassword(user.password, req.body.password)) {
                        return res.send({ data: {}, success: false, message: "Incorrect password" });
                    }

                    tokenModel.findOne({ username: user.name }, (error, tokenDoc) => {
                        if (error) return res.send({ data: {}, success: false, message: "DB error, please try again" });
                        else {
                            if (!tokenDoc) {
                                let tokenData = new tokenModel({
                                    tokenId: uuid(),
                                    username: user.name,
                                    used: false
                                })
                                tokenData.save()
                                    .then(doc => {
                                        let data = {
                                            user: user,
                                            token: util.loginToken(user._id),
                                            tokenId : doc.tokenId
                                        };
                                        return res.send({ data, success: true, message: "login success" });
                                    }, (error => {
                                        res.send({ data: {}, error, success: false, message: "DB error" });
                                    }))
                            }
                            else {
                                let tokenId  = uuid();
                                tokenModel.updateOne({ name: user.username }, { tokenId: tokenId, used: false })
                                    .then(result => {
                                        let data = {
                                            user: user,
                                            token: util.loginToken(user._id),
                                            tokenId : tokenId
                                        };
                                        return res.send({ data, success: true, message: "login success" });
                                    })
                                    .catch(error => {
                                        res.send({ data: {}, error, success: false, message: "DB error" });
                                    })
                            }
                        }
                    })

                }
            }, (error => {
                res.send({ data: {}, error, success: false, message: "DB error" });
            }))
    }
    catch (error) {
        res.send({ error, data: {}, success: false, message: "Unknown error" });
    }
};



module.exports.searchUser = (req, res) => {
    try {
        if (!req.body.name || !req.body.contact) {
            return res.send({ success: false, data: {}, message: "name or contact missing" });
        }
        else {
            tokenModel.findOne({username : req.body.name, tokenId : req.body.tokenId})
            .then(doc =>{
                if(!doc) return res.send({data : {}, success : false, message : "please try again"});

                else{
                    if(doc.used == true){
                        return res.send({
                            data : {},
                            success : false, 
                            message : "You are no longer authenticate to visit this page. please login again."
                        })
                    }
                    else{
                        User.findOne({ name: req.body.name, contact: req.body.contact })
                        .then(user => {
                            if (!user) return res.send({ data: {}, success: false, message: "no user found" });
                            else {
                                return res.send({ data: user, success: true, message: "user fetch success" });
                            }
                        })
                        .catch(error => {
                            res.send({ data: {}, error, success: false, message: "DB error" });
                        })
                    }
                }
            })
        }
    }
    catch (error) {
        res.send({ error, data: {}, success: false, message: "Unknown error" });
    }
}


module.exports.logout = (req, res) => {
    try {
        tokenModel.findOne({ username: req.body.name, tokenId: req.body.tokenId })
            .then(data => {
                if (!data) return res.send({ success: false, message: "DB error. please try again" });

                else {
                    if (data.used == true) {
                        return res.send({ success: false, message: "already logout. please login again" });
                    }
                    else{
                        tokenModel.updateOne({ username: req.body.name, tokenId: req.body.tokenId }, {
                            used: true
                        })
                        .then(doc => {
                            return res.send({ success: true, message: "user logout success" });
                        })
                        .catch(error => {
                            return res.send({ error, success: false, message: "logout error.please try again" });
                        })
                    }
                }
            })
            .catch(error => {
                res.send({ error, success: false, message: "DB error" });
            })
    }
    catch (error) {
        res.send({ error, data: {}, success: false, message: "Unknown error" });
    }
}
