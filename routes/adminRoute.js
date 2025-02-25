const express = require('express');
const routes = express.Router();
const Admin = require('../model/admin')
const adminCtl = require('../controller/adminCtl')
const passport = require('passport');
const { check, validationResult } = require('express-validator');

routes.use('/', require('./userPanelRoute'))

routes.get('/signIn', adminCtl.signIn)

routes.post('/checkSignIn', passport.authenticate('local', { failureRedirect: '/signIn' }), adminCtl.checkSignIn)

routes.get('/logOut', adminCtl.logOut)

routes.get('/myProfile', passport.checkAuthUser, adminCtl.myProfile)

routes.get('/changePass', passport.checkAuthUser, adminCtl.changePass)

routes.post('/changeNewPass', adminCtl.changeNewPass)

routes.get('/dashboard', passport.checkAuthUser, adminCtl.dashboard)

routes.get('/addAdmin', passport.checkAuthUser, adminCtl.addAdmin)

routes.post('/insertAdminRecords', Admin.uploadImgFile, [
    check('fname').notEmpty().withMessage("*first name is required").isLength({ min: 2 }).withMessage("*first name has minimum 2 word"),
    check('lname').notEmpty().withMessage("*last name is required").isLength({ min: 2 }).withMessage("*last name has minimum 2 word"),
    check('email').notEmpty().withMessage("*Email is required").isEmail().withMessage("*Enter valid Email").custom(async (value) => {
        let checkEmail = await Admin.find({ email: value }).countDocuments()
        if (checkEmail > 0) {
            throw new Error("*admin Email is already Exits");
        }
    }
    ),
    check('password').notEmpty().withMessage("*Password is required").matches(/^(?=.\d)(?=.[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i").withMessage("*Password has uppercase, one character is lowercase"),
    check('hobby').notEmpty().withMessage("*hobby is required").isLength({ min: 2 }).withMessage("*hobby has minimum 2 word"),
    check('city').notEmpty().withMessage("*city is required").isLength({ min: 2 }).withMessage("*city has minimum 2 word"),
    check('gender').notEmpty().withMessage("*gender is required").isLength({ min: 2 }).withMessage("*gender has minimum 2 word"),
    check('message').notEmpty().withMessage("*message is required").isLength({ min: 5, max: 500 }).withMessage("*message has minimum 5 words and maximum 500 words"),
], adminCtl.insertAdminRecords);

routes.get('/viewAdmin', passport.checkAuthUser, adminCtl.viewAdmin)

routes.get('/deleteAdmin/:id', adminCtl.deleteAdmin)

routes.get('/editAdmin/:id', passport.checkAuthUser, adminCtl.editAdmin)

routes.post('/editAdminRecords', Admin.uploadImgFile, adminCtl.editAdminRecords)

routes.use('/category', require('../routes/categoryRoute'))

routes.post('/deleteMultipleAdmins', adminCtl.deleteMultipleAdmins)

routes.get('/changeAdminStatus', adminCtl.changeAdminStatus)


// start otp 

routes.get('/checkEmail', adminCtl.checkEmail)

routes.post('/emailVerify', adminCtl.emailVerify)

routes.get('/checkOtp', adminCtl.checkOtp)

routes.post('/otpVerify', adminCtl.otpVerify)

routes.get('/forgotPass', adminCtl.forgotPass)

routes.post('/verifyPass', adminCtl.verifyPass)

// end otp 

module.exports = routes
