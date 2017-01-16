/**
 * Created by hasee on 2017/1/15.
 */
var HOST = "localhost:8081";

var $toast = $(".message-toast");
$(".register-btn").on("click",function(){
    $.ajax({
        type:"post",
        url:"/api/user/register",
        data:{
            username:$("#username").val(),
            password:$("#password").val(),
            repassword:$("#repassword").val()
        },
        dataType:"json",
        success:function(data){
            if(data.code === 0){  //注册成功
                toast(data.message,1500,function(){
                    $(".register-box").hide();
                    $(".login-box").show();
                });
                return;
            }
            toast(data.message);
        },
        error:function(err){
            toast(err);
        }
    });

});

function toast(text,time,cb){
    time = time || 3000;
    setTimeout(function(){
        $toast.html("");
        cb && cb();
    },time);
    $toast.html(text);
}

