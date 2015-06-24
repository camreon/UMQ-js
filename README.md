# UMQ

INITIAL LOCAL SETUP:
1. Run node.js, Postgres, and
2. $ psql
2. $ create table playlist (url varchar(100) NOT NULL CHECK (url <> ''));
3.

------

TO RUN LOCALLY:
$ cd ~/UMQ
$ npm start (or DEBUG=myapp ./bin/www)
Go to http://localhost:3000/

TO RUN W/ HEROKU:
$ git push heroku master
$ heroku open


TO DEBUG KINDA:
$ node debug app.js
