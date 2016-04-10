# UMQ

## TODO
* automated import / export
* socket.io
* search
* edit info


## LOCAL SETUP:

Start nodejs and mongodb
```
$ mongod
$ mongoimport --db umq --collection playlist --drop --file test_playlist.json
```

##### TO RUN LOCALLY:
```
$ cd ~/UMQ
$ nodemon (or npm start)
```
Go to http://localhost:3000/


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

##### TO RUN W/ HEROKU:
```
$ git push heroku master
$ heroku open
```
