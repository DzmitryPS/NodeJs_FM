#! /C:/Users/Dima/env node

"use strict";

var util = require("util")
var path = require("path")
var fs = require("fs");

var getStdin = require("get-stdin")

var args = require("minimist")(process.argv.slice(2),{
     boolean: ["help", "in"], 
     string: ["file"]
    })



if(args.help){
    console.log(args.help)
}

else if (args.in || args._.includes("-")){
 getStdin().then(processFile).catch(error);
}
else if(args.file){
    fs.readFile(path.resolve(args.file), function onContenst(err, contents){
        if(err){
            error(err.toString());
        }
        else{
            processFile(contents.toString())
        
        }
    })
}
else{
    error("Incorrect usage.", true)
}
console.log(args)

// process.stdout.write("hello world")
// console.error(" oops")
// process.stdin.read();

function processFile(contents){
    //   contents = contents.toString().toUpperCase
    process.stdout.write(contents)
}

function error(msg, includeHelp = false){
    console.error(msg);
    if(includeHelp){
        console.log("includeHelp")
    }
}

