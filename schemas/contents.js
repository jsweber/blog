/**
 * Created by hasee on 2017/1/21.
 */
var mongoose = require("mongoose");

module.exports = new mongoose.Schema({
    //关联字段 - 分类的id
    category:{
        //类型
        type:mongoose.Schema.Types.ObjectId,
        //引用
        ref:'Category'
    },
    //关联用户id
    user:{
        //类型
        type:mongoose.Schema.Types.ObjectId,
        //引用
        ref:'User'
    },
    addTime:{
        type:Date,
        default:new Date()
    },
    views:{
        type:Number,
        default:0
    },
    title:String,  //分类标题
    description:{
        type:String,
        default:""
    },
    content:{
        type:String,
        default:""
    },
    comments:{
        type:Array,
        default:[]
    }

});