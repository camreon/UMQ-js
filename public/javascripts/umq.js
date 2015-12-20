
var nowPlaying; // number of the track that's currently playing
var source;

$('#playlist tr').click(function (e) {
	nowPlaying = $(e.currentTarget).index() + 1;
	Play(CurrentTrack());
});


function Play(url) {
	if (source) source.Stop();				// stop last track
	DetermineSource(url);
	source.LoadTrack(url);					// play it
	MarkCurrentTrack();
}

function MarkCurrentTrack() {
	var track = $("#playlist tr:eq("+nowPlaying+")");

	$('#playlist tr').removeClass('success');
	track.addClass('success');
}

function CurrentTrack() {
	var track = $("#playlist tr:eq("+nowPlaying+")");
	var id = track.find('#id').html();

	$.get('playlist/' + id, function(url) {
		return url; // TODO promise
	});
}

function NextTrack() {
	nowPlaying++;
	return CurrentTrack();
}

function DetermineSource(url)
{
	if (~url.indexOf('youtube')) source = new Youtube();
	// else if (~url.indexOf('tumblr')) return new Tumblr();
	else {
		source = new HTML5();
		// console.log('invalid audio source');
		// return null;
	}
}
