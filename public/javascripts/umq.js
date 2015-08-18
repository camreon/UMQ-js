
var nowPlaying; // number of the track that's currently playing
var source;
/* get and set track text */
// $(function() {
// 	$('#playlist li').each(function() {
//		var url = $(this).attr('url');
// 		var source = DetermineSource(url);
// 		var info = source.GetInfo(url);
// 		$(this).text(info);
// 	});
// });

$('#playlist li').click(function (e) {
	// if (Play.Success) then
	nowPlaying = $(e.target).index();
	Play(e.target.getAttribute('url'));
})


function Play(url) {
	if (source) source.Stop();					// stop last track

	source = DetermineSource(url);
	var audioURL = source.GetAudio(url);		// get input
	source.LoadTrack(audioURL);					// play it

	$('#playlist li').removeClass('active');
	CurrentTrack().addClass('active');			// highlight now playing
}

function NextTrack() {
	nowPlaying++;
	return CurrentTrack();
}

function CurrentTrack() {
	return $("#playlist li:eq(" + nowPlaying + ")");
}

function DetermineSource(url)
{
	if 		(~url.indexOf('youtube')) return new Youtube()
	else if (~url.indexOf('tumblr'))  return new Tumblr()
	else 							  return null;
}

// TODO display track info
// TODO soundcloud & bandcamp
// TODO easier way to add tumblr tracks (chrome extension?)
// TODO re-ordering
