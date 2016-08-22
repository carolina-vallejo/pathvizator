function my_easy_ui(){
	console.log($('#svg-wrap').length);

	$('#svg-wrap').on('click','g',function(){
		//console.log($(this));
	});
}