/**
 * Created by hasee on 2017/1/15.
 */
var express = require('express');
var User = require("../models/User");
var Category = require("../models/Category");
var Content = require("../models/Content");
var router = express.Router();

router.use(function (req,res,next) {
    if(!req.userInfo.isAdmin){
        res.send("只有管理员才可以进入");
        return;
    }
    next();
});

router.get("/",function (req,res,next) {
    res.render('admin/index',{
        userInfo:req.userInfo
    });
});

router.get("/user",function (req,res,next) {
    //分页操作
    //limit(Number)  限制获取的数据
    //skip(2)  忽略两条数据
    //1： 1-2 skip:0  ->  (当前页 - 1) * limit
    //2:  3-4 skip:2
    //3:  5-6 skip:4
    var page = parseInt(req.query.page|| 1) ;
    var limit =parseInt(req.query.pageSize|| 5) ;
    var sumPages = 0;

    User.count().then(function (count) {
        sumPages = Math.ceil(count / limit);
        page = Math.max(Math.min(page,sumPages),1);
        var skip = (page - 1) * limit;
        User.find().limit(limit).skip(skip).then(function (users) {
            res.render("admin/user_index",{
                userInfo:req.userInfo,
                users:users,
                page:page,
                pageSize:limit,
                sumPages:sumPages,
                url:"/admin/user"
            });
        });
    });
});

router.get("/category",function (req,res,next) {
    var page = parseInt(req.query.page|| 1) ;
    var limit =parseInt(req.query.pageSize|| 5) ;
    var sumPages = 0;

    Category.count().then(function (count) {
        sumPages = Math.ceil(count / limit);
        page = Math.max(Math.min(page,sumPages),1);
        var skip = (page - 1) * limit;

        //sort  1:升序  -1：降序   注意添加的id是有一个默认的时间戳的，所以可以按照这个排
        Category.find().sort({_id:-1,}).limit(limit).skip(skip).then(function (categories) {
            res.render("admin/category_index",{
                userInfo:req.userInfo,
                categories:categories,
                page:page,
                pageSize:limit,
                sumPages:sumPages,
                url:'/admin/category'
            });
        });
    });
});

router.get("/category_add",function (req,res,next) {
    res.render('admin/category_add',{
        userInfo:req.userInfo
    });
});

router.post("/category/add",function (req,res,next) {
    var name = req.body.name || '';
    if(!name){
        res.render("admin/error",{
            userInfo:req.userInfo,
            errText:"用户名不能为空"
        });
        return;
    }

    //数据库中查找是否存在相同的分类
    Category.findOne({name:name}).then(function(rs){
        if(rs){
            res.render('admin/error',{
                userInfo:req.userInfo,
                errText:"已经存在相同分类"
            });
            // return Promise.reject();
        }else{
            return new Category({
                name:name
            }).save();

        }
    }).then(function (newCate) {
        //save成功返回保存的记录对象，要是没走保存就会返回undefined
        if(newCate){
            res.render('admin/success',{
                userInfo:req.userInfo,
                successText:"保存成功",
                url:"/admin/category"
            });
        }
    });
});
//分类修改
router.get('/category/edit',function (req,res) {
    //获取要修改的信息，并且用表单的形式展现出来
    var id = req.query.id || '';
    Category.findOne({
        _id:id
    }).then(function (category) {
        if(!category){
            res.render('admin/error',{
                userInfo:req.userInfo,
                errText:'该分类不存在'
            });
        }else{
            res.render('admin/category_edit',{
                userInfo:req.userInfo,
                category:category
            });
        }
    });
});
router.post('/category/edit',function (req,res,next) {
    var id = req.body.id|| '';
    var name = req.body.name || '';
    Category.findOne({
        _id:id
    }).then(function (category) {
        if(!category){
            res.render('admin/error',{
                userInfo:req.userInfo,
                errText:'该分类不存在'
            });
            return Promise.reject();
        }else{
            if(name == category.name){
                res.render('admin/success',{
                    userInfo:req.userInfo,
                    successText:'修改成功没有进入数据库',
                    url:"/admin/category"
                });
                return Promise.reject();
            }else{
                return Category.findOne({
                    _id:{$ne:id},   //找到一条内容和我要修改的一样，但是id不一样的数据
                    name:name
                });
            }
        }
    }).then(function (category) {
        if(category){
            //数据库中存在同名分类
            res.render('admin/error',{
                userInfo:req.userInfo,
                errText:"数据库中存在同名分类"
            });
            return Promise.reject();
        }else{
            return Category.update({
                _id:id
            },{
                name:name
            });
        }
    }).then(function () {
        res.render('admin/success',{
            userInfo:req.userInfo,
            successText:'修改成功',
            url:"/admin/category"
        });
    });

});
//分类删除
router.get('/category/delete',function (req,res,next) {
    var id = req.query.id || '';
    Category.remove({
        _id:id
    }).then(function () {
        res.render('admin/success',{
            userInfo:req.userInfo,
            successText:'删除成功',
            url:"/admin/category"
        });
    });
});
//内容首页
router.get('/content',function (req,res,next) {
    var page = parseInt(req.query.page|| 1) ;
    var limit =parseInt(req.query.pageSize|| 5) ;
    var sumPages = 0;

    Content.count().then(function (count) {
        sumPages = Math.ceil(count / limit);
        page = Math.max(Math.min(page,sumPages),1);
        var skip = (page - 1) * limit;

        //sort  1:升序  -1：降序   注意添加的id是有一个默认的时间戳的，所以可以按照这个排
        //populate里的指对应表里的字段名称，获取关联表对应的数据
        Content.find().sort({_id:-1,}).limit(limit).skip(skip).populate(['category','user']).then(function (contents) {
            res.render("admin/content_index",{
                userInfo:req.userInfo,
                contents:contents,
                page:page,
                pageSize:limit,
                sumPages:sumPages,
                url:'/admin/content'
            });
        });
    });
});

router.get('/content/add',function (req,res,next) {
    Category.find().sort({_id:-1}).then(function(categories){
        res.render("admin/content_add",{
            userInfo:req.userInfo,
            categories:categories
        });
    });
});

//提交内容
router.post('/content/add',function (req,res,next) {
    if(req.body.content == ""){
        res.render('admin/error',{
            userInfo:req.userInfo,
            errText:"内容不能为空"
        });
        return;
    }
    
    new Content({
        category:req.body.category,
        user:req.userInfo._id.toString(),
        title:req.body.title,
        description:req.body.description,
        content:req.body.content,

    }).save().then(function (rs) {
        res.render('admin/success',{
            userInfo:req.userInfo,
            successText:"内容保存成功",
            url:"/admin/content"
        });
    }).catch(function (err) {
        console.log(err);
    });
    
    
});

//修改内容
router.get('/content/edit',function (req,res) {
    var id = req.query.id || '';
    Category.find().sort({_id:-1}).then(function (cas) {
        Content.findOne(
            {_id:id}
        ).populate("category").then(function(content){
            if(!content){
                res.render('admin/error',{
                    userInfo:req.userInfo,
                    errText:'该内容不存在'
                });
                return Promise.reject();
            }else{
                res.render('admin/content_edit',{
                    userInfo:req.userInfo,
                    content:content,
                    categories:cas
                });

            }

        });
    });
});

router.post('/content/edit',function (req,res) {
    var id = req.query.id || '';
    if(req.body.content == ""){
        res.render('admin/error',{
            userInfo:req.userInfo,
            errText:"内容不能为空"
        });
        return;
    }

    Content.update({
        _id:id
    },{
        category:req.body.category,
        title:req.body.title,
        description:req.body.description,
        content:req.body.content
    }).then(function () {
        res.render('admin/success',{
            userInfo:req.userInfo,
            successText:"内容保存成功",
            url:"/admin/content"
        });

    }).catch(function (err) {
        console.log("内容修改报错："+err);
    });

});

router.get("/content/delete",function (req,res) {
    var id = req.query.id || '';
    Content.remove({
        _id:id
    }).then(function () {
        res.render('admin/success',{
            userInfo:req.userInfo,
            successText:'删除成功',
            url:"/admin/content"
        });
    });
});


module.exports = router;

