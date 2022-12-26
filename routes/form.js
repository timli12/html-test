const express = require("express");
const Form = require("../models/form");
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.get("/app", async (req, res) => {
    res.json("Hello World")
});
router.post("/app", async (req, res) => {
    var fullname = req.body.fullname;
    var code = req.body.code
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
        fullname: fullname,
        code: code,
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
        // 回傳status:201代表新增成功 並回傳新增的資料
        res.json("success");
        res.location('/preorder');
        res.redirect('/preorder');
    } catch (err) {
        // 錯誤訊息發生回傳400 代表使用者傳入錯誤的資訊
        res.status(400).json({ message: err.message, name: fullname });
    }
    await form.save()
});
async function getId(req, res, next) {
    let form;
    try {
        form = await Form.findById(req.body.code);
        if (form == undefined) {
            return res.status(404).json({ message: "Can't find todo" })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    // 如果有該事項 則將他加入到res中
    res.form = form
    // 在router中執行middleware後需要使用next()才會繼續往下跑
    next();
}

router.post("/search", getId, async (req, res) => {
    res.send(res.form)
});

router.post("/delete", getId, async (req, res) => {
    try {
        // 將取出的待辦事項刪除
        await res.form.remove();
        // 回傳訊息
        res.json({ message: "Delete todo succeed" })
    } catch (err) {
        // 資料庫操作錯誤將回傳500及錯誤訊息
        res.status(500).json({ message: "remove todo faild" })
    }
});

module.exports = router;