var nowPlaying; // number of the track that's playing
var player;

$('#playlist li').click(function (e) {
	// if (Play.Success) then
	nowPlaying = $(e.target).index();
	Play(e.target.innerText);
})

function Play(url) {
	var source = new Youtube();					// TODO determine source
	var audioURL = source.GetAudio(url);		// get input
	source.LoadTrack(audioURL);					// play it

	$('#playlist li').removeClass('active');
	CurrentTrack().addClass('active');			// highlight now playing
}

//TODO global pause and next buttons

function Source() {
	// this.player = null;
	this.GetAudio = function(url) {};
	this.LoadTrack = function(audioURL) {};
	this.SetupPlayer = function() {};
	this.GetInfo = function(url) {};
	// OnStateChange
	// DetermineSource? in constructor?
}

function Youtube() {
	Source.apply(this, arguments);

	this.GetAudio = function(url) {
		var video_id = url.split('v=')[1];
		var ampersandPosition = video_id.indexOf('&');
		if(ampersandPosition != -1)
			video_id = video_id.substring(0, ampersandPosition);
		return( "http://www.youtube.com/embed/"+ video_id +"?autoplay=1" );
	};
	this.LoadTrack = function(audioURL) {
		if (typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined') {
			window.onYouTubeIframeAPIReady = function() {
				this.SetupPlayer(audioURL);
			};

			$.getScript('//www.youtube.com/iframe_api');
		} else {
			this.SetupPlayer(audioURL);
		}
	};
	this.GetInfo = function(url) {
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
	};
	this.SetupPlayer = function(audioURL) {
		if (player) player.destroy();
		player = new YT.Player('player', {
			events: {
				'onReady': function(e) {
					player.loadVideoByUrl(audioURL);
				},
				'onStateChange': function(e) {
					if (e.data == YT.PlayerState.ENDED) {
						Play(NextTrack());
					}
				}
			}
		});
	};
};
Youtube.prototype = new Source();

function NextTrack() {
	nowPlaying++;
	return CurrentTrack().text();
}

function CurrentTrack() {
	return $("#playlist li:eq(" + nowPlaying + ")");
}
