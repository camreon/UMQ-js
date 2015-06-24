function Source() {
	// this.audio;
	// this.info
}
Source.prototype = {
	GetAudio: function(url) {},
	GetInfo: function(url) {}
};

function Youtube() {};
Youtube.prototype = new Source();
Youtube.prototype.GetAudio = GetAudioURL;
Youtube.prototype.GetInfo = SetNowPlaying;
Youtube.prototype.constructor = Youtube;

var AUTOPLAY = 1;
var player;
var nowPlaying;

///////////////////////////////////////////////////////////////////////////

function GetAudioURL(url) {
	var video_id = url.split('v=')[1];
	var ampersandPosition = video_id.indexOf('&');
	if(ampersandPosition != -1)
		video_id = video_id.substring(0, ampersandPosition);

	return( "http://www.youtube.com/embed/"+ video_id +"?autoplay=" + AUTOPLAY );
}

function SetNowPlaying(url) {
	var dataURL = 'http://gdata.youtube.com/feeds/api/videos/' + url.split('v=')[1] + "?v=2&alt=json";
	var json = (function() {
    	var json = null;
	    $.ajax({
	        'async': false,
	        'global': false,
	        'url': dataURL,
	        'dataType': "json",
	        'success': function(data) {
	            json = data;
	        }
	    });
	    return json;
    })();

	return json.entry.title.$t
}

function Play(url) {
	var source = new Youtube(); 		 // determine source
	var audioURL = source.GetAudio(url); // get input
	player.loadVideoByUrl(audioURL);     // play it
	alert("playing track number " + nowPlaying);
}

function NextTrack() {
	var url = $("#playlist li:eq(" + (nowPlaying++) + ")").get(0);
	return url.innerText;
}


///////////////////////////////////////////////////////////////////////////

$('#playlist > li').click(function (e) {
	nowPlaying = $(e.target).index() + 1; // set now playing track
	Play(e.target.innerText);
})

$('#input').keyup(function (e) {
	if (e.originalEvent.keyCode == 13) {
		$('#add').trigger('click');
	}
});

$(function() {
	$("input").focus();

	// show titles for each URL
	// $("#playlist > li").each(function (i) {
	// 	var url = $(this).text();
	// 	var source = new Youtube();
	// 	var title = source.GetInfo(url);

	// 	var titleElement = document.createElement('div');

	// 	$(this)[0].appendChild(titleElement);
	// });
});

function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	});
}
function onPlayerReady(event) {
	alert("player ready");
}
function onPlayerStateChange(event) {
	if (event.data == YT.PlayerState.ENDED) {
    	Play(NextTrack());
    }
}