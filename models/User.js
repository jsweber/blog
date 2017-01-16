/**
 * Created by hasee on 2017/1/15.
 */
//model基于表结构（schemas）产生
var mongoose = require("mongoose");
var usersSchema = require("../schemas/users");

module.exports = mongoose.model("User",usersSchema);   //返回的是一个构造函数，是一个你根据schema产生的表的构造函数，实例化可以得到具体的表对象，new User({ username:"du",password:"123456" });



