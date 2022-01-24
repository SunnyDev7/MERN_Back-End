const User = require("../models/user");
const { check, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

//SignUp
exports.signup = (req, res) => {

    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg,
            field: errors.array()[0].param
        })
    }

    const user = new User(req.body)
    user.save((err, user) => {
        if(err){
            return res.satus(400).json({
                err: "Not able to save user in db"
            })
        }
        res.json(user)
    })
}

//SignIn
exports.signin = (req, res) => {
    const errors = validationResult(req)
    const {email, password} = req.body; 

    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg,
            field: errors.array()[0].param
        })
    }

    User.findOne({email}, (err, user) => {
        if(err || !user){
            return res.status(400).json({
                error: "User email does not exist"
            })
        }

        if(!user.autheticate(password)){
            return res.status(401).json({
                error: "Email and Password do not match"
            })
        }

        //Create Token
        const token = jwt.sign({_id: user._id}, process.env.SECRET)

        //Put token in cookie
        res.cookie("token", token, {expire: new Date() + 9999});

        //Send response to frontend
        const {_id, name, email, role} = user;
        return res.json({token, user: {_id, name, email, role}});

    })

}

//SignOut
exports.signout = (req, res) => {
    res.clearCookie("token")
    res.json({
        message: "User signout successfully"
    }) 
};

//Protected routes
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth"
});


//Custom Middlewares
exports.isAuthenticaed = (req, res, next) => {
    //req.profile is gonna come up from frontend
    let checker = req.profile && req.auth && req.profile._id === req.auth._id;
    if(!checker){
        return res.status(403).json({
            error: "Access Denied!!!"
        })
    }
    next();
}

exports.isAdmin = (req, res, next) => {
    if(req.profile.role === 0){
        return res.status(403).json({
            error: "You are not ADMIN, Access denied!!!"
        })
    }
    next();
}