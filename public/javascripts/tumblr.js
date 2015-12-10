
function Tumblr() {
    Source.apply(this, arguments);
    var audio;

    this.LoadTrack = function(audioURL) {
        this.SetupPlayer(audioURL);
        audio.play();
    };

    this.SetupPlayer = function(audioURL) {
        audio = $('audio')[0] || document.createElement('audio');
        audio.src = audioURL;
        audio.setAttribute("controls", ""); // play/pause buttons

        if ($('audio').length === 0) $('#player').prepend(audio);
    };

    this.Stop = function() {
        audio.pause();
        audio.currentTime = 0;
    }

    //TODO Play(NextTrack().attr('url')); on state change
};

Tumblr.prototype = new Source();
