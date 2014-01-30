$(document).ready( function(){

	$(".protractor-options li").click(function(){
		$(".protractor-options li").removeClass('selected');
		$(this).addClass('selected');
		var orientation = $(this).attr('data-plane');			
	});

	$('#protractor-tool').draggable();
	
});

