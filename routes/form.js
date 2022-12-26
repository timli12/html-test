const express = require("express");
const Form = require("../models/form");
const router = express.Router();

router.get("/app", async (req, res) => {
    res.json("Hello World")
});
router.post("/app", async (req, res) => {
    const form = new Form({
        fullname: req.body.fullname,
        identity: req.body.code,
        gender: req.body.interest,
        phone: req.body.phonenumber,
        location: req.body.location,
        date: req.body.date,
        stime: req.body.Timestart,
        etime: req.body.Timefinish,
        cook: req.body.likes1,
        bath: req.body.likes2,
        clean: req.body.likes3
    });
    try{
        const newForm = await form.save();
        res.status(201).json("success");
    } catch (err){
        res.status(400).json({ message: err.message });
    }
});

async function getId(req, res, next) {
    let form;
    try {
        form = await Form.findById(req.body.identity);
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