var assert = require('assert');
var request = require('supertest');


describe('add to playlist', function() {
    var tests = [
        { type: 'tumbrl_page',    url: 'http://justcuzurafraidurpeerswillfindou.tumblr.com/post/138394745892/babydreamgirl-babydreamgirl-this-is-the' },
        { type: 'tumbrl_audio',   url: 'https://a.tumblr.com/tumblr_o1fksl7KOf1sop1rzo1.mp3#_=_' },
        { type: 'bandcamp_page',  url: 'https://jebediahspringfield.bandcamp.com/track/i-like-killing-flies-2' },
        { type: 'youtube_page',   url: 'https://www.youtube.com/watch?v=c5OS0nALlfQ&sns=fb' }
    ];
    var invalid_tests = [
        { type: 'bandcamp_audio',    url: 'https://p1.bcbits.com/download/track/7a14ab38227d81d996ab84a9650f48bd/mp3-128/572422288?fsig=d7669fb7d35f61b0d3faf08e073f07d3&id=572422288&stream=1&ts=1458950400.0&e=1458950460&rs=32&ri=960&h=fa6265922b1925c48e8ffcd90dcbef82' },
        { type: 'bandcamp_audio_2',  url: 'poppler5' },
        { type: 'youtube_audio',     url: 'https://r18---sn-5uaeznl6.googlevideo.com/videoplayback?requiressl=yes&sparams=clen%2Cdur%2Cgir%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cnh%2Cpcm2%2Cpl%2Crequiressl%2Csource%2Cupn%2Cexpire&pl=25&dur=485.560&fexp=3300102%2C3300133%2C3300164%2C3312144%2C3312381%2C9405191%2C9407156%2C9407610%2C9416126%2C9420452%2C9422596%2C9423661%2C9423662%2C9426729%2C9427035%2C9427902%2C9429103%2C9429145%2C9429379%2C9429835%2C9431012%2C9431117%2C9432417%2C9432580&mn=sn-5uaeznl6&mm=31&ip=2601%3A480%3A8501%3Ae900%3A28c4%3Ae59d%3A6b29%3A4dec&key=yt6&keepalive=yes&gir=yes&initcwndbps=345000&mt=1458940720&ms=au&ipbits=0&lmt=1398374522392909&upn=nYlTiVU1p_w&mv=m&source=youtube&sver=3&clen=24775351&pcm2=no&itag=243&nh=IgpwcjAyLmF0bDIyKg0yMDAxOjU1OTo6ZDY1&mime=video%2Fwebm&expire=1458962471&id=o-ACE-TIW1aduXkxLUbiWMiV-FrGKCZPLSrHYnfj3lEysT&cpn=dFe73FE9h44iOWyh&alr=yes&ratebypass=yes&signature=AE80E4559860D30C18B7ADD49E438B2057656B94.5589D8A9B96E10D791B73F3D2C3E90EB023F4A2C&c=WEB&cver=1.20160323&range=994696-1813643&rn=8&rbuf=19931' },
        { type: 'invalid_url',       url: 'xxx' }
    ];

    var host_url = 'http://localhost:3000'
    var app = request.agent(host_url);

    tests.forEach(function(test) {
        it(test.type + ' added', function(done) {
            app.post('/playlist')
                .send({ url: test.url })
                .expect(302, done);
        });
    });

    invalid_tests.forEach(function(test) {
        it(test.type + ' can\'t be added', function(done) {
            app.post('/playlist')
                .send({ url: test.url })
                .expect(400, done);
        });
    });
});
