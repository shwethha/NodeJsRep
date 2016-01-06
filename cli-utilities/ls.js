#!/usr/bin/env node

var fs = require('fs');

var path = process.argv[2];
 
fs.readdir(path, function(err, items) {
   // console.log(items); 
    for (var i=0; i<items.length; i++) {      
console.log(items[i]);
fs.readdir(path+'/'+items[i], function(err, newitems) {  
   console.log(newitems);
})

    }
});