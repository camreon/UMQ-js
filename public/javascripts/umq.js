
var nowPlaying; // number of the track that's currently playing
var player;

/* get and set track text */
// $(function() {
// 	$('#playlist li').each(function() {
//		var url = $(this).attr('data-url');
// 		var source = DetermineSource(url);
// 		var info = source.GetInfo(url);
// 		$(this).text(info);
// 	});
// });

$('#playlist li').click(function (e) {
	// if (Play.Success) then
	nowPlaying = $(e.target).index();
	Play(e.target.getAttribute('data-url'));
})

function Play(url) {
	var source = DetermineSource(url);
	var audioURL = source.GetAudio(url);		// get input
	source.LoadTrack(audioURL);					// play it

	$('#playlist li').removeClass('active');
	CurrentTrack().addClass('active');			// highlight now playing
}

function NextTrack() {
	nowPlaying++;
	return CurrentTrack().text();
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

//TODO global pause and next buttons
