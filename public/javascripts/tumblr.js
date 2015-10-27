
function Tumblr() {
    Source.apply(this, arguments);
    var audio;

    this.GetAudio = function(url) {
        var audio_id = url.split('?')[0];
        var slashPosition = audio_id.lastIndexOf('/');
        audio_id = (slashPosition != -1) ? audio_id.substring(++slashPosition) : 'error';
        return( "http://a.tumblr.com/"+ audio_id +"o1.mp3" );
    };

    this.LoadTrack = function(audioURL) {
        this.SetupPlayer(audioURL);
        audio.play();
    };

    this.GetInfo = function(url) {};

    this.SetupPlayer = function(audioURL) {
        audio = $('audio')[0] || document.createElement('audio');
        audio.src = audioURL;
        audio.setAttribute("controls", "");
        if ($('audio').length === 0)
            $('#player').prepend(audio);
    };

    this.Stop = function() {
        audio.pause();
        audio.currentTime = 0;
    }

    //TODO Play(NextTrack().attr('url')); on state change
};

Tumblr.prototype = new Source();
