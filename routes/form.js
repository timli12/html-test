const express = require("express");
const Form = require("../models/form");
const path = require('path')
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;
router.use(express.urlencoded({ extended: true }));

// ------ basic render ------
router.get("/", async (req, res) => {
    res.sendFile('/var/task/public/homepage.html');
});
router.get("/data", async (req, res) => {
    res.sendFile('/var/task/public/data.html');
});
router.get("/preorder", ensureAuthenticated, async (req, res) => {
    res.sendFile('/var/task/public/preorder.html');
});
router.get("/searching", ensureAuthenticated, async (req, res) => {
    res.sendFile('/var/task/public/searching.html');
});

router.post("/app", async (req, res) => {
    var username = req.session.passport.user.username
    var interest = req.body.interest
    var phonenumber = req.body.phonenumber
    var location = req.body.location
    var date = req.body.date
    var Timestart = req.body.Timestart
    var Timefinish = req.body.Timefinish
    var likes1 = req.body.likes1
    var likes2 = req.body.likes2
    var likes3 = req.body.likes3

    const form = new Form({
        interest: interest,
        phonenumber: phonenumber,
        location: location,
        date: date,
        Timestart: Timestart,
        Timefinish: Timefinish,
        likes1: likes1,
        likes2: likes2,
        likes3: likes3
    });
    try {
        // 使用.save()將資料存進資料庫
        await form.save();
        res.redirect('/');
    } catch (err) {
        // 錯誤訊息發生回傳400 代表使用者傳入錯誤的資訊
        res.status(400).json({ message: err.message});
    }
    await form.save()
});

async function getId(req, res, next) {
    let form;
    try {
        form = await Form.findById(req.body.id)
        if (form == undefined) {
            return res.status(404).json({ message: "Can't find form" })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    // 如果有 則將他加入到res中
    res.form = form
    // 在router中執行middleware後需要使用next()才會繼續往下跑
    next();
}

async function getCode(req, res, next) {
    let form;
    try {
        form = await Form.find({ code: req.body.code});
        if (form == undefined) {
            return res.status(404).json({ message: "Can't find form" })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    // 如果有 則將他加入到res中
    res.form = form
    // 在router中執行middleware後需要使用next()才會繼續往下跑
    next();
}

router.post("/search", getCode, async (req, res) => {
    res.send(res.form)
});

router.post("/delete", getId, async (req, res) => {
    try {
        var c = res.form.code;
        // 刪除
        await res.form.remove();
        // 回傳訊息
        res.send(c)
    } catch (err) {
        // 資料庫操作錯誤將回傳500及錯誤訊息
        res.status(500).json({ message: "remove form faild" })
    }
});

// ------ signin ------
router.get('/signin', async (req, res) => {
    res.sendFile('/var/task/public/signin.html');
  });

router.post('/signin',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/signin',
        failureFlash: true
    }),
    async (req, res) => {
        res.redirect('/')
});

// ------ signup ------
router.get('/signup', async (req, res) => {
    res.sendFile('/var/task/public/signup.html');
});

router.post('/signup', async (req, res) => {
    // Parse Info
    var username = req.body.username
    var password = req.body.password
    var fullname = req.body.fullname
    var code = req.body.code
    //Create User
    var newUser = new User({
        username: username,
        password: password,
        fullname: fullname,
        code: code
    })
    User.createUser(newUser, function(err, user){
        if(err) throw err;
    })
    res.redirect('/signin')
  });

// ------ logout ------
router.get('/logout', async(req, res) => {
    req.logout()
    res.redirect('/signin')
  })

module.exports = router;

async function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
      return next();
    } else {
      req.flash('error_msg', 'you are not logged in')
      res.redirect('/users/signin')
    }
  }
  
passport.use(new LocalStrategy(
    async (username, password, done) => {
        User.findOne({ username: username }, function(err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            User.comparePassword(password, user.password, function(err, isMatch){
                if(err) throw err
                if(isMatch) {
                    return done(null, user)
                }
                else {
                    return done(null, false, {message: 'Invalid password'})
                }
            })
        });
    }
));
  
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(async (id, done) => {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});