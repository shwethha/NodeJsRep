let http = require('http')
let fs = require('fs')
let through = require('through')
let request = require('request')
let argv = require('yargs')
		.default('host','localhost')
		.argv

let scheme = 'http://'
let port = argv.port || argv.host === 'localhost' ? 8000: 80 

//let destinationUrl = '127.0.0.1:8000'

let destinationUrl = argv.url || scheme + argv.host + ':' + port
let logStream = argv.logfile ? fs.createWriteStream(argv.logfile) : process.stdout

http.createServer((req, res) => {
	logStream.write('\nEcho Request :\n' + JSON.stringify(req.headers))
    //console.log(`Request received at: ${req.url}`)
    //console.log(JSON.stringify(req.headers))
    for(let header in req.headers){
    	res.setHeader(header, req.headers[header])
    }
    through(req,logStream, {autoDestroy: false})
    req.pipe(res)
    
}).listen(8000)

console.log('Listening to Server')

http.createServer((req, res) => {
	let url = destinationUrl;
	if(req.headers['x-destination-url']){
		url = req.headers['x-destination-url']
	}
  console.log(`Proxying request to: ${destinationUrl + req.url}`)
  let options ={
  	headers: req.headers,
  	url:url+req.url
  }
  console.log(JSON.stringify(req.headers))
  through(req,logStream, {autoDestroy: false})

  let destinationResponse = req.pipe(request(options))

  console.log(JSON.stringify(destinationResponse.headers))
  through(destinationResponse,logStream, {autoDestroy: false})
  //destinationResponse.pipe(res)
  destinationResponse.pipe(logStream)
}).listen(8001)