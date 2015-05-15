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

///////////////////////////////////////////////////////////////////////////

function GetAudioURL(url) {
	var video_id = url.split('v=')[1];
	var ampersandPosition = video_id.indexOf('&');
	if(ampersandPosition != -1) {
	  video_id = video_id.substring(0, ampersandPosition);
	}
	return( "http://www.youtube.com/embed/"+ video_id +"?autoplay=" + AUTOPLAY );
}

function SetNowPlaying(url) {
	// 			   http://gdata.youtube.com/feeds/api/videos/	 id 	        		?v=2&alt=json
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
	//comment
}

function AddToPlaylist(url) {
	// determine source
	var source = new Youtube();

	// get input
	var audioURL = source.GetAudio(url);

	// play it
	$('#player').attr('src', audioURL);

	// add it to playlist
	var title = source.GetInfo(url);
	console.log(title);
}


///////////////////////////////////////////////////////////////////////////

$('#playlist > li').click(function () {
	AddToPlaylist( $("#input").val() );
})

$('#input').keyup(function (e) {
	if (e.originalEvent.keyCode == 13) {
		$('#add').trigger('click');
	}
});

$(function() {
	$("input").focus();

	//AddToPlaylist("https://www.youtube.com/watch?v=BOAk0XklCpI"); //debug
});
