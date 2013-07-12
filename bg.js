var info = {};
var selectedInfo = null;
var selectedTab = null;
var selectedId = null;
var SPOTIFY_OPEN_URI = "https://open.spotify.com/search/";
var SPOTIFY_APP_URI = "spotify:search:track:";

function check(tabId, changeInfo, tab) {
	selectedTab = tab;
	selectedTabId = tabId;
	updateSelected(tabId);
}

function updateSelected(tabId) {
	selectedInfo = info[tabId];
	if (selectedInfo) {
		chrome.pageAction.setTitle({tabId:tabId, title:selectedInfo.title});
	}
}

chrome.tabs.onUpdated.addListener(check);

chrome.tabs.onSelectionChanged.addListener(function(tabId, info) {
	selectedId = tabId;
	updateSelected(tabId);
});

function grabSpotifyURL(vTitle) {
	vTitle = cleanTitle(vTitle);
	return SPOTIFY_APP_URI + encodeURIComponent(vTitle);
}

/* http://gskinner.com/RegExr/ */
/* http://jsfiddle.net/vikram/C7mHb/ */
function cleanTitle(vTitle) {

	var newtitle = vTitle;
    
	/* Removes anything between () and [] including the brackets */
    //newtitle = newtitle.replace(/ *\([^)]*\) */g,''); 
    //newtitle = newtitle.replace(/ *\[[^)]*\] */g,'');
	newtitle = newtitle.replace(/ *[\[\(][^)]*[\]\)] */g,'');

	/* Replaces & - + ( ) */
	newtitle = newtitle.replace(/[\&\+\(\)\-]/gi,'');
	
	/* Replaces ft, feat - ignore case + with/without a period */
	newtitle = newtitle.replace(/ft\.*|feat\.*/gi,'###');
	
	if(newtitle.indexOf('###') > 5) {
		newtitle = newtitle.substring(0, newtitle.indexOf('###'));
	}
	
	/* Replaces multi spaces with single spaces*/
	newtitle = newtitle.replace(/\s{2,}/gi,' ');
	
	return newtitle;
}

function storeTitle(vTitle) {
	if(info[selectedId]) {
		//do nothing
	} else {
		info[selectedId] = {};
	}
	info[selectedId].title = vTitle;
}

function updatePageAction() {
	chrome.pageAction.show(selectedId);
	selectedInfo = info[selectedId];
	if (selectedInfo) {
		chrome.pageAction.setTitle({tabId:selectedId, title:selectedInfo.title});
	}
}

chrome.pageAction.onClicked.addListener(function(tab){
	//windowReference = window.open(grabSpotifyURL(info[tab.id].title));
	chrome.tabs.update(tab.id, {url:grabSpotifyURL(info[tab.id].title)});
});

chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
	var vTitle = message.videoTitle;
	var spotyURL = grabSpotifyURL(vTitle);
	storeTitle(vTitle);
	updatePageAction();
	sendResponse({spotifyUrl:spotyURL});
});