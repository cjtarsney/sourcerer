var express             = require('express'),
    connect             = require('connect'),
    url                 = require('url'),
    http                = require('http'),
    async               = require('async'),
    webSocketServer     = require('ws').Server;
    require('dotenv').config();

var app = express(),
    server = http.createServer(app),
    port = process.env.PORT || 5000;

server.listen(port);
console.log("http server listening on %d", port);

app.use(express.static(__dirname + '/public'));

app.get('/',function(req,res){
  res.sendFile(__dirname+'/public/home.html');
});

app.get('/account',function(req,res){
  res.sendFile(__dirname+'/public/account.html');
})
