#!/usr/bin/env node
fs = require('fs')
var name = process.argv[2];
fs.mkdirSync(name)