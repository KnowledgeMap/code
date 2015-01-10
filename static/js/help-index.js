$(document).ready(function (){
	comm.changeActive(3);
	$.fn.fullpage({
		slidesColor: ['#1bbc9b', '#4BBFC3', '#7BAABE', '#f90', '#7BAABE', '#7BAABE', '#7BAABE', '#7BAABE', '#7BAABE', '#1bbc9b', '#4BBFC3'],
		anchors: ['page1', 'page2', 'page3', 'page4', 'page5', 'page6', 'page7', 'page8', 'page9', 'page10', 'page11'],
		navigation: true,
        scrollingSpeed: 400,
		navigationTooltips: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'],
		afterLoad: function(anchorLink, index){
			if(index == 1){
					jQuery("#ticker").ticker({
				 		cursorList:  " ",
				 		rate:        100,
				 		delay:       4000
					}).trigger("play").trigger("stop");

				    // Trigger events 
				    jQuery(".stop").click(function(){
				        jQuery("#ticker").trigger("stop");
				        return false;
				    });
				    
				    jQuery(".play").click(function(){
				        jQuery("#ticker").trigger("play");
				        return false;
				    });
			}
		},
		onLeave: function(index, direction){

		}
	});

    // Instantiate jTicker 
	jQuery("#ticker").ticker({
 		cursorList:  " ",
 		rate:        200,
 		delay:       4000
	}).trigger("play").trigger("stop");

    // Trigger events 
    jQuery(".stop").click(function(){
        jQuery("#ticker").trigger("stop");
        return false;
    });
    
    jQuery(".play").click(function(){
        jQuery("#ticker").trigger("play");
        return false;
    });
});