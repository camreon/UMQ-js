
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
        var dataURL = 'http://gdata.youtube.com/feeds/api/videos/'
                      + url.split('v=')[1]
                      + "?v=2&alt=json-in-script&format=5&callback=getTitle";
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

        return (json == null ? url : json.entry.title.$t)
    };

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

Youtube.prototype = new Source();
