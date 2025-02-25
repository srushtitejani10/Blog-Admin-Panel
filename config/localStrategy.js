const passport = require('passport')
const localStrategy = require('passport-local').Strategy;
const Admin = require('../model/admin')
const User = require('../model/user');

passport.use(new localStrategy({
    usernameField: 'email',
},
    async function (email, password, done) {
        let adminData = await Admin.findOne({ email: email })
        if (adminData) {
            if (adminData.password == password) {
                return done(null, adminData)
            } else {
                console.log("Password is not valid");                
                return done(null, false)
            }
        } else {
            return done(null, false)
        }
    }))

passport.use('userAuth',new localStrategy({
        usernameField: 'email',
    },
        async function (email, password, done) {
            let userData = await User.findOne({ email: email })
            if (userData) {
                if (userData.password == password) {
                    return done(null, userData)
                } else {
                    return done(null, false)
                }
            } else {
                return done(null, false)
            }
        }))

passport.serializeUser(function (user, done) {
    return done(null, user.id)
})

passport.deserializeUser(async function (id, done) {
    let adminRecord = await Admin.findById(id)
    if (adminRecord) {
        return done(null, adminRecord)
    } else {
        const userData = await User.findById(id);
        if(userData){
            return done (null,userData)
        }
        else{
            return done(null, false);
        }
    }
})

passport.setAuthUser = function (req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = req.user
    }
    next();
}

passport.checkAuthUser = function(req,res,next){
    if (req.isAuthenticated()) {
        next();
    } else {
        return res.redirect('/signIn')
    }
}

module.exports = passport;