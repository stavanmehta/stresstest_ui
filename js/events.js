"use strict";
(function(){
    var resultsView = null;
    $(document).on("loadDocumentation",function(){
        $.ajax({
            url:"dummyPayload/dummyDocumentation.htm",
            type:"GET",
            success:function(rtnData){
                $(".stage").html(rtnData);
            }
        });
    });
    $(document).on("loadResults",function(){
        if(!resultsView){
            $.get("templates/results.mst",function(template){
                resultsView = template;
                $(document).trigger("loadResults");
            });
            return;
        }
        $.ajax({
            "url":"dummyPayload/results.json",
            "type":"GET",
            "dataType":"json",
            "success":function(rtnData){
                var rendered = Mustache.render(resultsView,rtnData);
                $(".stage").html(rendered);
                // Initiate material select
                $('select').material_select();
            }
        })
    });
})()