/**
 * Created by hasee on 2017/1/15.
 */
var express = require('express');
var Category = require("../models/Category");
var Content = require("../models/Content");
var router = express.Router();

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

router.get("/index",function (req,res,next) {
    var data={
        category:req.query.category || "",
        page:Number(req.query.page || 1),
        limit:2,
        pages:0
    };

    clone(data,common_data);

    //当请求带category时，代表不是全部分页
    var where = {};
    if(data.category){
        where.category = data.category;
    }

    Content.where(where).count().then(function (count) {
        data.pages = Math.ceil(count / data.limit);
        data.page = Math.max(1,Math.min(data.pages,data.page));
        data.skip = data.limit * (data.page - 1);
        return Content.where(where).find().limit(data.limit).skip(data.skip).populate(['user','category']).sort({addTime:-1});
    }).then(function (contents) {
        data.contents = contents;
        res.render('main/index',data);
    }).catch(function (err) {
        console.log(err);
    });
});

router.get('/view',function (req,res,next) {
    var contentId = req.query.content || "";
    var data = {
        limit: Number(req.query.limit || 3),
        page:req.query.page || 1
    };
    clone(data,common_data);

    Content.findOne({
        _id:contentId
    }).then(function (content) {
        data.pages = Math.ceil(content.comments.length/data.limit);
        data.page = Math.max(1,Math.min(data.page,data.pages));
        data.skip = data.limit*(data.page - 1);
        data.comments = content.comments.reverse().slice(data.skip,data.skip+data.limit);
        content.views++;
        content.save();
        data.content = content;
        res.render('main/view',data);
    });
    
});



function clone(obj1,obj2) {
    for(var attr in obj2){
        obj1[attr] = obj2[attr];
    }
}

module.exports = router;