# UMQ

## TODO
* automated import / export
* socket.io
* search
* edit info


## LOCAL SETUP:

Start node.js and Postgres
```
$ psql
$ CREATE TABLE playlist (
    url varchar(255) NOT NULL CHECK (url <> ''),
    id integer NOT NULL,
    title varchar(100),
    artist varchar(100),
    "position" integer DEFAULT 0 NOT NULL,
);
$ ALTER TABLE playlist ADD COLUMN id SERIAL;
$ UPDATE playlist SET id = DEFAULT;
$ ALTER TABLE playlist ADD PRIMARY KEY (id);

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
