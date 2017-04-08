/**
 * Created by hasee on 2017/1/15.
 */
var express = require('express');
var router = express.Router();
var User = require("../models/User");
var Content = require("../models/Content");
var Category = require("../models/Category");
var Tools = require("../lib/Tools");

var common_data = {};

router.use(function (req,res,next) {
    common_data = {
        userInfo:req.userInfo,
        categories:[]
    };
    Category.find().then(function (categories) {
        // categories是读取数据库返回的数组对象
        common_data.categories = categories;
        next();
    });
});

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

router.post("/user/login",function (req,res,next) {
    var username = req.body.username;
    var password = req.body.password;

    if(username == "" || password == ""){
        responseData.code = 1;
        responseData.message = "用户名或者密码不能为空";
        res.json(responseData);
        return;
    }

    User.findOne({
        username:username,
        password:password
    }).then(function(userInfo){
        if(!userInfo){
            responseData.code = 2;
            responseData.message = "用户名或者密码错误";
            res.json(responseData);
            return;
        }

        responseData.message = "登陆成功";
        responseData.userInfo={
            _id:userInfo._id,
            username:userInfo.username
        };
        req.cookies.set('userInfo',JSON.stringify({
            _id:userInfo._id,
            username:userInfo.username
        }));
        res.json(responseData);
        return;
    });

});

//退出
router.get("/user/logout",function (req,res) {
    req.cookies.set("userInfo",null);
    res.json(responseData);
});

//评论
router.post('/comment/post',function(req,res){
    var contentId = req.body.contentId || "";
    var postData={
        username:req.userInfo.username,
        postTime:new Date(),
        content:req.body.content || "",
    };

    Content.findOne({
        _id:contentId
    }).then(function(content){
        content.comments.push(postData);
        return content.save();
    }).then(function (newContent) {
        responseData.message = "提交成功";
        responseData.data = newContent;
        res.json(responseData);
    }).catch(function (err) {
        console.log(err);
    });
});

router.get("/comment/list",function (req,res) {

    var data = {
        limit: Number(req.query.limit || 3),
        page:req.query.page || 1
    };

    Tools.clone(data,common_data);

    Content.findOne({
        _id:req.query.content
    }).then(function (content) {
        data.pages = Math.ceil(content.comments.length/data.limit);
        data.page = Math.max(1,Math.min(data.page,data.pages));
        data.skip = data.limit*(data.page - 1);
        data.comments = content.comments.reverse().slice(data.skip,data.skip+data.limit);
        data.content = content;
        res.render('main/view',data);
    });

});

module.exports = router;