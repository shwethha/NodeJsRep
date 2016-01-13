let mongoose = require('mongoose')

let PostSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    // upvotes: {
    //     type: Number,
    //     default: 0
    // },
    image: {
        data: Buffer,
        contentType: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
})

// PostSchema.methods.upvote = async function() {
//   this.upvotes += 1
//   return this.save()
// }

module.exports = mongoose.model('Post', PostSchema)
