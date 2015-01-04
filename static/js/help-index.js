$(document).ready(function (){
	comm.changeActive(3);
	$.fn.fullpage({
		slidesColor: ['#1bbc9b', '#4BBFC3', '#7BAABE', '#f90', '#7BAABE', '#7BAABE', '#7BAABE', '#7BAABE', '#7BAABE', '#1bbc9b', '#4BBFC3'],
		anchors: ['page1', 'page2', 'page3', 'page4', 'page5', 'page6', 'page7', 'page8', 'page9', 'page10', 'page11'],
		navigation: true,
		afterLoad: function(anchorLink, index){

		},
		onLeave: function(index, direction){

		}
	});
});