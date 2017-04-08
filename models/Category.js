/**
 * Created by hasee on 2017/1/20.
 */
var mongoose = require("mongoose");
var categoriesSchema = require('../schemas/categories');

module.exports = mongoose.model('Category',categoriesSchema);

