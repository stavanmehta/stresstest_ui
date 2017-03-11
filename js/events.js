"use strict";
(function(){
    $(document).on("loadDocumentation",function(){
        $.ajax({
            url:"dummyPayload/dummyDocumentation.htm",
            type:"GET",
            success:function(rtnData){
                $(".stage").html(rtnData);
            }
        });
    });
})()