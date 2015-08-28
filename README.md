# UMQ

## LOCAL SETUP:

Start node.js and Postgres
```
$ psql
$ create table playlist (url varchar(100) NOT NULL CHECK (url <> ''));
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
$ create table playlist (url varchar(100) NOT NULL CHECK (url <> ''));
$ \q
```

##### TO RUN W/ HEROKU:
```
$ git push heroku master
$ heroku open
```
