"use strict";
(function(){
    var resultsView = null;
    var testSuitesView = null;
    var singleTestSuiteTemplate = null;
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
                $("table.results").tablesorter();
            }
        });
    });
    $(document).on("loadtestsuites",function(){
        if(!testSuitesView){
            $.get("templates/testsuites.mst",function(template){
                testSuitesView = template;
                $(document).trigger("loadtestsuites");
            });
            return;
        }
        $.ajax({
            "url":"dummyPayload/testSuitesResult.json",
            "type":"GET",
            "dataType":"json",
            "success":function(rtnData){
                var rendered = Mustache.render(testSuitesView,rtnData);
                $(".stage").html(rendered);
                $('.modal').modal();
                if(!singleTestSuiteTemplate){
                    $.get("templates/testsuite.mst",function(template){
                        singleTestSuiteTemplate = template;
                    });
                    return;
                }
                // Initiate material select
                // $('select').material_select();
                // $("table.results").tablesorter();
            }
        })
    });
    $(document).on("click",".submitTestSuite",function(){
        // Test suite id is expected from ajax call
        var newTestSuite = {"testSuiteName":$(".newTestSuiteName").val(),"testSuiteId":200};
        var rendered = Mustache.render(singleTestSuiteTemplate,newTestSuite);
        $(".testSuites tbody").append(rendered);
    });
})()