"use strict";
(function(){
    var resultsView = null;
    var testSuitesView = null;
    var singleTestSuiteTemplate = null;
    var testSuiteDetailView = null;
    var singleTestCaseTemplate = null;
    var newTestCaseTemplate = null;
    var newTestCaseActions;
    var dropdownTemplate = null;
    $(document).on("loadDocumentation",function(){
        $.ajax({
            url:"dummyPayload/dummyDocumentation.htm",
            type:"GET",
            success:function(rtnData){
                $(".stage").html(rtnData);
            }
        });
    });
    if(!resultsView){
        $.get("templates/dropdownlayout.mst",function(template){
            dropdownTemplate = template;
        });
    }
    // To be placed after login
    $.ajax({
        "url":"dummyPayload/userActions.json",
        "type":"GET",
        "dataType":"json",
        "success":function(rtnData){
            newTestCaseActions = rtnData;
        }
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
    $(document).on("loadTestSuiteDetails",function(e,data){
        if(!testSuiteDetailView){
            $.get("templates/testSuiteDetails.mst",function(template){
                testSuiteDetailView = template;
                $(document).trigger("loadTestSuiteDetails",[data]);
            });
        }else{
            $.ajax({
                "url":"dummyPayload/testSuiteDetails.json",
                "type":"GET",
                "dataType":"json",
                "success":function(rtnData){
                    var rendered = Mustache.render(testSuiteDetailView,rtnData);
                    $(".stage").html(rendered);
                    // Make the rows sortable by dragging
                    $(".sortableTable").sortable({
                        containerSelector: 'table',
                        itemPath: '> tbody',
                        itemSelector: 'tr',
                        placeholder: '<tr class="placeholder"/>'
                    });
                }
            });
        }
    });
    $(document).on("newtestcase",function(e,data){
        if(!newTestCaseTemplate){
            $.get("templates/newTestCase.mst",function(template){
                newTestCaseTemplate = template;
                $(document).trigger("newtestcase",[data]);
            });
        }else{
            var rendered = Mustache.render(newTestCaseTemplate);
            $(".stage").html(rendered);
            var firstFormControl = newTestCaseActions[0];
            if(firstFormControl.actionType === "userSelects"){
                var selectRendered = Mustache.render(dropdownTemplate,{"options":firstFormControl.selectOptions});
            }
            $("#newTestCase").prepend("<div class='col s12 input-group'><label for='"+firstFormControl.fieldName+"'>"+firstFormControl.label+"</label><select name='"+firstFormControl.fieldName+"' class='"+firstFormControl.fieldName+" triggersAction' id='"+firstFormControl.fieldName+"'>"+selectRendered+"</select></div>");
            $('.'+firstFormControl.fieldName).material_select();
        }
    });
    $(document).on("change","select.triggersAction",function(e){
        // Clear all the next elements
        $(this).closest(".input-group").nextAll(".input-group").remove();
        var selectedValue = $(this).find("option:selected").val();
        var formControl = newTestCaseActions.filter(function(action){
            return action.action === selectedValue;
        })[0];
        if(formControl.actionType === "userSelects"){
            var selectRendered = Mustache.render(dropdownTemplate,{"options":formControl.selectOptions});
            $(this).closest(".input-group").after("<div class='col s12 input-group'><label for='"+formControl.fieldName+"'>"+formControl.label+"</label><select name='"+formControl.fieldName+"' class='"+formControl.fieldName+" triggersAction' id='"+formControl.fieldName+"'>"+selectRendered+"</select></div>");
            $('.'+formControl.fieldName).material_select();
        }
        if(formControl.actionType === "userInput"){
            $(this).closest(".input-group").after("<div class='col s12 input-group'><label for='"+formControl.fieldName+"'>"+formControl.label+"</label><input type='text' name='"+formControl.fieldName+"' class='"+formControl.fieldName+" triggersAction' id='"+formControl.fieldName+"'></div>");
        }
    });
})()