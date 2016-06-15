```
NOTE: This repo is the original version. Use https://github.com/camreon/UMQ instead.
```

UMQ (Universal Media Queuer)

## LOCAL SETUP:

Create .env file with mongodb conn string

Start nodejs and mongodb
```
$ mongod
$ mongoimport --db umq --collection playlist --drop --file test_playlist.json
```

##### LOCAL DEPLOY:
```
$ cd ~/UMQ
$ heroku local web (which runs nodemon from the Procfile)
```
Go to http://localhost:5000/

##### TO TEST:
```
$ mocha
```

##### TO DEBUG:
```
$ node-debug app.js
$ (or DEBUG=express:* node ./bin/www)
$ (or node debug app.js)
```


## HEROKU SETUP:

```
$ mongo ds019960.mlab.com:19960/heroku_6k49cpxd -u <username> -p <password>
$ mongoimport -h ds019960.mlab.com:19960 -d heroku_6k49cpxd -c playlist -u <username> -p <password> --file test_playlist.json
```

##### HEROKU DEPLOY:
```
$ git push heroku master
$ heroku open
```

## TODO
* automated import / export
* socket.io
* search
* edit info
