#!/usr/bin/env node
fs = require('fs')
var name = process.argv[2];
var fs = require('fs')
var fd = fs.openSync(name, 'w');
fs.futimesSync(fd, new Date(), new Date())
