const express = require('express');
const port = 6001;
const app = express();
const path = require('path')
// const db = require('./config/db')
const Admin = require('./model/admin')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const session = require('express-session')
const localStrategy = require('./config/localStrategy')
const flash = require('connect-flash')
const flashMessages = require('./config/flashMessages')
const mongoose = require('mongoose');
const { check } = require('express-validator');
mongoose.connect("mongodb+srv://srushtitejani20:mMexp0i1kvLcMvnu@cluster0.m56ey.mongodb.net/adminntask").then((res)=>{
    console.log("DB is connected");
}).catch((err)=>{   
    console.log("err");
})
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'assets')))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))


app.use(session({
    name: "srushti",
    secret: "sruKey",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000*60*60
    }
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthUser);
app.use(flash());
app.use(flashMessages.setFlash);

app.use('/', require('./routes/adminRoute'));


app.listen(port, (err) => {
    err ? console.log(err) : console.log("Server is Running on port:", port);
})