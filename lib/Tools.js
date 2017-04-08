/**
 * Created by hasee on 2017/1/30.
 */
module.exports = {
    clone:clone
};

function clone(obj1,obj2) {
    for(var attr in obj2){
        obj1[attr] = obj2[attr];
    }
}