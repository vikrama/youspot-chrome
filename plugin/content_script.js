$(function(){ 

	var title = $('meta[itemprop="name"]').attr('content');
	
	var SUBSCRIPTION_BOX_ID = '#watch7-subscription-container';
	
	//var tmpl = '<span id="HearInSpotifyWrapper">' +
	var tmpl = 		'<span class="hearInSpotifyContainer">' +
						'<button type="button" class="hearInSpotify" onclick=";return false;" aria-role="button" role="button">' +
							'<span class="youspot-button-icon-wrapper">' +
								'<img class="youspot-button-icon" src="icon-sm.png" alt="" title="">' +
								'<span class="youspot-button-valign"></span>' +
							'</span>' +
							'<span class="youspot-button-content">' +
								'<span class="youspot-button-label" aria-label="Play in Spotify">Play in Spotify</span> ' +
							'</span>' +
						'</button>' +
					'</span>';
		//		'</span>';
	
	chrome.runtime.sendMessage({videoTitle: title}, function(response) {
	  
	  console.log(response.spotifyUrl);
	  
	  var $subscribeContainer = $('#watch7-subscription-container');
	  var $spotifyContainer = $('<span>').attr('id','HearInSpotifyWrapper');
	  
	  $spotifyContainer.append(tmpl);
	  $subscribeContainer.after($spotifyContainer);
	  
	  $spotifyContainer.click(function(e) {
		e.preventDefault();
		window.location = response.spotifyUrl;
	  });
	  
	  $('img.youspot-button-icon').attr('src', chrome.extension.getURL("icon-sm.png"));
	});

});