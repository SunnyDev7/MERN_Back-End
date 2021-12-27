const User = require("../models/user")

exports.signup = (req, res) => {
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


exports.signout = (req, res) => {
    res.json({
        message: "User signout`"
    }) 
};

