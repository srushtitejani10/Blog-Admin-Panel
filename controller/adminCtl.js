
const Admin = require('../model/admin')
const path = require('path')
const fs = require('fs')
const nodemailer = require('nodemailer')
const category = require('../model/category')
const blog = require('../model/blog')
const { validationResult } = require('express-validator')


module.exports.signIn = async (req, res) => {
    try {
        return res.render('signIn')
    } catch (error) {
        console.log(error)
        return res.redirect('back');
    }
}

module.exports.checkSignIn = async (req, res) => {
    try {
        req.flash('success', "Admin signIn Successfully...")
        return res.redirect('/dashboard')
    } catch (error) {
        req.flash('error', "Admin not signIn ")

        return res.redirect('back')
    }
}

module.exports.logOut = async (req, res) => {
    try {
        req.session.destroy(function (err) {
            if (err) {
                return false;
            }
            return res.redirect('/')
        })
    } catch (error) {
        console.log(error);
        return res.redirect('back')
    }
}


module.exports.myProfile = async (req, res) => {
    try {
        return res.render('myProfile')
    } catch (error) {
        console.log(error);
        return res.redirect('back')
    }
}

module.exports.changePass = async (req, res) => {
    try {
        return res.render('changePass')
    } catch (error) {
        console.log(error);
        return res.redirect('back')
    }
}

module.exports.changeNewPass = async (req, res) => {
    try {
        oldPass = req.cookies.adminData
        if (oldPass.password == req.body.currentPass) {
            if (req.body.currentPass != req.body.newPass) {
                if (req.body.newPass == req.body.confirmPass) {
                    let changePass = await Admin.findByIdAndUpdate(oldPass._id, { password: req.body.newPass })
                    console.log("Password is succesfully chnage...");
                    return res.redirect('/logOut')
                } else {
                    console.log("New password and Confirm Password are not match...");
                    return res.redirect('back')
                }
            } else {
                console.log("Current password and New Password are match...");
                return res.redirect('back')
            }
        } else {
            console.log("Old password and Current Password are not match...");
            return res.redirect('back')
        }

    } catch (error) {
        console.log(error);
        return res.redirect('back')
    }
}

module.exports.dashboard = async (req, res) => {
    try {
        const categoryData = await category.find({ status: true })

        let categoryDataName = []
        let categoryDataValue = []
        let categoryNameAll = []
        categoryData.map((v, i) => {
            if (v.blogId.length > 0) {
                categoryDataName.push(v.categoryName)
            }
            categoryDataValue.push(v.blogId.length)
            categoryNameAll.push(v.categoryName)
        })
        const blogData = await blog.find({status:true})

        return res.render('dashboard', {
            categoryData,
            blogData,
            categoryDataName,
            categoryDataValue,
            categoryNameAll
        })

    } catch (error) {
        console.log(error);
        return res.redirect('back')
    }
}

module.exports.addAdmin = async (req, res) => {
    try {
        return res.render('addAdmin',{
            errorsData :[],
            old:[]
        })
    }
    catch (error) {
        console.log(error);
        return res.redirect('back')
    }
}

module.exports.insertAdminRecords = async (req, res) => {
    try {

        const errors = validationResult(req);
        console.log(errors.mapped());
        if(!errors.isEmpty()){
            return res.render('addAdmin',{
                errorsData:errors.mapped(),
                old:req.body
            })
        }
        adminImage = '';
        if (req.file) {
            adminImage = await Admin.imgPath + '/' + req.file.filename;
        }
        req.body.image = adminImage;
        req.body.name = req.body.fname + ' ' + req.body.lname;
        await Admin.create(req.body);
        req.flash('success', "Add Admin Successfully...")
        return res.redirect('/viewAdmin')
    } catch (error) {
        console.log(error);
        return res.redirect('back')
    }
}

module.exports.viewAdmin = async (req, res) => {
    try {

        let search = '';
        let perPage = 3;
        let page = 0;


        if (req.query.search) {
            search = req.query.search
        }

        if (req.query.page) {
            page = req.query.page
        }

        let sortValue = parseInt(req.query.sortValue) || 1;

        var viewAdmin = await Admin.find({
            $or: [
                { email: { $regex: search, $options: 'i' } },
                { hobby: { $regex: search, $options: 'i' } },
                { message: { $regex: search, $options: 'i' } }
            ]
        }).skip(perPage * page).limit(perPage).sort({ name: sortValue })

        var totalsAdminRecords = await Admin.find({
            $or: [
                { email: { $regex: search, $options: 'i' } },
                { hobby: { $regex: search, $options: 'i' } },
                { message: { $regex: search, $options: 'i' } }
            ]
        }).countDocuments();

        const totalAdminsPages = Math.ceil(totalsAdminRecords / perPage)


        if (viewAdmin) {
            return res.render('viewAdmin', {
                viewAdmin,
                search,
                page: parseInt(page),
                totalAdminsPages
            })
        }
    } catch (error) {
        console.log(error);
        return res.redirect('back');
    }
}

module.exports.deleteAdmin = async (req, res) => {
    try {
        let id = req.params.id;
        let deleteAdmin = await Admin.findById(id);
        if (deleteAdmin) {
            let deletePath = path.join(__dirname, '..', deleteAdmin.image);
            await fs.unlinkSync(deletePath)
        }
        await Admin.findByIdAndDelete(id);
        req.flash('success', "Delete Admin Successfully..")
        return res.redirect('back');
    } catch (error) {
        console.log(error);
        return res.redirect('back');
    }
}

module.exports.editAdmin = async (req, res) => {
    try {
        let id = req.params.id;
        let editAdmin = await Admin.findById(id)

        let fullName = editAdmin.name.split(' ');
        if (editAdmin) {
            return res.render('editAdmin', {
                editAdmin,
                fullName,
            })
        }
    } catch (error) {
        console.log(error);
        return res.redirect('back')
    }
}

module.exports.editAdminRecords = async (req, res) => {
    try {
        let editId = req.body.id;
        if (req.file) {
            let editAdmin = await Admin.findById(editId);
            if (editAdmin) {
                let oldImgPath = path.join(__dirname, '..', editAdmin.image)
                fs.unlinkSync(oldImgPath)
            }
            else {
                req.flash('error', "Something Wrong")
                return res.redirect('back')
            }
            req.body.name = req.body.fname + ' ' + req.body.lname;
            req.body.image = Admin.imgPath + '/' + req.file.filename;
            await Admin.findByIdAndUpdate(editId, req.body);
            req.flash('success', "Update Admin Successfully..")
            return res.redirect('/viewAdmin')
        } else {
            let adminData = await Admin.findById(editId);
            req.body.name = req.body.fname + ' ' + req.body.lname;
            req.body.image = adminData.image;
            await Admin.findByIdAndUpdate(editId, req.body);
            req.flash('success', "Update Admin Successfully..")
            return res.redirect('/viewAdmin')
        }
    } catch (error) {
        console.log(error);
        return res.redirect('back')
    }
}


module.exports.deleteMultipleAdmins = async (req, res) => {
    try {
        console.log(req.body.Ids);
        let adminDelete = await Admin.deleteMany({ _id: { $in: req.body.Ids } })
        if (adminDelete) {
            req.flash('success', "Multiple Delete Successfully")
            return res.redirect('back')
        }
        else {
            req.flash('error', " not Multiple Delete")

            return res.redirect('back')
        }
    } catch (error) {
        console.log(error);
        return res.redirect('back')
    }
}
module.exports.changeAdminStatus = async (req, res) => {
    try {
        let adminStatusUpdate = await Admin.findByIdAndUpdate(req.query.AdminId, { status: req.query.status })
        if (adminStatusUpdate) {
            req.flash('success', "Change Status  Successfully")
            return res.redirect('back')
        } else {
            req.flash('error', " not Status Change")
            return res.redirect('back')
        }
    } catch (error) {
        console.log(error);
        return res.redirect('back')
    }
}


// start otp 

module.exports.checkEmail = async (req, res) => {
    try {
        return res.render('checkEmail')
    } catch (error) {
        console.log(error);
        return res.redirect('back')
    }
}

module.exports.emailVerify = async (req, res) => {
    try {
        let singleOnj = await Admin.find({ email: req.body.email }).countDocuments();
        if (singleOnj == 1) {
            let singleData = await Admin.findOne({ email: req.body.email })
            let OTP = Math.floor(Math.random() * 10000000);
            console.log("OTP=>", OTP);

            res.cookie('OTP', OTP)
            res.cookie('Email', singleData.email)
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for port 465, false for other ports
                auth: {
                    user: "krishnabhutaiya1512@gmail.com",
                    pass: "xussexxexmphtpyw",
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
            const info = await transporter.sendMail({
                from: 'krishnabhutaiya1512@gmail.com', // sender address
                to: singleData.email, // list of receivers
                subject: "Hello ✔", // Subject line
                text: "Hello world?", // plain text body
                html: `<b>OTP: ${OTP}</b>`, // html body
            });

            console.log("OTP sended");
            req.flash('success', "OTP sended successfully")
            return res.redirect('/checkOtp')


        } else {
            req.flash('error', "Invalid OTP")
            return res.redirect('back')
        }
    } catch (error) {
        console.log(error);
        return res.redirect('back')
    }
}

module.exports.checkOtp = async (req, res) => {
    try {
        return res.render('checkOtp')
    } catch (error) {
        console.log(error);
        return res.redirect('back')
    }
}

module.exports.otpVerify = async (req, res) => {
    try {
        console.log(req.body);
        console.log(req.cookies.OTP);
        if (req.body.otp == req.cookies.OTP) {
            res.clearCookie('OTP')
            req.flash('success', "OTP verifySuccessfully...")
            return res.redirect('/forgotPass')
        } else {
            req.flash('error', "Invalid OTP")
            return res.redirect('back')
        }

    } catch (error) {
        console.log(error);
        return res.redirect('back')
    }
}

module.exports.forgotPass = async (req, res) => {
    try {
        return res.render('forgotPass')
    } catch (error) {
        console.log(error);
        return res.redirect('back')
    }
}

module.exports.verifyPass = async (req, res) => {
    try {
        if (req.body.newPass == req.body.confirmPass) {
            let checkLastTime = await Admin.find({ email: req.cookies.email }).countDocuments()
            if (checkLastTime == 1) {
                let adminNewPass = await Admin.findOne({ email: req.cookies.email })
                let changePass = await Admin.findByIdAndUpdate(adminNewPass.id, { password: req.body.newPass })
                if (changePass) {
                    res.clearCookie('email')
                    req.flash('success', "change Password successfully...")
                    return res.redirect('/')
                }
            } else {
                req.flash('error', "Email is not found")
                return res.redirect('back')
            }
        } else {
            req.flash('error', "New Password and Confirm Password are not match...")
            return res.redirect('back')
        }

    } catch (error) {
        console.log(error);
        return res.redirect('back')
    }
}



// end otp 