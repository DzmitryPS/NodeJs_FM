#! /C:/Users/Dima/env node

"use strict";

var util = require("util")
var path = require("path")
var fs = require("fs");
var Transform = require("stream").Transform;
var zlib = require("zlib");

var CAF = require("caf");

// var getStdin = require("get-stdin")

var args = require("minimist")(process.argv.slice(2),{
     boolean: ["help", "in", "out", "compress", "uncompress"], 
     string: ["file"]
    })


processFile = CAF(processFile);

function streamComplete(stream){
    return new Promise(function c(res){
        stream.on("end", res);
    })
}



var BASE_PATH = path.resolve(__dirname);

var OUTFILE = path.join(BASE_PATH, "out.txt")


if (args.in || args._.includes("-")){

   let tooLong = CAF.timeout(20, "Took to long");

  processFile(tooLong, process.stdin)
  .catch(error)
}
else if(args.file){
    let stream = fs.createReadStream(path.resolve(args.file))

   let tooLong = CAF.timeout(20, "Took to long");

    processFile(tooLong, stream).then(function(){console.log("complete");
})
  .catch(error)
}
else{
    error("Incorrect usage.", true)
}
console.log(args)

// process.stdout.write("hello world")
// console.error(" oops")
// process.stdin.read();

 function *processFile(signal, inStream){
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
    
    outStream.pipe(targetStream)

    signal.pr.catch(function f(){
        outStream.unpipe(targetStream)
        outStream.destroy();
    })

    yield streamComplete(outStream)
}

function error(msg, includeHelp = false){
    console.error(msg);
    if(includeHelp){
        console.log("includeHelp")
    }
}

