let fs = require('fs')
let rimraf = require('rimraf')
let mkdirp = require('mkdirp')
let net = require('net')
let jsonSocket = require('json-socket')
let http = require('http')
let path = require('pn/path')

const TCP_SERVER_PORT = '8009'
const TCP_SERVER_HOST = 'localhost'
const HTTP_SERVER_PORT = '8000'
const HTTP_SERVER_HOST = 'localhost'
const ROOT_DIR = process.env.CLIENT_ROOT_DIR

let socket = new jsonSocket(new net.Socket())

socket.connect(TCP_SERVER_PORT, TCP_SERVER_HOST);

socket.on('connect', function() { 
     
     socket.sendMessage({name: 'client1'})
     
     socket.on('message', function(message) {

         console.log(message)

         switch(message.type){
            case 'file':
                console.log('inside file')
                //makeCallToServer(message)
                break
            case 'dir':
                updateFileSystem(message)                  
                break          
         }

     })
	
})


function updateFileSystem (message) {

  let filePath = path.resolve(path.join(ROOT_DIR, message.path))

  async() => {

      if(message.action === 'add'){
           if(stat){
            console.log('folder already exists')
            return
           }
           await mkdirp.promise(req.dirPath)
      }else {
           await rimraf.promise(req.filePath)
      }  
  }()
   
  }
