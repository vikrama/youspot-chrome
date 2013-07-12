$(function(){ 

	var title = $('meta[itemprop="name"]').attr('content');
	
	chrome.runtime.sendMessage({videoTitle: title}, function(response) {
	  console.log(response.spotifyUrl);
	});

});