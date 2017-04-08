/**
 * Created by hasee on 2017/1/21.
 */
var mongoose = require("mongoose");
var contentSchema = require('../schemas/contents');

module.exports = mongoose.model("Content",contentSchema);