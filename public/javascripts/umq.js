
var nowPlaying; // number of the track that's currently playing
var source;

$('#playlist tr').click(function (e) {
	nowPlaying = $(e.currentTarget).index() + 1;

	var id = $(this).find('#id').html();
	$.get('playlist/' + id, function(url) {
		var u = url;
		Play(u);
	});
});


function Play(url) {
	if (source) source.Stop();				// stop last track
	source = DetermineSource(url);
	source.LoadTrack(url);					// play it

	$('#playlist tr').removeClass('success');
	CurrentTrack().addClass('success');		// highlight now playing
}

function NextTrack() {
	nowPlaying++;
	return CurrentTrack();
}

function CurrentTrack() {
	return $("#playlist tr:eq(" + nowPlaying + ")");
}

function DetermineSource(url)
{
	if 		(~url.indexOf('youtube')) return new Youtube();
	// else if (~url.indexOf('tumblr'))  return new Tumblr();
	else {
		return new Tumblr();
		// console.log('invalid audio source');
		// return null;
	}
}
