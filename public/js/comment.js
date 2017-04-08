$("#submit-btn").on('click',function () {
    var content = $("#text").val();

    if(!content){
        console.log("内容为空");
        return;
    }

    $.ajax({
        url:"/api/comment/post",
        type:"post",
        data:{
            contentId:$("#contentId").val(),
            content:content
        },
        dataType:'json',
        success:function (data) {
            if(data.code == 0){
                location.reload();
            }
        }
    });
});


