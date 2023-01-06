const express = require("express");
const Form = require("../models/form");
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;
router.use(express.urlencoded({ extended: true }));

// ------ basic render ------
router.get("/", async (req, res) => {
    res.sendFile('/var/task/public/index.html');
});
router.get("/data", async (req, res) => {
    res.sendFile('/var/task/public/newdata.html');
});
router.get("/preorder", async (req, res) => {
    res.sendFile('/var/task/public/newpreorder.html');
});

router.post("/app", async (req, res) => {
    var username = req.session.passport.user.username
    var fullname = req.body.fullname
    var code = req.body.code
    var phonenumber = req.body.phonenumber
    var location = req.body.location
    var date = req.body.date
    var Timestart = req.body.Timestart
    var likes1 = req.body.likes1
    var likes2 = req.body.likes2
    var likes3 = req.body.likes3

    const form = new Form({
        username: username,
        fullname: fullname,
        code: code,
        phonenumber: phonenumber,
        location: location,
        date: date,
        Timestart: Timestart,
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
router.post('/signin',
    passport.authenticate('local', {
        failureRedirect: '/signin',
    }),
    async (req, res) => {
        console.log(req.session)
        res.redirect('/')
});

// ------ signup ------
router.get('/signup', async (req, res) => {
    res.sendFile('/var/task/public/register.html');
});

router.post('/signup', async (req, res) => {
    // Parse Info
    var username = req.body.username
    var password = req.body.password
    var code = req.body.code
    //Create User
    var newUser = new User({
        username: username,
        password: password,
        code: code
    })
    User.createUser(newUser, function(err, user){
        if(err) throw err;
    })
    res.redirect('/signin')
  });

module.exports = router;

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        console.log(req.username)
        return next();
    }
    else {
        console.log("B")
        res.redirect('/signin')
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