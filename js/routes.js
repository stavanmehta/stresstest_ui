"use strict";
var router = (function(){
    window.onhashchange = function(){
        var currentHash = location.hash.replace("#","");
        loadView(currentHash);
    };
    function loadView(viewName){
        $(".navigation a").removeClass("active");
        $(".navigation").find("a[href='#"+viewName+"']").addClass("active");
        if(viewName === "documentation"){$(document).trigger("loadDocumentation");};
        if(viewName === "results"){$(document).trigger("loadResults");};
    }
    return{
        loadView:loadView
    }
})();
$(function(){
    var loadedHash = location.hash.replace("#","");
    if(loadedHash!==""){
        router.loadView(loadedHash);
    }
})