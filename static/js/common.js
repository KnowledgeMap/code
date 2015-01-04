//存放公共函数
var comm = comm || {};
comm.changeActive = function (i){
	$(".nav > li").removeClass('active');
	$(".nav > li:eq("+ i +")").addClass('active');
}