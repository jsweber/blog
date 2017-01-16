/**
 * Created by hasee on 2017/1/15.
 */
var express = require('express');
var router = express.Router();
var User = require("../models/User");

//统一返回格式
var responseData;
router.use(function (req,res,next) {
    responseData = {
        code:0,
        message:""
    }
    next();
});

/*
* 用户注册逻辑
* 1.用户名不能为空
* 2.密码不能为空
* 3.两次输入密码必须一致
*
*
* 1.用户是否已经被注册
*   数据库查询
*
* */

router.post("/user/register",function (req,res,next) {
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;

    if(username==''){
        responseData.code = 1;
        responseData.message="用户名不能为空";
        res.json(responseData);
        return;
    }

    if(password==''){
        responseData.code = 2;
        responseData.message="密码不能为空";
        res.json(responseData);
        return;
    }

    if(password != repassword){
        responseData.code = 3;
        responseData.message="两次输入密码不一致";
        res.json(responseData);
        return;
    }
    //数据库中查找用户名是否被注册
    User.findOne({
        username:username
    }).then(function(userInfo){
        if(userInfo){
            //数据库中有该记录
            responseData.code = 4;
            responseData.message = "用户名已经被注册了";
            res.json(responseData);
            return;
        }
        //不存在返回null,保存用户信息
        var user = new User({
            username:username,
            password:password
        });
        return user.save();

    }).then(function(addNewUserInfo){   //addNewUserInfo  为上面返回的return内容
        console.log(addNewUserInfo);
        responseData.message="注册成功";
        res.json(responseData);
    }).catch(function(err){
        console.log("注册err："+err);
    });

});

module.exports = router;