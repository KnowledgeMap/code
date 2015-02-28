$(document).ready(function (){
    $(".searchSpan").css("visibility","hidden");
    $("img").click(function (){
    	var src = $(this).attr("src"),
    		split = src.split('/');
    		split[split.length - 1] = "max_" + split[split.length - 1],
    		split = split.join("/");
    	window.open(split);
    })
});