//express,path librarii

var express=require('express');
var path=require('path');

//function call express
var app=express();
var rootPath=path.normalize(__dirname + '/../');

app.use(express.static(rootPath + '/app'));

app.listen(3000);

console.log("Listening on port 3000...")
