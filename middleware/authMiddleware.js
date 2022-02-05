const jwt = require(`jsonwebtoken`);
const User = require(`../models/User`);

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    // check jwt is present and is verified
    if (token) {
        jwt.verify(token, `any long secret string like this one here, "hey...I am the secret string"`, 
        (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect(`/login`);
            } else {
                console.log(decodedToken);
                next();
            }
        })
    } else {
        res.redirect(`/login`);
    }
}

// check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, `any long secret string like this one here, "hey...I am the secret string"`, 
        async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            } else {
                console.log(decodedToken);
                let user = await User.findById(decodedToken._id);
                res.locals.user = user;
                next();
            }
        })
    } else {
        res.locals.user = null;
        next();
    }
}

module.exports = { requireAuth, checkUser };