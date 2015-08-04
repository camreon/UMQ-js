//http://gerogiatehc.tumblr.com/post/118988666373/lentoviolento-art-of-noise-moments-in-love
function Tumblr() {
    Source.apply(this, arguments);

    this.GetAudio = function(url) {
        var audio_id = url.split('?')[0];
        var slashPosition = audio_id.lastIndexOf('/');
        audio_id = (slashPosition != -1) ? audio_id.substring(++slashPosition) : 'error';
        return( "http://a.tumblr.com/"+ audio_id +"o1.mp3" );
    };

    this.LoadTrack = function(audioURL) {
        var audio = new Audio(audioURL);
        audio.play();
    };

    this.GetInfo = function(url) {};

    this.SetupPlayer = function(audioURL) {
        if (player) player.destroy();
        player = new YT.Player('player', {
            playerVars: { 'showinfo': 0, 'controls': 0, 'autohide': 1 },
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

Tumblr.prototype = new Source();
