#! /C:/Users/Dima/env node

"use strict";

var util = require("util")
var path = require("path")
var fs = require("fs");
var Transform = require("stream").Transform;
var zlib = require("zlib");

// var getStdin = require("get-stdin")

var args = require("minimist")(process.argv.slice(2),{
     boolean: ["help", "in", "out", "compress", "uncompress"], 
     string: ["file"]
    })

var BASE_PATH = path.resolve(__dirname);

var OUTFILE = path.join(BASE_PATH, "out.txt")


if (args.in || args._.includes("-")){
  processFile(process.stdin);

}
else if(args.file){
    let stream = fs.createReadStream(path.resolve(args.file))
    processFile(stream);

}
else{
    error("Incorrect usage.", true)
}
console.log(args)

// process.stdout.write("hello world")
// console.error(" oops")
// process.stdin.read();

function processFile(inStream){
    var outStream = inStream;

    if(args.uncompress){
        let gunzipStream = zlib.createGunzip();
        outStream = outStream.pipe(gunzipStream)
    }

  var upperStream = new Transform({
      transform(chunk,enc,next){
          this.push(chunk.toString().toUpperCase());
          next();
      }
  });
  outStream = outStream.pipe(upperStream);

  if(args.compress){
     let gzipStream = zlib.createGzip()
      outStream = outStream.pipe(gzipStream);
      OUTFILE = `${OUTFILE}.gz`;
  }

    var targetStream;

    if(args.out){
        targetStream =  process.stdout
    }
    else{
        targetStream = fs.createWriteStream(OUTFILE);
    }
    process.stdout;
    outStream.pipe(targetStream)
}

function error(msg, includeHelp = false){
    console.error(msg);
    if(includeHelp){
        console.log("includeHelp")
    }
}

