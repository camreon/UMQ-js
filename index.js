function Source() {
	// this.audio;
	// this.info
}
Source.prototype = {
	getAudio: function(url) {},
	getInfo: function(url) {}
};
function Youtube() {}
Youtube.prototype = new Source();
Youtube.prototype.getAudio = getAudioURL;
Youtube.prototype.getInfo = setNowPlaying;
Youtube.prototype.constructor = Youtube;

//comment




$('#add').click(function () {
	// determine source
	var youtube = new Youtube();

	// get value of field
	var link = youtube.getAudio( $("#addLink").val() );

	// play it
	$('#player').attr('src', link);

	youtube.getInfo(link);

	// add it to playlist

})

function getAudioURL(link) {
	var video_id = link.split('v=')[1];
	var ampersandPosition = video_id.indexOf('&');
	if(ampersandPosition != -1) {
	  video_id = video_id.substring(0, ampersandPosition);
	}
	return( "http://www.youtube.com/embed/"+ video_id +"?autoplay=1" );
}

function setNowPlaying(link) {
	// 			   http://gdata.youtube.com/feeds/api/videos/	id 	  ?v=2&alt=json%27
	var dataURL = 'http://gdata.youtube.com/feeds/api/videos/' + $("#addLink").val().split('v=')[1] + "?v=2&alt=json";
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

	$("#playlist").text(json.entry.title.$t);
}


$('#addLink').keyup(function (e) {
	if (e.originalEvent.keyCode == 13) {
		$('#add').trigger('click');
	}
});
