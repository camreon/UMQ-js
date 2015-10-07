# UMQ

## TODO
* automated import / export
* socket.io

## LOCAL SETUP:

Start node.js and Postgres
```
$ psql
$ create table playlist (url varchar(255) NOT NULL CHECK (url <> ''),
                         title varchar(100),
                         artist varchar(100),
                         position integer NOT NULL);
$ \q
```

##### TO RUN LOCALLY:
```
$ cd ~/UMQ
$ npm start (or DEBUG=myapp ./bin/www)
```
Go to http://localhost:3000/


##### TO DEBUG KINDA:
```
$ node debug app.js
```


## HEROKU SETUP:

```
$ heroku pg:psql
$ create above table
```

##### TO RUN W/ HEROKU:
```
$ git push heroku master
$ heroku open
```
