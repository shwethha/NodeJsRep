let mongoose = require('mongoose')
let crypto = require('crypto')
const PEPPER = 'HEART_ASYNC'
let nodeify = require('bluebird-nodeify')

require('songbird')

let UserSchema = mongoose.Schema({
	username: {
		type:String,
		required: true,
        unique: true
	},
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    blogTitle: {
    	type:String,
    	required: false
    } ,
    blogDescription: {
    	type:String,
    	required: false
    }
})

UserSchema.statics.generateHash = generateHash
async function generateHash(password) {
  let hash = await crypto.promise.pbkdf2(password, PEPPER, 4096, 512, 'sha256')
  return hash.toString('hex')
}

UserSchema.methods.validatePassword = async function (password) {
  let hash = await crypto.promise.pbkdf2(password, PEPPER, 4096, 512, 'sha256')
  return hash.toString('hex') === this.password
}

// Mongoose hooks don't pass callback last, so don't work with nodeifyit
UserSchema.pre('save', function(callback) {
    nodeify(async() => {
        if(this.isModified('password')) {
            this.password = await generateHash(this.password)
        }
        console.log('Saving data')
        
    }(), callback)
})

UserSchema.path('password').validate((pw) => {
	return pw.length >= 4 && /[A-Za-z0-9]/.test(pw)
})

module.exports = mongoose.model('User', UserSchema)
