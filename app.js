/**
 * Created by hasee on 2017/1/15.
 */
var express = require("express");
var swig = require("swig");
var mongoose = require("mongoose");
//用来处理post提交的数据
var bodyParser = require('body-parser');

//app = >  http.createServer();
var app = express();
//设置静态文件托管，当用户访问的url以/public开始直接返回__dirname+"/public"下对应的文件
app.use('/public',express.static(__dirname+"/public"));
//console.log(__dirname); //\code\nodejs\blog

//配置模板
//第一个参数表示模板名称，同时也是模板文件的后缀，第二个参数表示用于处理模板内容的方法
app.engine("html",swig.renderFile);
//设置模板存放的目录，param1 必须是views，param2是目录
app.set('views','./views');
//注册模板文件存放的目录，param1必须是view engine param2是和app.engine定义的模板引擎的名称一致的
app.set("view engine",'html');
//在开发过程中需要取消模板缓存的机制，方便开发中调试
swig.setDefaults({cache:false});
//会在req上保存一个body属性
app.use(bodyParser.urlencoded({extended:true}));

//根据功能进行模块划分
app.use('/admin',require('./routers/admin'));
app.use("/api",require("./routers/api"));
app.use("/",require("./routers/main"));
//数据启动不需要每次用户发请求都启动，所以放app.js这里
mongoose.connect("mongodb://localhost:27018/blog",function(err){
    if(err){
        console.log("数据库连接失败");
    }else{
        console.log("数据库连接成功");
        app.listen(8081);
    }
});


/*
*   /public  -> 静态  ->  直接读取目录下的文件，返回用户
*   /动态  - >  处理业务逻辑，加载模板，解析模板，返回数据给用户
*
*  模块划分：
*  根据功能进行模块划分
*  前台模块
*  后台模块
*  API模块
*   使用app.use() 进行模块划分
*   app.use('/admin',require('./routers/admin));
*   app.use("/api",require("./routers/api"));
*   app.use("/",require("./routers/main"));
* */



