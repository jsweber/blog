/**
 * Created by hasee on 2017/1/15.
 */
$(function () {
    var HOST = "localhost:8081";

    var $toast = $(".message-toast");
//没有账号去注册
    $("#show-register-box").on("click",function(){
        $(".register-box").show();
        $(".login-box").hide();
    });

//注册
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

//登陆
    $(".login-btn").on("click",function(){
        $.ajax({
            url:"/api/user/login",
            type:"post",
            dataType:'json',
            data:{
                username:$("#login-username").val(),
                password:$("#login-password").val(),
            },
            success:function (data) {
                console.log(data);
                if(data.code == 0){
                    location.reload();
                }
            },
            error:function(err){
                console.log(err);
            }
        });
    });

    $("#admin-logout").on("click",function () {
        $.ajax({
            url:"/api/user/logout",
            type:"get",
            dataType:"json",
            success:function(data){
                if(0 == data.code){
                    location.reload();
                }
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
});

