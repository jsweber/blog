/**
 * Created by hasee on 2017/1/15.
 */
var express = require('express');
var router = express.Router();

router.get("/index",function (req,res,next) {
    res.render("main/index");
});

module.exports = router;