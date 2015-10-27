
var nowPlaying; // number of the track that's currently playing
var source;

$('#playlist tr').click(function (e) {
	// if (Play.Success) then
	nowPlaying = $(e.currentTarget).index() + 1;
	Play(e.currentTarget.getAttribute('url'));
});


function Play(url) {
	if (source) source.Stop();					// stop last track

	source = DetermineSource(url);
	var audioURL = source.GetAudio(url);		// get input
	source.LoadTrack(audioURL);					// play it

	$('#playlist tr').removeClass('success');
	CurrentTrack().addClass('success');			// highlight now playing
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
	if 		(~url.indexOf('youtube')) return new Youtube()
	else if (~url.indexOf('tumblr'))  return new Tumblr()
	else 							  return null;
}

// TODO soundcloud & bandcamp
// TODO re-ordering
